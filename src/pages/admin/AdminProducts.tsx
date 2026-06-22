import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp, ImagePlus } from "lucide-react";

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
  image_url: string | null;
  product_variants: Variant[] | null;
}

const SIZES = ["10x15", "13x18", "20x30"] as const;

const emptyNewForm = {
  title: "",
  category: "",
  description: "",
  badge: "",
  prices: { "10x15": "249", "13x18": "379", "20x30": "599" } as Record<string, string>,
  stocks: { "10x15": "100", "13x18": "100", "20x30": "100" } as Record<string, string>,
};

// Türkçe karakterleri sadeleştirip URL-uyumlu slug üretir
function slugify(text: string): string {
  const trMap: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
  return text
    .split("")
    .map((ch) => trMap[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const AdminProducts = () => {
  const queryClient = useQueryClient();
  // Lokal düzenleme state: variantId -> { price, stock }
  const [edits, setEdits] = useState<Record<string, { price: string; stock: string }>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [newForm, setNewForm] = useState(emptyNewForm);
  const [newImage, setNewImage] = useState<File | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<ProductRow[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, category, is_active, image_url, product_variants(id, size, price, stock)")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as ProductRow[]) ?? [];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  };

  const saveVariant = useMutation({
    mutationFn: async ({ id, price, stock }: { id: string; price: number; stock: number }) => {
      const { error } = await supabase.from("product_variants").update({ price, stock }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Varyant kaydedildi" });
    },
    onError: () => toast({ title: "Kaydedilemedi", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("products").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast({ title: "Güncellenemedi", variant: "destructive" }),
  });

  const createProduct = useMutation({
    mutationFn: async () => {
      const title = newForm.title.trim();
      if (!title) throw new Error("Başlık gerekli");

      const baseSlug = slugify(title) || `urun-${Date.now()}`;
      const id = `${baseSlug}-${Date.now().toString(36)}`;

      const maxSortOrder = (products ?? []).length;

      let imageUrl: string | null = null;
      if (newImage) {
        const ext = newImage.name.split(".").pop() ?? "jpg";
        const path = `${id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(path, newImage, {
          cacheControl: "3600",
          upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = publicUrlData.publicUrl;
      }

      const { error: productError } = await supabase.from("products").insert({
        id,
        slug: baseSlug,
        title,
        description: newForm.description.trim() || null,
        category: newForm.category.trim() || null,
        badge: newForm.badge.trim() || null,
        image_url: imageUrl,
        is_active: true,
        sort_order: maxSortOrder + 1,
      });
      if (productError) throw productError;

      const variantRows = SIZES.map((size) => ({
        product_id: id,
        size,
        price: Number(newForm.prices[size]) || 0,
        stock: Number(newForm.stocks[size]) || 0,
      }));
      const { error: variantError } = await supabase.from("product_variants").insert(variantRows);
      if (variantError) throw variantError;
    },
    onSuccess: () => {
      invalidate();
      setNewForm(emptyNewForm);
      setNewImage(null);
      setFormOpen(false);
      toast({ title: "Ürün oluşturuldu" });
    },
    onError: (e: unknown) => toast({ title: e instanceof Error ? e.message : "Ürün oluşturulamadı", variant: "destructive" }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Ürün silindi" });
    },
    onError: () => toast({ title: "Ürün silinemedi", variant: "destructive" }),
  });

  const inputCls = "bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-bebas text-3xl tracking-wide text-foreground">Ürünler & Stok</h1>
        <button
          onClick={() => setFormOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-widest"
        >
          <Plus className="w-3.5 h-3.5" />
          Yeni Ürün
          {formOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newForm.title.trim()) createProduct.mutate();
          }}
          className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Başlık"
              value={newForm.title}
              onChange={(e) => setNewForm((f) => ({ ...f, title: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder="Kategori"
              value={newForm.category}
              onChange={(e) => setNewForm((f) => ({ ...f, category: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder="Rozet (örn. Yeni, Çok Satan)"
              value={newForm.badge}
              onChange={(e) => setNewForm((f) => ({ ...f, badge: e.target.value }))}
              className={inputCls}
            />
            <label className="flex items-center gap-2 text-xs text-muted-foreground bg-muted border border-border rounded-lg px-3 py-2 cursor-pointer">
              <ImagePlus className="w-4 h-4" />
              {newImage ? newImage.name : "Görsel seç (opsiyonel)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setNewImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <textarea
            placeholder="Açıklama"
            value={newForm.description}
            onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
            className={`${inputCls} w-full min-h-[72px]`}
          />

          <div className="grid gap-2">
            <p className="text-xs text-muted-foreground">Boyut bazlı fiyat & stok</p>
            {SIZES.map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="w-16 text-xs font-mono text-muted-foreground">{size}</span>
                <label className="text-xs text-muted-foreground">Fiyat</label>
                <input
                  type="number"
                  value={newForm.prices[size]}
                  onChange={(e) => setNewForm((f) => ({ ...f, prices: { ...f.prices, [size]: e.target.value } }))}
                  className="w-24 bg-muted border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <label className="text-xs text-muted-foreground">Stok</label>
                <input
                  type="number"
                  value={newForm.stocks[size]}
                  onChange={(e) => setNewForm((f) => ({ ...f, stocks: { ...f.stocks, [size]: e.target.value } }))}
                  className="w-20 bg-muted border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={createProduct.isPending}
            className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs uppercase tracking-widest font-bold disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> {createProduct.isPending ? "Oluşturuluyor…" : "Ürünü Oluştur"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Ürünler yükleniyor…</p>
      ) : !products || products.length === 0 ? (
        <p className="text-muted-foreground">
          Ürün tablosu boş ya da migration uygulanmadı. <code>20260622130000_catalog_and_roles.sql</code> migration'ını çalıştırın.
        </p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className={`bg-card border border-border rounded-2xl p-4 sm:p-5 ${p.is_active ? "" : "opacity-60"}`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-border" />
                  ) : null}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive.mutate({ id: p.id, is_active: !p.is_active })}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                  >
                    {p.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {p.is_active ? "Yayında" : "Gizli"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${p.title}" silinsin mi? Bu işlem geri alınamaz.`)) deleteProduct.mutate(p.id);
                    }}
                    aria-label="Sil"
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
      )}
    </div>
  );
};

export default AdminProducts;
