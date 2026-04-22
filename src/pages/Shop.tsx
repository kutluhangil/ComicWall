import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { products, SIZES, type PosterSize } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { Shuffle, SlidersHorizontal, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "@/lib/format";

const CATEGORIES = [...new Set(products.map((p) => p.category))];

type SortKey = "featured" | "priceAsc" | "priceDesc" | "newest";

const Shop = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<PosterSize | null>(null);
  const [bundlesOnly, setBundlesOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(700);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (search) next.set("q", search);
    else next.delete("q");
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase("tr-TR");
    const list = products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (bundlesOnly && !p.collectionId) return false;
      const priceKey = selectedSize || "10x15";
      if (p.prices[priceKey] > maxPrice) return false;
      if (normalized) {
        const haystack = `${p.title} ${p.category} ${p.description}`.toLocaleLowerCase("tr-TR");
        if (!haystack.includes(normalized)) return false;
      }
      return true;
    });

    const sizeKey = selectedSize || "10x15";
    const sorted = [...list];
    switch (sortBy) {
      case "priceAsc":
        sorted.sort((a, b) => a.prices[sizeKey] - b.prices[sizeKey]);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.prices[sizeKey] - a.prices[sizeKey]);
        break;
      case "newest":
        sorted.sort((a, b) => (a.badge === "Yeni" ? -1 : 0) - (b.badge === "Yeni" ? -1 : 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [selectedCategory, selectedSize, bundlesOnly, maxPrice, search, sortBy]);

  const handleSurpriseMe = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    navigate(`/product/${randomProduct.slug}`);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setBundlesOnly(false);
    setMaxPrice(700);
    setSearch("");
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory || selectedSize || bundlesOnly || maxPrice < 700 || search || sortBy !== "featured";

  return (
    <>
      <SEO
        title="Mağaza — Tüm Posterler | ComicWall"
        description="ComicWall'un tüm premium çizgi roman tarzı posterlerini keşfedin. Kategori, boyut ve fiyat aralığına göre filtreleyin."
        canonicalUrl="/shop"
      />
      <SiteHeader />
      <main className="pt-24 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{t("shop.badge")}</p>
            <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">{t("shop.title")}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-accent/90 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              {t("shop.surpriseMe")}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-muted/80 transition-colors sm:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t("shop.filter")}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("shop.searchPlaceholder")}
              aria-label={t("nav.search")}
              className="w-full bg-muted border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Aramayı temizle"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="sm:w-56">
            <label className="sr-only" htmlFor="sort-by">{t("shop.sortBy")}</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="w-full bg-muted border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            >
              <option value="featured">{t("shop.sort.featured")}</option>
              <option value="priceAsc">{t("shop.sort.priceAsc")}</option>
              <option value="priceDesc">{t("shop.sort.priceDesc")}</option>
              <option value="newest">{t("shop.sort.newest")}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <AnimatePresence>
            {(showFilters || typeof window !== "undefined") && (
              <motion.aside
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`sm:w-56 shrink-0 space-y-6 ${showFilters ? "block" : "hidden sm:block"}`}
              >
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-3">{t("shop.filter")}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                        !selectedCategory ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      {t("shop.allCategories")}
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                          selectedCategory === cat ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-3">{t("shop.sizeFilter")}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSize(null)}
                      className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                        !selectedSize ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      {t("shop.allSizes")}
                    </button>
                    {SIZES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setSelectedSize(s.value)}
                        className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                          selectedSize === s.value ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-3">{t("shop.priceRange")}</p>
                  <input
                    type="range"
                    min="200"
                    max="700"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formatPrice(0)} — {formatPrice(maxPrice)}</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bundlesOnly}
                    onChange={(e) => setBundlesOnly(e.target.checked)}
                    className="accent-primary rounded"
                  />
                  <span className="text-xs text-foreground font-medium">{t("shop.bundles")}</span>
                </label>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 font-semibold transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t("shop.clearFilters")}
                  </button>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-4">
              {filteredProducts.length} ürün
              {search ? ` — "${search}" için sonuçlar` : ""}
            </p>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">{t("shop.noResults")}</p>
                <button onClick={clearFilters} className="text-primary font-semibold hover:underline">{t("shop.clearFilters")}</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default Shop;
