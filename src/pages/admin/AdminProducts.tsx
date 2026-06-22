import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff } from "lucide-react";

interface Variant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

interface ProductRow {
  id: string;
  title: string;
  category: string | null;
  is_active: boolean;
  product_variants: Variant[] | null;
}

const AdminProducts = () => {
  const queryClient = useQueryClient();
  // Lokal düzenleme state: variantId -> { price, stock }
  const [edits, setEdits] = useState<Record<string, { price: string; stock: string }>>({});

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<ProductRow[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, category, is_active, product_variants(id, size, price, stock)")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as ProductRow[]) ?? [];
    },
  });

  const saveVariant = useMutation({
    mutationFn: async ({ id, price, stock }: { id: string; price: number; stock: number }) => {
      const { error } = await supabase.from("product_variants").update({ price, stock }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast({ title: "Varyant kaydedildi" });
    },
    onError: () => toast({ title: "Kaydedilemedi", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("products").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: () => toast({ title: "Güncellenemedi", variant: "destructive" }),
  });

  if (isLoading) return <p className="text-muted-foreground">Ürünler yükleniyor…</p>;
  if (!products || products.length === 0) {
    return (
      <p className="text-muted-foreground">
        Ürün tablosu boş ya da migration uygulanmadı. <code>20260622130000_catalog_and_roles.sql</code> migration'ını çalıştırın.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-bebas text-3xl tracking-wide text-foreground">Ürünler & Stok</h1>
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className={`bg-card border border-border rounded-2xl p-4 sm:p-5 ${p.is_active ? "" : "opacity-60"}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <button
                onClick={() => toggleActive.mutate({ id: p.id, is_active: !p.is_active })}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                {p.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {p.is_active ? "Yayında" : "Gizli"}
              </button>
            </div>

            <div className="grid gap-2">
              {(p.product_variants ?? []).sort((a, b) => a.size.localeCompare(b.size)).map((v) => {
                const edit = edits[v.id] ?? { price: String(v.price), stock: String(v.stock) };
                const dirty = Number(edit.price) !== Number(v.price) || Number(edit.stock) !== Number(v.stock);
                return (
                  <div key={v.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="w-16 text-xs font-mono text-muted-foreground">{v.size}</span>
                    <label className="text-xs text-muted-foreground">Fiyat</label>
                    <input
                      type="number"
                      value={edit.price}
                      onChange={(e) => setEdits((s) => ({ ...s, [v.id]: { ...edit, price: e.target.value } }))}
                      className="w-24 bg-muted border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <label className="text-xs text-muted-foreground">Stok</label>
                    <input
                      type="number"
                      value={edit.stock}
                      onChange={(e) => setEdits((s) => ({ ...s, [v.id]: { ...edit, stock: e.target.value } }))}
                      className="w-20 bg-muted border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground">({formatPrice(Number(v.price))})</span>
                    <button
                      disabled={!dirty || saveVariant.isPending}
                      onClick={() => saveVariant.mutate({ id: v.id, price: Number(edit.price), stock: Number(edit.stock) })}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
                    >
                      <Save className="w-3 h-3" /> Kaydet
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
