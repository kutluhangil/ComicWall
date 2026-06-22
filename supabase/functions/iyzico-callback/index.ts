// iyzico'dan dönen callback. Token ile ödeme detaylarını sorgular ve sipariş durumunu günceller.
// Başarılıysa kupon kullanım sayacını artırır ve (RESEND_API_KEY varsa) onay e-postası gönderir.
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

// Kupon kullanıldıysa used_count'u artır (best-effort, düşük hacim için yeterli).
async function incrementCouponUsage(adminClient: ReturnType<typeof createClient>, code: string | null) {
  if (!code) return;
  try {
    const { data } = await adminClient.from("coupons").select("used_count").eq("code", code).maybeSingle();
    if (data) {
      await adminClient
        .from("coupons")
        .update({ used_count: Number(data.used_count) + 1 })
        .eq("code", code);
    }
  } catch (e) {
    console.error("Coupon usage increment failed:", e);
  }
}

// Onay e-postası (best-effort). RESEND_API_KEY yoksa sessizce atlanır.
async function sendOrderEmail(order: Record<string, unknown>) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return;
  const from = Deno.env.get("ORDER_EMAIL_FROM") || "ComicWall <siparis@comicwall.com.tr>";
  const adminEmail = Deno.env.get("ORDER_EMAIL_ADMIN");

  const shipping = (order.shipping_info || {}) as Record<string, string>;
  const to = shipping.email;
  const orderId = order.id as string;
  const total = Number(order.total_amount).toFixed(2);

  const html = `
    <h2>Siparişiniz alındı 🎉</h2>
    <p>Merhaba ${shipping.firstName || ""},</p>
    <p>Sipariş numaranız: <strong>${orderId}</strong></p>
    <p>Toplam tutar: <strong>${total} TL</strong></p>
    <p>Siparişiniz hazırlanmaya başlandığında tekrar bilgilendirileceksiniz.</p>
    <p>— ComicWall</p>`;

  const recipients: { to: string; subject: string }[] = [];
  if (to) recipients.push({ to, subject: "ComicWall — Siparişiniz Alındı" });
  if (adminEmail) recipients.push({ to: adminEmail, subject: `Yeni sipariş: ${orderId} (${total} TL)` });

  for (const r of recipients) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: r.to, subject: r.subject, html }),
      });
    } catch (e) {
      console.error("Order email failed:", e);
    }
  }
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
      const { data: order } = await adminClient
        .from("orders")
        .update({
          status: "paid",
          iyzico_payment_id: verifyJson.paymentId?.toString() || null,
        })
        .eq("id", orderId)
        .select()
        .single();

      if (order) {
        await incrementCouponUsage(adminClient, (order.coupon_code as string | null) ?? null);
        await sendOrderEmail(order as Record<string, unknown>);
      }

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
