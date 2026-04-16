import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";

const OrderSuccess = () => {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (!orderId) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single()
      .then(({ data }) => setOrder(data));
  }, [orderId]);

  return (
    <>
      <SEO title="Sipariş Onayı — ComicWall" description="Siparişiniz başarıyla alındı." canonicalUrl="/order-success" />
      <SiteHeader />
      <main className="pt-32 pb-20 max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-card border border-border rounded-3xl p-8 sm:p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex w-20 h-20 rounded-full bg-accent/15 items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </motion.div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-3">{t("orderSuccess.title")}</h1>
          <p className="text-muted-foreground text-base mb-6">{t("orderSuccess.desc")}</p>

          {orderId && (
            <div className="bg-muted/40 rounded-2xl p-4 mb-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{t("orderSuccess.orderNo")}</p>
              <p className="font-mono text-sm text-foreground break-all">{orderId}</p>
              {order && (
                <p className="font-bebas text-2xl text-primary mt-3">{formatPrice(Number(order.total_amount))}</p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" /> {t("orderSuccess.viewOrders")}
            </Link>
            <Link
              to="/shop"
              className="flex-1 border border-border text-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> {t("orderSuccess.continueShopping")}
            </Link>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </>
  );
};

export default OrderSuccess;
