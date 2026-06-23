import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingBag, ChevronRight, Truck, ExternalLink, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "@/hooks/use-toast";
import OrderTimeline from "@/components/OrderTimeline";

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
  tracking_number: string | null;
  carrier: string | null;
  refund_status: string | null;
  refund_reason: string | null;
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

const CARRIER: Record<string, { label: string; url: (t: string) => string }> = {
  aras: { label: "Aras Kargo", url: (t) => `https://www.araskargo.com.tr/tr/cargo-tracking?code=${t}` },
  yurtici: { label: "Yurtiçi Kargo", url: (t) => `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${t}` },
  mng: { label: "MNG Kargo", url: (t) => `https://kargotakip.mngkargo.com.tr/?takipNo=${t}` },
  ptt: { label: "PTT Kargo", url: (t) => `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${t}` },
  surat: { label: "Sürat Kargo", url: (t) => `https://www.suratkargo.com.tr/KargoTakip/?kargonu=${t}` },
};

const REFUND_ELIGIBLE_STATUSES = ["paid", "preparing", "shipped", "delivered"];

const REFUND_BADGE_COLORS: Record<string, string> = {
  requested: "bg-secondary/15 text-secondary",
  approved: "bg-accent/15 text-accent",
  refunded: "bg-accent/20 text-accent",
  rejected: "bg-destructive/15 text-destructive",
};

const Orders = () => {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundOpenId, setRefundOpenId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundSubmitting, setRefundSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  const fetchOrders = () => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, order_items(*), tracking_number, carrier, refund_status, refund_reason")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleRefundSubmit = async (orderId: string) => {
    if (!refundReason.trim()) {
      toast({ title: t("orders.refund.reasonRequired"), variant: "destructive" });
      return;
    }
    setRefundSubmitting(true);
    const { error } = await supabase.functions.invoke("request-refund", {
      body: { orderId, reason: refundReason.trim() },
    });
    setRefundSubmitting(false);
    if (error) {
      toast({ title: t("orders.refund.submitError"), description: t("orders.refund.tryLater"), variant: "destructive" });
      return;
    }
    toast({ title: t("orders.refund.success") });
    setRefundOpenId(null);
    setRefundReason("");
    fetchOrders();
  };

  if (authLoading || !user) return null;

  return (
    <>
      <SEO title={`${t("orders.title")} — ComicWall`} description={t("orders.seo.description")} canonicalUrl="/orders" />
      <SiteHeader />
      <main className="pt-[var(--header-h)] max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-2">{t("orders.title")}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t("orders.subtitle")}</p>

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
                      {new Date(order.created_at).toLocaleDateString(language === "en" ? "en-US" : "tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-xl ${STATUS_COLORS[order.status] || "bg-muted text-muted-foreground"}`}>
                      {t(`orders.status.${order.status}`)}
                    </span>
                    <span className="font-bebas text-2xl text-primary">{formatPrice(Number(order.total_amount))}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mb-1">
                  <OrderTimeline status={order.status} />
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

                {order.tracking_number && (
                  <div className="border-t border-border pt-3 mt-3">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> {t("orders.tracking")}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-foreground">
                        {(order.carrier && CARRIER[order.carrier]?.label) || t("orders.carrierPlaceholder")}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{order.tracking_number}</span>
                      {order.carrier && CARRIER[order.carrier] ? (
                        <a
                          href={CARRIER[order.carrier].url(order.tracking_number)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-bold uppercase tracking-widest"
                        >
                          {t("orders.trackButton")} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-3 mt-3">
                  {order.refund_status && order.refund_status !== "none" ? (
                    <span className={`inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-xl ${REFUND_BADGE_COLORS[order.refund_status] || "bg-muted text-muted-foreground"}`}>
                      {order.refund_status === "requested" && ["paid", "preparing"].includes(order.status)
                        ? t("orders.refund.cancelRequested")
                        : t("orders.refund." + order.refund_status)}
                    </span>
                  ) : REFUND_ELIGIBLE_STATUSES.includes(order.status) ? (
                    refundOpenId === order.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                          placeholder={["paid", "preparing"].includes(order.status) ? t("orders.refund.cancelPlaceholder") : t("orders.refund.refundPlaceholder")}
                          rows={3}
                          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={refundSubmitting}
                            onClick={() => handleRefundSubmit(order.id)}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            {refundSubmitting ? t("orders.refund.submitting") : ["paid", "preparing"].includes(order.status) ? t("orders.refund.cancelOrder") : t("orders.refund.requestRefund")}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRefundOpenId(null);
                              setRefundReason("");
                            }}
                            className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {t("orders.refund.discard")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRefundOpenId(order.id)}
                        className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-xl hover:border-primary/50 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> {["paid", "preparing"].includes(order.status) ? t("orders.refund.cancelOrder") : t("orders.refund.easyRefund")}
                      </button>
                    )
                  ) : null}
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
