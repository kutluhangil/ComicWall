import { useQuery } from "@tanstack/react-query";
import { Wallet, Clock, CalendarClock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";

interface DashboardStats {
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  lowStock: number;
}

const REVENUE_STATUSES = ["paid", "preparing", "shipped", "delivered"];
const PENDING_STATUSES = ["pending", "paid"];
const LOW_STOCK_THRESHOLD = 5;

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async (): Promise<DashboardStats> => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const [revenueRes, pendingRes, todayRes, lowStockRes] = await Promise.all([
        supabase.from("orders").select("total_amount").in("status", REVENUE_STATUSES),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .in("status", PENDING_STATUSES),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .gte("created_at", startOfToday.toISOString()),
        supabase
          .from("product_variants")
          .select("id", { count: "exact", head: true })
          .lte("stock", LOW_STOCK_THRESHOLD),
      ]);

      const totalRevenue = (revenueRes.data ?? []).reduce(
        (sum, row) => sum + Number(row.total_amount ?? 0),
        0
      );

      return {
        totalRevenue,
        pendingOrders: pendingRes.count ?? 0,
        todayOrders: todayRes.count ?? 0,
        lowStock: lowStockRes.count ?? 0,
      };
    },
  });

  const cards = [
    {
      key: "revenue",
      label: "Toplam Ciro",
      value: data ? formatPrice(data.totalRevenue) : "—",
      icon: Wallet,
    },
    {
      key: "pending",
      label: "Bekleyen Sipariş",
      value: data ? String(data.pendingOrders) : "—",
      icon: Clock,
    },
    {
      key: "today",
      label: "Bugünkü Sipariş",
      value: data ? String(data.todayOrders) : "—",
      icon: CalendarClock,
    },
    {
      key: "lowStock",
      label: "Düşük Stok",
      value: data ? String(data.lowStock) : "—",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-bebas text-3xl tracking-wide text-foreground">Panel</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map(({ key, label, value, icon: Icon }) => (
            <div key={key} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="font-bebas text-3xl text-primary">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
