import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const WhatsAppBubble = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after a 5 second delay to catch user attention
    const timer = setTimeout(() => setShowTooltip(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const tooltipText = t("whatsapp.tooltip");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="bg-card border border-border text-foreground px-3.5 py-2 rounded-2xl shadow-xl text-xs font-semibold relative max-w-[200px]"
          >
            {tooltipText}
            <button
              onClick={() => setShowTooltip(false)}
              aria-label={t("common.close")}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-muted hover:bg-muted-foreground/20 rounded-full flex items-center justify-center text-[10px] text-muted-foreground border border-border leading-none"
            >
              ×
            </button>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-2 h-2 rotate-45 border-t border-r border-border bg-card"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Live Support"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full flex items-center justify-center shadow-2xl transition-colors cursor-pointer relative"
      >
        <MessageCircle className="w-7 h-7 fill-white/10" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </motion.a>
    </div>
  );
};

export default WhatsAppBubble;
