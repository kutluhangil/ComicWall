// Kargo bildirimi e-postası (admin-only).
// Body: { orderId }. Sadece admin rolü çalıştırabilir.
// RESEND_API_KEY yoksa gönderim atlanır (best-effort, ok:true, delivered:false).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  orderId: string;
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
    const { orderId } = body;
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId zorunlu" }), {
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

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.warn("RESEND_API_KEY tanımlı değil — kargo bildirimi e-postası gönderilmedi.");
      return new Response(JSON.stringify({ ok: true, delivered: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const from = Deno.env.get("ORDER_EMAIL_FROM") || "ComicWall <siparis@comicwall.com.tr>";
    const shipping = (order.shipping_info || {}) as Record<string, string>;
    const to = shipping.email;

    if (!to) {
      console.warn("Siparişte e-posta adresi yok — kargo bildirimi gönderilmedi.");
      return new Response(JSON.stringify({ ok: true, delivered: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trackingNumber = order.tracking_number as string | null;
    const carrier = order.carrier as string | null;

    const html = `
      <h2>Siparişiniz kargoya verildi 📦</h2>
      <p>Merhaba ${shipping.firstName || ""},</p>
      <p>Sipariş numaranız: <strong>${orderId}</strong></p>
      ${carrier ? `<p>Kargo firması: <strong>${carrier}</strong></p>` : ""}
      ${trackingNumber ? `<p>Takip numarası: <strong>${trackingNumber}</strong></p>` : ""}
      <p>Siparişiniz en kısa sürede adresinize teslim edilecektir.</p>
      <p>— ComicWall</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: "Siparişiniz kargoya verildi", html }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", detail);
      return new Response(JSON.stringify({ ok: true, delivered: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, delivered: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-shipping-notification error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
