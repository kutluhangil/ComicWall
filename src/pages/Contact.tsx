import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { toast } from "@/hooks/use-toast";

const inputClass =
  "w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const Contact = () => {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Gerçek gönderim için bir edge function veya Resend entegrasyonu gerekir;
    // şimdilik başarılı gönderim simülasyonu yapıyoruz.
    await new Promise((r) => setTimeout(r, 700));
    toast({ title: t("contact.success") });
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  const isEn = language === "en";

  return (
    <>
      <SEO
        title={isEn ? "Contact — ComicWall" : "İletişim — ComicWall"}
        description={
          isEn
            ? "Reach ComicWall customer support for orders, returns or partnerships."
            : "ComicWall müşteri desteği, sipariş, iade veya iş birliği için bize ulaşın."
        }
        canonicalUrl="/contact"
      />
      <SiteHeader />
      <main className="pt-24 pb-20 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{t("contact.badge")}</p>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">{t("contact.title")}</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t("contact.desc")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <a href={`mailto:${SITE_CONFIG.email}`} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
            <Mail className="w-5 h-5 text-primary mb-3" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{t("auth.email")}</p>
            <p className="text-sm text-foreground font-medium break-all">{SITE_CONFIG.email}</p>
          </a>
          <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
            <Phone className="w-5 h-5 text-secondary mb-3" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{t("checkout.phone")}</p>
            <p className="text-sm text-foreground font-medium">{SITE_CONFIG.phone}</p>
          </a>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-accent mb-3" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">WhatsApp</p>
            <p className="text-sm text-foreground font-medium">{t("contact.liveSupport")}</p>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-bebas text-2xl tracking-wide text-foreground mb-2">{t("contact.writeUs")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("contact.name")}
                className={inputClass}
              />
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("contact.email") || "E-posta"}
                className={inputClass}
              />
            </div>
            <input
              required
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder={t("contact.subject")}
              className={inputClass}
            />
            <textarea
              required
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t("contact.message")}
              rows={6}
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? t("contact.sending") : t("contact.send")}
            </button>
          </form>

          <aside className="bg-card border border-border rounded-2xl p-6 space-y-4 h-fit">
            <div>
              <MapPin className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{t("contact.address")}</p>
              <p className="text-sm text-foreground leading-relaxed">{SITE_CONFIG.address}</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{t("contact.hours")}</p>
              <p className="text-sm text-foreground">{t("contact.hoursValue")}</p>
              <p className="text-sm text-muted-foreground">{t("contact.hoursRange")}</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{t("contact.corporate")}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {SITE_CONFIG.legalName}<br />
                MERSİS: {SITE_CONFIG.mersis}
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default Contact;
