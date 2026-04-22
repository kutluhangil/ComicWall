import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "comicwall.cookieConsent";

const CookieBanner = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) {
      const timer = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const persist = (value: "all" | "essential") => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, timestamp: new Date().toISOString() })
      );
    } catch {
      // sessizce yok say
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[90]"
          role="dialog"
          aria-live="polite"
          aria-label={t("cookie.title")}
        >
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-5 sm:p-6">
            <button
              type="button"
              onClick={() => persist("essential")}
              aria-label="Kapat"
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bebas text-xl tracking-wide text-foreground leading-tight">
                  {t("cookie.title")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {t("cookie.desc")}{" "}
                  <Link to="/cookies" className="text-primary hover:underline">
                    {t("cookie.learnMore")}
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => persist("all")}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                {t("cookie.accept")}
              </button>
              <button
                type="button"
                onClick={() => persist("essential")}
                className="flex-1 bg-muted border border-border text-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-muted/70 transition-colors"
              >
                {t("cookie.reject")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
