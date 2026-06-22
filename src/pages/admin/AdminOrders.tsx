import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "@/hooks/use-toast";

const STATUSES = ["pending", "paid", "preparing", "shipped", "delivered", "failed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

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
}

const AdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total_amount, coupon_code, created_at, shipping_info, order_items(product_title, size, quantity, line_total)")
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
