import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { products, SIZES, type PosterSize } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { Shuffle, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "@/lib/format";

const CATEGORIES = [...new Set(products.map((p) => p.category))];

const Shop = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<PosterSize | null>(null);
  const [bundlesOnly, setBundlesOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(700);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (bundlesOnly && !p.collectionId) return false;
      const priceKey = selectedSize || "10x15";
      if (p.prices[priceKey] > maxPrice) return false;
      return true;
    });
  }, [selectedCategory, selectedSize, bundlesOnly, maxPrice]);

  const handleSurpriseMe = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    navigate(`/product/${randomProduct.slug}`);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setBundlesOnly(false);
    setMaxPrice(700);
  };

  const hasActiveFilters = selectedCategory || selectedSize || bundlesOnly || maxPrice < 700;

  return (
    <>
      <SEO title="Shop All Posters — ComicWall" description="Browse all premium comic-style posters." canonicalUrl="/shop" />
      <SiteHeader />
      <main className="pt-24 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
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

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Filters sidebar */}
          <AnimatePresence>
            {(showFilters || typeof window !== "undefined") && (
              <motion.aside
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`sm:w-56 shrink-0 space-y-6 ${showFilters ? "block" : "hidden sm:block"}`}
              >
                {/* Categories */}
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

                {/* Size filter */}
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

                {/* Price range */}
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

                {/* Bundles only */}
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

          {/* Products grid */}
          <div className="flex-1">
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
