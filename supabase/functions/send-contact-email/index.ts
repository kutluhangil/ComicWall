// İletişim formu e-posta gönderimi (Resend).
// RESEND_API_KEY tanımlı değilse istek doğrulanır ama gönderim atlanır (delivered:false).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactBody = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Tüm alanlar zorunlu" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const to = Deno.env.get("CONTACT_EMAIL_TO") || "destek@comicwall.com.tr";
    const from = Deno.env.get("CONTACT_EMAIL_FROM") || "ComicWall <iletisim@comicwall.com.tr>";

    // Anahtar yoksa: form geçerli, gönderim altyapısı henüz bağlı değil.
    if (!resendKey) {
      console.warn("RESEND_API_KEY tanımlı değil — iletişim e-postası gönderilmedi.");
      return new Response(JSON.stringify({ ok: true, delivered: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = `
      <h2>Yeni iletişim mesajı</h2>
      <p><strong>Ad:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
      <p><strong>Konu:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: email, subject: `İletişim: ${subject}`, html }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", detail);
      return new Response(JSON.stringify({ error: "E-posta gönderilemedi" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, delivered: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-email error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
