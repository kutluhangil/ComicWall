// iyzico Checkout Form ödeme başlatma edge function'ı
// HMAC-SHA256 imzalı v2 auth header kullanır.
// İndirim ve kargo SUNUCU TARAFINDA hesaplanır; kupon DB'den doğrulanır.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Kargo eşikleri — src/lib/siteConfig.ts ile eşleşmeli
const FREE_SHIPPING_THRESHOLD = 750;
const STANDARD_SHIPPING_FEE = 49;

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
  coupon?: { code?: string } | null;
  callbackOrigin: string;
}

interface ResolvedCoupon {
  code: string | null;
  discount: number;
  freeShipping: boolean;
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
  return `IYZWSv2 ${btoa(authString)}`;
}

// Kuponu DB'den doğrula ve indirimi sunucu tarafında hesapla.
// Client'tan gelen tutarlara asla güvenilmez.
async function resolveCoupon(
  adminClient: ReturnType<typeof createClient>,
  code: string | undefined | null,
  subtotal: number,
): Promise<ResolvedCoupon> {
  const empty: ResolvedCoupon = { code: null, discount: 0, freeShipping: false };
  if (!code) return empty;

  const normalized = code.trim().toUpperCase();
  const { data } = await adminClient
    .from("coupons")
    .select("*")
    .eq("code", normalized)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return empty;

  const now = new Date();
  if (data.starts_at && new Date(data.starts_at) > now) return empty;
  if (data.expires_at && new Date(data.expires_at) < now) return empty;
  if (data.max_uses != null && data.used_count >= data.max_uses) return empty;
  if (subtotal < Number(data.min_order_amount)) return empty;

  if (data.discount_type === "percent") {
    return { code: data.code, discount: Math.round((subtotal * Number(data.discount_value)) / 100), freeShipping: false };
  }
  if (data.discount_type === "fixed") {
    return { code: data.code, discount: Math.min(Number(data.discount_value), subtotal), freeShipping: false };
  }
  if (data.discount_type === "free_shipping") {
    return { code: data.code, discount: 0, freeShipping: true };
  }
  return empty;
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

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // --- Fiyat & stok doğrulaması (client'a güvenme) ---
    // product_variants tablosu varsa fiyatlar DB'den ZORUNLU alınır.
    // Tablo henüz yoksa (migration uygulanmadıysa) client fiyatına düşülür.
    try {
      const ids = [...new Set(items.map((i) => i.productId))];
      const { data: variants, error: varErr } = await adminClient
        .from("product_variants")
        .select("product_id, size, price, stock")
        .in("product_id", ids);

      if (!varErr && variants && variants.length > 0) {
        const variantMap = new Map<string, { price: number; stock: number }>();
        for (const v of variants) {
          variantMap.set(`${v.product_id}|${v.size}`, { price: Number(v.price), stock: Number(v.stock) });
        }
        for (const item of items) {
          const v = variantMap.get(`${item.productId}|${item.size}`);
          if (!v) {
            return new Response(JSON.stringify({ error: `Ürün bulunamadı: ${item.productTitle}` }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          if (v.stock < item.quantity) {
            return new Response(JSON.stringify({ error: `Stok yetersiz: ${item.productTitle}` }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          item.unitPrice = v.price; // DB fiyatını zorla
        }
      }
    } catch (e) {
      console.warn("Variant fiyat doğrulaması atlandı (tablo yok olabilir):", e);
    }

    // --- Tutarları sunucu tarafında hesapla ---
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const resolved = await resolveCoupon(adminClient, body.coupon?.code, subtotal);
    const subtotalAfterDiscount = Math.max(0, subtotal - resolved.discount);
    const baseShipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const shippingAmount = resolved.freeShipping ? 0 : baseShipping;
    const totalAmount = subtotalAfterDiscount + shippingAmount;

    if (totalAmount <= 0) {
      return new Response(JSON.stringify({ error: "Geçersiz sipariş tutarı" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Sipariş kaydı oluştur (pending)
    const { data: orderData, error: orderErr } = await adminClient
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        subtotal_amount: subtotal,
        discount_amount: resolved.discount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        coupon_code: resolved.code,
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

    const orderId = orderData.id as string;

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
    //    price = ürünler + kargo (basketItems toplamı buna eşit olmalı)
    //    paidPrice = tahsil edilecek tutar (indirim price'tan düşülür)
    const conversationId = orderId;
    const callbackUrl = `${supabaseUrl}/functions/v1/iyzico-callback?orderId=${orderId}&origin=${encodeURIComponent(callbackOrigin)}`;

    const basketItems = items.map((i) => ({
      id: `${i.productId}-${i.size}`,
      name: `${i.productTitle} (${i.size})`,
      category1: "Poster",
      itemType: "PHYSICAL",
      price: (i.unitPrice * i.quantity).toFixed(2),
    }));
    if (shippingAmount > 0) {
      basketItems.push({
        id: "shipping",
        name: "Kargo",
        category1: "Shipping",
        itemType: "VIRTUAL",
        price: shippingAmount.toFixed(2),
      });
    }

    const iyzicoPayload = {
      locale: "tr",
      conversationId,
      price: (subtotal + shippingAmount).toFixed(2),
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
      basketItems,
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
