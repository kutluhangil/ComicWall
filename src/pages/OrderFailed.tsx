import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { motion } from "motion/react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";

const OrderFailed = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO title="Ödeme Başarısız — ComicWall" description="Ödemeniz tamamlanamadı." canonicalUrl="/order-failed" />
      <SiteHeader />
      <main className="pt-32 pb-20 max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-3xl p-8 sm:p-10 text-center"
        >
          <div className="inline-flex w-20 h-20 rounded-full bg-destructive/15 items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-3">{t("orderFailed.title")}</h1>
          <p className="text-muted-foreground text-base mb-6">{t("orderFailed.desc")}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/checkout"
              className="flex-1 bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
            >
              {t("orderFailed.tryAgain")}
            </Link>
            <Link
              to="/cart"
              className="flex-1 border border-border text-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-muted transition-colors"
            >
              {t("orderFailed.backToCart")}
            </Link>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </>
  );
};

export default OrderFailed;
