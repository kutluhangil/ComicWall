// Katalog veri katmanı.
// Ürünleri Supabase `products` + `product_variants` tablolarından çeker.
// initialData = statik katalog → bileşenler ANINDA veri görür (loading state yok).
// DB boş/erişilemezse statik katalog kullanılır (migration uygulanmadan da site çalışır).
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, type Product, type PosterSize } from "@/data/products";

interface VariantRow {
  size: string;
  price: number;
  stock: number;
}

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  badge: string | null;
  collection_id: string | null;
  image_url: string | null;
  product_variants: VariantRow[] | null;
}

async function fetchCatalog(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, title, description, category, badge, collection_id, image_url, product_variants(size, price, stock)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return staticProducts;
  }

  const staticById = new Map(staticProducts.map((p) => [p.id, p]));

  return (data as ProductRow[]).map((row) => {
    const base = staticById.get(row.id);
    const prices = { ...(base?.prices ?? ({} as Record<PosterSize, number>)) };
    const variantStock: Partial<Record<PosterSize, number>> = {};
    let totalStock = 0;

    for (const v of row.product_variants ?? []) {
      const size = v.size as PosterSize;
      prices[size] = Number(v.price);
      variantStock[size] = Number(v.stock);
      totalStock += Number(v.stock);
    }

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description ?? base?.description ?? "",
      image: row.image_url ?? base?.image ?? "",
      prices,
      category: row.category ?? base?.category ?? "",
      badge: row.badge ?? base?.badge,
      collectionId: row.collection_id ?? base?.collectionId,
      stock: totalStock,
      variantStock,
    } satisfies Product;
  });
}

export function useProducts(): Product[] {
  const { data } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
    initialData: staticProducts,
    staleTime: 60_000,
  });
  return data;
}

export function useProduct(slug: string | undefined): Product | undefined {
  const products = useProducts();
  return slug ? products.find((p) => p.slug === slug) : undefined;
}

export function useCollectionProducts(collectionId: string | undefined): Product[] {
  const products = useProducts();
  if (!collectionId) return [];
  return products.filter((p) => p.collectionId === collectionId);
}
