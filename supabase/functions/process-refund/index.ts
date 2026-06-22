// Admin: iade talebini onaylar (iyzico'da iptal/iade dener) veya reddeder.
// Body: { orderId, action: 'approve' | 'reject' }.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  orderId: string;
  action: "approve" | "reject";
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    const uid = userData.user.id;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleRow, error: roleErr } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();

    if (roleErr || !roleRow) {
      return new Response(JSON.stringify({ error: "Bu işlem için yetkiniz yok" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: RequestBody = await req.json();
    const { orderId, action } = body;

    if (!orderId || (action !== "approve" && action !== "reject")) {
      return new Response(JSON.stringify({ error: "orderId ve geçerli action zorunlu" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error: orderErr } = await adminClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Sipariş bulunamadı" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reject") {
      const { error: updateErr } = await adminClient
        .from("orders")
        .update({ refund_status: "rejected" })
        .eq("id", orderId);

      if (updateErr) {
        console.error("process-refund reject update error:", updateErr);
        return new Response(JSON.stringify({ error: "İade reddedilemedi" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // action === "approve" — iyzico'da iptal/iade dene
    const apiKey = Deno.env.get("IYZICO_API_KEY");
    const secretKey = Deno.env.get("IYZICO_SECRET_KEY");
    const baseUrl = Deno.env.get("IYZICO_BASE_URL") || "https://sandbox-api.iyzipay.com";

    if (!apiKey || !secretKey) {
      return new Response(
        JSON.stringify({ error: "iyzico API anahtarları yapılandırılmamış. Lütfen sistem yöneticisiyle iletişime geçin." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order.iyzico_payment_id) {
      return new Response(JSON.stringify({ error: "Bu sipariş için ödeme kaydı bulunamadı" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const uri = "/payment/cancel";
    const iyzicoPayload = {
      locale: "tr",
      conversationId: order.iyzico_conversation_id || orderId,
      paymentId: order.iyzico_payment_id,
      ip: "85.34.78.112",
    };
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
    console.log("iyzico cancel response:", iyzicoJson);

    if (iyzicoJson.status !== "success") {
      return new Response(
        JSON.stringify({ error: iyzicoJson.errorMessage || "iyzico iade hatası", details: iyzicoJson }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateErr } = await adminClient
      .from("orders")
      .update({ status: "cancelled", refund_status: "refunded" })
      .eq("id", orderId);

    if (updateErr) {
      console.error("process-refund approve update error:", updateErr);
      return new Response(JSON.stringify({ error: "İade işlendi ancak sipariş güncellenemedi" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("process-refund error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
