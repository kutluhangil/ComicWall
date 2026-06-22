import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Power } from "lucide-react";

type DiscountType = "percent" | "fixed" | "free_shipping";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
}

const emptyForm = {
  code: "",
  description: "",
  discount_type: "percent" as DiscountType,
  discount_value: "10",
  min_order_amount: "0",
  max_uses: "",
  expires_at: "",
};

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async (): Promise<Coupon[]> => {
      const { data, error } = await supabase.from("coupons").select("*").order("code", { ascending: true });
      if (error) throw error;
      return (data as Coupon[]) ?? [];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });

  const create = useMutation({
    mutationFn: async () => {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || null,
        discount_type: form.discount_type,
        discount_value: form.discount_type === "free_shipping" ? 0 : Number(form.discount_value),
        min_order_amount: Number(form.min_order_amount) || 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
        is_active: true,
      };
      const { error } = await supabase.from("coupons").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
      toast({ title: "Kupon oluşturuldu" });
    },
    onError: (e: unknown) => toast({ title: e instanceof Error ? e.message : "Oluşturulamadı", variant: "destructive" }),
  });

  const toggle = useMutation({
    mutationFn: async (c: Coupon) => {
      const { error } = await supabase.from("coupons").update({ is_active: !c.is_active }).eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Kupon silindi" });
    },
  });

  const inputCls = "bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-6">
      <h1 className="font-bebas text-3xl tracking-wide text-foreground">Kuponlar</h1>

      {/* Yeni kupon */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (form.code.trim()) create.mutate(); }}
        className="bg-card border border-border rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        <input required placeholder="KOD" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className={`${inputCls} uppercase`} />
        <select value={form.discount_type} onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as DiscountType }))} className={inputCls}>
          <option value="percent">Yüzde (%)</option>
          <option value="fixed">Sabit (TL)</option>
          <option value="free_shipping">Ücretsiz kargo</option>
        </select>
        <input
          type="number"
          placeholder="Değer"
          value={form.discount_value}
          disabled={form.discount_type === "free_shipping"}
          onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
          className={`${inputCls} disabled:opacity-40`}
        />
        <input type="number" placeholder="Min. sepet (TL)" value={form.min_order_amount} onChange={(e) => setForm((f) => ({ ...f, min_order_amount: e.target.value }))} className={inputCls} />
        <input type="number" placeholder="Maks. kullanım (boş=∞)" value={form.max_uses} onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))} className={inputCls} />
        <input type="date" value={form.expires_at} onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))} className={inputCls} />
        <input placeholder="Açıklama" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inputCls} col-span-2`} />
        <button type="submit" disabled={create.isPending} className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs uppercase tracking-widest font-bold disabled:opacity-50">
          <Plus className="w-4 h-4" /> Ekle
        </button>
      </form>

      {/* Liste */}
      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor…</p>
      ) : !coupons || coupons.length === 0 ? (
        <p className="text-muted-foreground">Henüz kupon yok.</p>
      ) : (
        <div className="space-y-2">
          {coupons.map((c) => (
            <div key={c.id} className={`bg-card border border-border rounded-xl p-3 sm:p-4 flex flex-wrap items-center gap-3 ${c.is_active ? "" : "opacity-50"}`}>
              <span className="font-mono font-bold text-sm text-primary">{c.code}</span>
              <span className="text-xs text-muted-foreground">
                {c.discount_type === "percent" && `%${c.discount_value}`}
                {c.discount_type === "fixed" && `${c.discount_value} TL`}
                {c.discount_type === "free_shipping" && "Ücretsiz kargo"}
                {" · min "}{c.min_order_amount} TL
                {c.max_uses != null ? ` · ${c.used_count}/${c.max_uses}` : ` · ${c.used_count} kullanım`}
                {c.expires_at ? ` · son ${new Date(c.expires_at).toLocaleDateString("tr-TR")}` : ""}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => toggle.mutate(c)} aria-label="Aktif/Pasif" className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground">
                  <Power className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (confirm(`${c.code} silinsin mi?`)) remove.mutate(c.id); }} aria-label="Sil" className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
