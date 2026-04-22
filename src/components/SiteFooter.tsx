import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail, Send, Check, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SiteFooter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast({ title: t("newsletter.invalidEmail"), variant: "destructive" });
      return;
    }
    setState("loading");
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast({ title: t("newsletter.exists") });
          setState("success");
          setEmail("");
          return;
        }
        throw error;
      }

      toast({ title: t("newsletter.success") });
      setState("success");
      setEmail("");
    } catch {
      toast({ title: t("newsletter.error"), variant: "destructive" });
      setState("idle");
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10">
          <div className="col-span-2">
            <h3 className="font-bebas text-2xl tracking-wider mb-3">
              COMIC<span className="text-primary">WALL</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-xs">
              {t("footer.tagline")}
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                <span className="leading-relaxed">{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-foreground transition-colors break-all">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="hover:text-foreground transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">{t("footer.shop")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">{t("footer.allPosters")}</Link></li>
              <li><Link to="/collections" className="hover:text-foreground transition-colors">{t("footer.collections")}</Link></li>
              <li><Link to="/wishlist" className="hover:text-foreground transition-colors">{t("nav.wishlist")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">{t("footer.info")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shipping-returns" className="hover:text-foreground transition-colors">{t("footer.shippingReturns")}</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">{t("footer.faq")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link to="/kvkk" className="hover:text-foreground transition-colors">{t("footer.kvkk")}</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link></li>
              <li><Link to="/pre-info" className="hover:text-foreground transition-colors">{t("footer.preInfo")}</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground transition-colors">{t("footer.cookies")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-3 text-foreground">{t("footer.connect")}</h4>
            <p className="text-xs text-muted-foreground mb-3 max-w-sm">{t("footer.newsletter")}</p>
            <form onSubmit={handleSubscribe} className="flex max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
                disabled={state === "loading"}
                className="bg-muted border border-border text-sm px-3 py-2.5 flex-1 rounded-l-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="bg-primary text-primary-foreground text-xs uppercase tracking-widest px-4 py-2.5 rounded-r-xl hover:bg-primary/90 transition-colors font-semibold disabled:opacity-60 inline-flex items-center gap-1.5"
              >
                {state === "success" ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                {t("footer.join")}
              </button>
            </form>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} aria-label="E-posta" className="text-muted-foreground hover:text-accent transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-3 text-foreground">Kurumsal</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {SITE_CONFIG.legalName}<br />
              MERSİS: {SITE_CONFIG.mersis}<br />
              {SITE_CONFIG.taxOffice} V.D. / {SITE_CONFIG.taxNumber}<br />
              {SITE_CONFIG.etbis ? <>ETBİS: {SITE_CONFIG.etbis}<br /></> : null}
            </p>
            <div className="flex gap-3 mt-4 md:justify-end opacity-70">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded-md px-2 py-1">
                iyzico
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded-md px-2 py-1">
                256-bit SSL
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded-md px-2 py-1">
                KVKK
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
