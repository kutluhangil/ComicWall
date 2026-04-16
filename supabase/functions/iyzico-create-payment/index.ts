// iyzico Checkout Form ödeme başlatma edge function'ı
// HMAC-SHA256 imzalı v2 auth header kullanır
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartLine {
  productId: string;
  productTitle: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  identityNumber?: string;
}

interface RequestBody {
  items: CartLine[];
  shipping: ShippingInfo;
  callbackOrigin: string;
}

function hmacSha256Hex(key: string, msg: string): Promise<string> {
  return crypto.subtle
    .importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    .then((k) => crypto.subtle.sign("HMAC", k, new TextEncoder().encode(msg)))
    .then((sig) => Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join(""));
}

async function generateAuthHeader(apiKey: string, secretKey: string, uri: string, payload: string, randomKey: string) {
  // iyzico v2 auth: signature = HEX(HMAC-SHA256(secret, randomKey + uri + payload))
  const signature = await hmacSha256Hex(secretKey, randomKey + uri + payload);
  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  const encoded = btoa(authString);
  return `IYZWSv2 ${encoded}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("IYZICO_API_KEY");
    const secretKey = Deno.env.get("IYZICO_SECRET_KEY");
    const baseUrl = Deno.env.get("IYZICO_BASE_URL") || "https://sandbox-api.iyzipay.com";

    if (!apiKey || !secretKey) {
      return new Response(
        JSON.stringify({ error: "iyzico API anahtarları yapılandırılmamış. Lütfen sistem yöneticisiyle iletişime geçin." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Yetkilendirme gerekli" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Geçersiz oturum" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    const body: RequestBody = await req.json();
    const { items, shipping, callbackOrigin } = body;

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Sepet boş" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

    // 1) Sipariş kaydı oluştur (pending)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: orderData, error: orderErr } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total_amount: totalAmount,
        currency: "TRY",
        shipping_info: shipping,
      })
      .select()
      .single();

    if (orderErr || !orderData) {
      console.error("Order create error:", orderErr);
      return new Response(JSON.stringify({ error: "Sipariş oluşturulamadı" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderId = orderData.id;

    // 2) Sipariş kalemlerini ekle
    const orderItems = items.map((i) => ({
      order_id: orderId,
      product_id: i.productId,
      product_title: i.productTitle,
      size: i.size,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      line_total: i.unitPrice * i.quantity,
    }));
    await adminClient.from("order_items").insert(orderItems);

    // 3) iyzico Checkout Form initialize isteği hazırla
    const conversationId = orderId;
    const callbackUrl = `${supabaseUrl}/functions/v1/iyzico-callback?orderId=${orderId}&origin=${encodeURIComponent(callbackOrigin)}`;

    const iyzicoPayload = {
      locale: "tr",
      conversationId,
      price: totalAmount.toFixed(2),
      paidPrice: totalAmount.toFixed(2),
      currency: "TRY",
      basketId: orderId,
      paymentGroup: "PRODUCT",
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: user.id,
        name: shipping.firstName,
        surname: shipping.lastName,
        gsmNumber: shipping.phone,
        email: shipping.email,
        identityNumber: shipping.identityNumber || "11111111111",
        registrationAddress: shipping.address,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "85.34.78.112",
        city: shipping.city,
        country: shipping.country || "Turkey",
        zipCode: shipping.postalCode,
      },
      shippingAddress: {
        contactName: `${shipping.firstName} ${shipping.lastName}`,
        city: shipping.city,
        country: shipping.country || "Turkey",
        address: shipping.address,
        zipCode: shipping.postalCode,
      },
      billingAddress: {
        contactName: `${shipping.firstName} ${shipping.lastName}`,
        city: shipping.city,
        country: shipping.country || "Turkey",
        address: shipping.address,
        zipCode: shipping.postalCode,
      },
      basketItems: items.map((i) => ({
        id: `${i.productId}-${i.size}`,
        name: `${i.productTitle} (${i.size})`,
        category1: "Poster",
        itemType: "PHYSICAL",
        price: (i.unitPrice * i.quantity).toFixed(2),
      })),
    };

    const uri = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
    const payloadStr = JSON.stringify(iyzicoPayload);
    const randomKey = `${Date.now()}-${crypto.randomUUID()}`;
    const auth = await generateAuthHeader(apiKey, secretKey, uri, payloadStr, randomKey);

    const iyzicoRes = await fetch(`${baseUrl}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth,
        "x-iyzi-rnd": randomKey,
      },
      body: payloadStr,
    });

    const iyzicoJson = await iyzicoRes.json();
    console.log("iyzico response:", iyzicoJson);

    if (iyzicoJson.status !== "success") {
      await adminClient.from("orders").update({ status: "failed" }).eq("id", orderId);
      return new Response(
        JSON.stringify({ error: iyzicoJson.errorMessage || "iyzico hatası", details: iyzicoJson }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Token'ı kaydet
    await adminClient
      .from("orders")
      .update({
        iyzico_token: iyzicoJson.token,
        iyzico_conversation_id: conversationId,
      })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({
        orderId,
        paymentPageUrl: iyzicoJson.paymentPageUrl,
        token: iyzicoJson.token,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
