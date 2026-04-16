import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingBag, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";

interface OrderItem {
  id: string;
  product_title: string;
  size: string;
  quantity: number;
  line_total: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  order_items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  paid: "bg-accent/15 text-accent",
  preparing: "bg-secondary/15 text-secondary",
  shipped: "bg-primary/15 text-primary",
  delivered: "bg-accent/20 text-accent",
  failed: "bg-destructive/15 text-destructive",
  cancelled: "bg-destructive/10 text-destructive",
};

const Orders = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <>
      <SEO title="Siparişlerim — ComicWall" description="Sipariş geçmişiniz ve durum takibi." canonicalUrl="/orders" />
      <SiteHeader />
      <main className="pt-24 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-2">{t("orders.title")}</h1>
        <p className="text-sm text-muted-foreground mb-8">Tüm siparişlerinizi ve teslimat durumlarınızı buradan takip edebilirsiniz.</p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-3xl">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">{t("orders.empty")}</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> {t("cart.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("orders.orderNo")}</p>
                    <p className="font-mono text-xs sm:text-sm text-foreground">{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-xl ${STATUS_COLORS[order.status] || "bg-muted text-muted-foreground"}`}>
                      {t(`orders.status.${order.status}`)}
                    </span>
                    <span className="font-bebas text-2xl text-primary">{formatPrice(Number(order.total_amount))}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{t("orders.items")}</p>
                  <ul className="space-y-1">
                    {order.order_items?.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.product_title} <span className="text-muted-foreground">({item.size}) ×{item.quantity}</span>
                        </span>
                        <span className="text-muted-foreground">{formatPrice(Number(item.line_total))}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
};

export default Orders;
