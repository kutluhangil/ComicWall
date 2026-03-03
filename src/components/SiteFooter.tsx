import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SiteFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bebas text-2xl tracking-wider mb-3">
              COMIC<span className="text-primary">WALL</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">{t("footer.shop")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">{t("footer.allPosters")}</Link></li>
              <li><Link to="/collections" className="hover:text-foreground transition-colors">{t("footer.collections")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">{t("footer.info")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">{t("footer.shippingReturns")}</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">{t("footer.contact")}</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">{t("footer.faq")}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4 text-foreground">{t("footer.connect")}</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-secondary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">{t("footer.newsletter")}</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-muted border border-border text-sm px-3 py-2.5 flex-1 rounded-l-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground text-xs uppercase tracking-widest px-4 py-2.5 rounded-r-xl hover:bg-primary/90 transition-colors font-semibold">
                  {t("footer.join")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 sm:mt-12 pt-6 sm:pt-8 text-center text-xs text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
