import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "@/hooks/use-toast";
import { Truck, BadgeCheck, BadgeX } from "lucide-react";

const STATUSES = ["pending", "paid", "preparing", "shipped", "delivered", "failed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

const CARRIERS = [
  { value: "aras", label: "Aras" },
  { value: "yurtici", label: "Yurtiçi" },
  { value: "mng", label: "MNG" },
  { value: "ptt", label: "PTT" },
  { value: "surat", label: "Sürat" },
] as const;

const REFUND_STATUS_LABEL: Record<string, string> = {
  none: "",
  requested: "İade talebi",
  approved: "İade onaylandı",
  rejected: "Reddedildi",
  refunded: "İade edildi",
};

const REFUND_STATUS_STYLE: Record<string, string> = {
  requested: "bg-secondary/15 text-secondary",
  approved: "bg-accent/15 text-accent",
  rejected: "bg-destructive/15 text-destructive",
  refunded: "bg-accent/20 text-accent",
};

const STATUS_LABEL: Record<Status, string> = {
  pending: "Bekliyor",
  paid: "Ödendi",
  preparing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim edildi",
  failed: "Başarısız",
  cancelled: "İptal",
};

const STATUS_STYLE: Record<Status, string> = {
  pending: "bg-muted text-muted-foreground",
  paid: "bg-accent/15 text-accent",
  preparing: "bg-secondary/15 text-secondary",
  shipped: "bg-primary/15 text-primary",
  delivered: "bg-accent/20 text-accent",
  failed: "bg-destructive/15 text-destructive",
  cancelled: "bg-destructive/10 text-destructive",
};

interface OrderItem {
  product_title: string;
  size: string;
  quantity: number;
  line_total: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  coupon_code: string | null;
  created_at: string;
  shipping_info: { firstName?: string; lastName?: string; email?: string; phone?: string; city?: string } | null;
  order_items: OrderItem[] | null;
  tracking_number: string | null;
  carrier: string | null;
  refund_status: string | null;
  refund_reason: string | null;
}

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [shippingDrafts, setShippingDrafts] = useState<Record<string, { carrier: string; tracking_number: string }>>({});

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, status, total_amount, coupon_code, created_at, shipping_info, order_items(product_title, size, quantity, line_total), tracking_number, carrier, refund_status, refund_reason"
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Order[]) ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Sipariş durumu güncellendi" });
    },
    onError: () => toast({ title: "Güncellenemedi", variant: "destructive" }),
  });

  const updateShipping = useMutation({
    mutationFn: async ({ id, carrier, tracking_number }: { id: string; carrier: string; tracking_number: string }) => {
      const { error } = await supabase.from("orders").update({ carrier, tracking_number }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Kargo bilgisi kaydedildi" });
    },
    onError: () => toast({ title: "Kaydedilemedi", variant: "destructive" }),
  });

  const sendShippingNotification = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.functions.invoke("send-shipping-notification", { body: { orderId } });
      if (error) throw error;
    },
    onSuccess: () => toast({ title: "Kargo bildirimi gönderildi" }),
    onError: () => toast({ title: "Bildirim gönderilemedi", variant: "destructive" }),
  });

  const processRefund = useMutation({
    mutationFn: async ({ orderId, action }: { orderId: string; action: "approve" | "reject" }) => {
      const { error } = await supabase.functions.invoke("process-refund", { body: { orderId, action } });
      if (error) throw error;
    },
    onSuccess: (_data, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: action === "approve" ? "İade onaylandı" : "İade reddedildi" });
    },
    onError: () => toast({ title: "İşlem başarısız", variant: "destructive" }),
  });

  const getDraft = (o: Order) =>
    shippingDrafts[o.id] ?? { carrier: o.carrier ?? "aras", tracking_number: o.tracking_number ?? "" };

  const setDraft = (o: Order, patch: Partial<{ carrier: string; tracking_number: string }>) => {
    setShippingDrafts((prev) => ({ ...prev, [o.id]: { ...getDraft(o), ...patch } }));
  };

  if (isLoading) return <p className="text-muted-foreground">Siparişler yükleniyor…</p>;
  if (!orders || orders.length === 0) return <p className="text-muted-foreground">Henüz sipariş yok.</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-bebas text-3xl tracking-wide text-foreground">Siparişler ({orders.length})</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground break-all">{o.id}</p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {o.shipping_info?.firstName} {o.shipping_info?.lastName}
                  <span className="text-muted-foreground font-normal"> · {o.shipping_info?.city}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {o.shipping_info?.email} · {o.shipping_info?.phone}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(o.created_at).toLocaleString("tr-TR")}
                  {o.coupon_code ? ` · Kupon: ${o.coupon_code}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bebas text-2xl text-primary">{formatPrice(Number(o.total_amount))}</span>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg ${STATUS_STYLE[o.status as Status] ?? "bg-muted text-muted-foreground"}`}>
                  {STATUS_LABEL[o.status as Status] ?? o.status}
                </span>
              </div>
            </div>

            {o.order_items && o.order_items.length > 0 && (
              <ul className="mt-3 pt-3 border-t border-border space-y-1">
                {o.order_items.map((it, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex justify-between gap-2">
                    <span>{it.product_title} ({it.size}) ×{it.quantity}</span>
                    <span className="text-foreground">{formatPrice(Number(it.line_total))}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Durum:</label>
              <select
                value={o.status}
                onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                disabled={updateStatus.isPending}
                className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Kargo
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={getDraft(o).carrier}
                  onChange={(e) => setDraft(o, { carrier: e.target.value })}
                  className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {CARRIERS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={getDraft(o).tracking_number}
                  onChange={(e) => setDraft(o, { tracking_number: e.target.value })}
                  placeholder="Takip numarası"
                  className="bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateShipping.mutate({ id: o.id, carrier: getDraft(o).carrier, tracking_number: getDraft(o).tracking_number })
                  }
                  disabled={updateShipping.isPending}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => sendShippingNotification.mutate(o.id)}
                  disabled={sendShippingNotification.isPending}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary/15 text-secondary disabled:opacity-50"
                >
                  Kargo bildirimi gönder
                </button>
              </div>
              {(o.carrier || o.tracking_number) && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Kayıtlı: {CARRIERS.find((c) => c.value === o.carrier)?.label ?? o.carrier ?? "-"} · {o.tracking_number ?? "-"}
                </p>
              )}
            </div>

            {o.refund_status && o.refund_status !== "none" && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  İade
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg ${REFUND_STATUS_STYLE[o.refund_status] ?? "bg-muted text-muted-foreground"}`}>
                    {REFUND_STATUS_LABEL[o.refund_status] ?? o.refund_status}
                  </span>
                  {o.refund_reason && <span className="text-xs text-muted-foreground">{o.refund_reason}</span>}
                </div>
                {o.refund_status === "requested" && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => processRefund.mutate({ orderId: o.id, action: "approve" })}
                      disabled={processRefund.isPending}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent/15 text-accent disabled:opacity-50 flex items-center gap-1"
                    >
                      <BadgeCheck className="h-3.5 w-3.5" /> İadeyi onayla
                    </button>
                    <button
                      type="button"
                      onClick={() => processRefund.mutate({ orderId: o.id, action: "reject" })}
                      disabled={processRefund.isPending}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive disabled:opacity-50 flex items-center gap-1"
                    >
                      <BadgeX className="h-3.5 w-3.5" /> Reddet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
