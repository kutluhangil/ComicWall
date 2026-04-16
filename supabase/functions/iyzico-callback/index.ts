// iyzico'dan dönen callback. Token ile ödeme detaylarını sorgular ve sipariş durumunu günceller.
// Kullanıcıyı /order-success veya /order-failed sayfasına yönlendirir.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function hmacSha256Hex(key: string, msg: string): Promise<string> {
  return crypto.subtle
    .importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    .then((k) => crypto.subtle.sign("HMAC", k, new TextEncoder().encode(msg)))
    .then((sig) => Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join(""));
}

async function generateAuthHeader(apiKey: string, secretKey: string, uri: string, payload: string, randomKey: string) {
  const signature = await hmacSha256Hex(secretKey, randomKey + uri + payload);
  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  return `IYZWSv2 ${btoa(authString)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("IYZICO_API_KEY");
    const secretKey = Deno.env.get("IYZICO_SECRET_KEY");
    const baseUrl = Deno.env.get("IYZICO_BASE_URL") || "https://sandbox-api.iyzipay.com";

    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    const origin = url.searchParams.get("origin") || "";

    // iyzico POST eder (form-data) — token gelir
    let token: string | null = null;
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const formText = await req.text();
        const params = new URLSearchParams(formText);
        token = params.get("token");
      } else if (contentType.includes("application/json")) {
        const json = await req.json();
        token = json.token;
      }
    } else {
      token = url.searchParams.get("token");
    }

    if (!token || !orderId || !apiKey || !secretKey) {
      return Response.redirect(`${origin}/order-failed`, 303);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // iyzico'dan ödeme sonucunu sorgula
    const uri = "/payment/iyzipos/checkoutform/auth/ecom/detail";
    const payload = JSON.stringify({ locale: "tr", token });
    const randomKey = `${Date.now()}-${crypto.randomUUID()}`;
    const auth = await generateAuthHeader(apiKey, secretKey, uri, payload, randomKey);

    const verifyRes = await fetch(`${baseUrl}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth,
        "x-iyzi-rnd": randomKey,
      },
      body: payload,
    });
    const verifyJson = await verifyRes.json();
    console.log("iyzico verify:", verifyJson);

    if (verifyJson.status === "success" && verifyJson.paymentStatus === "SUCCESS") {
      await adminClient
        .from("orders")
        .update({
          status: "paid",
          iyzico_payment_id: verifyJson.paymentId?.toString() || null,
        })
        .eq("id", orderId);

      return Response.redirect(`${origin}/order-success?orderId=${orderId}`, 303);
    } else {
      await adminClient.from("orders").update({ status: "failed" }).eq("id", orderId);
      return Response.redirect(`${origin}/order-failed?orderId=${orderId}`, 303);
    }
  } catch (err) {
    console.error("Callback error:", err);
    const url = new URL(req.url);
    const origin = url.searchParams.get("origin") || "";
    return Response.redirect(`${origin}/order-failed`, 303);
  }
});
