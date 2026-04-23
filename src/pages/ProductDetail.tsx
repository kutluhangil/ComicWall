import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, ShoppingCart, Zap, Heart, Share2, Truck, RotateCcw, ShieldCheck, Printer } from "lucide-react";
import { getProduct, getCollectionProducts, products, SIZES, type PosterSize } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "@/lib/format";
import { recordRecentlyViewed, useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProduct(slug || "");
  const { addItem } = useCart();
  const { t } = useLanguage();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<PosterSize>("13x18");
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 });
  const [stickyVisible, setStickyVisible] = useState(false);
  const addBtnRef = useRef<HTMLDivElement>(null);

  const recentIds = useRecentlyViewed(product?.id);

  useEffect(() => {
    const el = addBtnRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [product?.id]);

  useEffect(() => {
    if (product) {
      recordRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    let active = true;
    supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", product.id)
      .then(({ data }) => {
        if (!active || !data || data.length === 0) return;
        const avg = data.reduce((s, r: any) => s + r.rating, 0) / data.length;
        setRating({ avg, count: data.length });
      });
    return () => {
      active = false;
    };
  }, [product?.id]);

  const recentProducts = useMemo(
    () => recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products,
    [recentIds]
  );

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="pt-32 text-center min-h-screen px-5">
          <h1 className="font-bebas text-4xl text-foreground">{t("product.notFound")}</h1>
          <Link to="/shop" className="text-primary mt-4 inline-block">{t("product.backToShop")}</Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const collectionProducts = product.collectionId ? getCollectionProducts(product.collectionId) : [];
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const fallbackRelated = products.filter((p) => p.id !== product.id).slice(0, 4);
  const relatedList = relatedProducts.length >= 3 ? relatedProducts : fallbackRelated;

  const price = product.prices[selectedSize];
  const wishlisted = isInWishlist(product.id);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `${SITE_CONFIG.url}/product/${product.slug}`;
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({ title: product.title, text: product.description, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: t("product.linkCopied") });
      }
    } catch {
      // kullanıcı iptal etti
    }
  };

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: `${SITE_CONFIG.url}${product.image}`,
    category: product.category,
    brand: { "@type": "Brand", name: "ComicWall" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: Math.min(...Object.values(product.prices)),
      highPrice: Math.max(...Object.values(product.prices)),
      offerCount: Object.keys(product.prices).length,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "ComicWall" },
    },
    ...(rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(rating.avg.toFixed(1)),
            reviewCount: rating.count,
          },
        }
      : {}),
  };

  return (
    <>
      <SEO
        title={`${product.title} — ComicWall`}
        description={product.description}
        canonicalUrl={`/product/${product.slug}`}
        ogType="product"
        ogImage={product.image}
        jsonLd={productJsonLd}
      />
      <SiteHeader />
      <main className="pt-[var(--header-h)] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-[3/4] bg-card rounded-2xl overflow-hidden border border-border"
          >
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">{product.category}</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={t("nav.wishlist")}
                  className={`p-2 rounded-xl border transition-all ${
                    wishlisted
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "text-muted-foreground border-border hover:text-primary hover:border-primary/30"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-primary" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label={t("product.share")}
                  className="p-2 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wide text-foreground">{product.title}</h1>
            {rating.count > 0 && (
              <a href="#reviews" className="text-xs text-muted-foreground mt-2 hover:text-primary transition-colors">
                ★ {rating.avg.toFixed(1)} — {rating.count} değerlendirme
              </a>
            )}
            <p className="text-muted-foreground mt-4 leading-relaxed text-sm sm:text-base">{product.description}</p>

            <div className="mt-6 sm:mt-8">
              <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-3">{t("product.size")}</p>
              <div className="flex gap-2 sm:gap-3">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedSize(s.value)}
                    className={`px-3 sm:px-4 py-2 text-sm rounded-xl border transition-all duration-200 ${
                      selectedSize === s.value
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="font-bebas text-3xl sm:text-4xl text-foreground mt-6">{formatPrice(price)}</p>

            <div className="flex items-center gap-4 mt-6">
              <p className="text-xs uppercase tracking-widest font-semibold text-foreground">{t("product.qty")}</p>
              <div className="flex items-center border border-border rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-foreground hover:bg-muted transition-colors rounded-l-xl">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-foreground hover:bg-muted transition-colors rounded-r-xl">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={addBtnRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <button
                onClick={() => addItem(product.id, selectedSize, quantity)}
                className="flex-1 bg-foreground text-background px-6 py-3.5 text-sm uppercase tracking-widest font-bold hover:bg-primary hover:text-primary-foreground transition-colors rounded-2xl inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> {t("product.addToCart")}
              </button>
              <Link
                to="/cart"
                onClick={() => addItem(product.id, selectedSize, quantity)}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors rounded-2xl inline-flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> {t("product.buyNow")}
              </Link>
            </div>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-primary" /> {t("product.features.shipping")}</li>
              <li className="flex items-center gap-2"><Printer className="w-3.5 h-3.5 text-primary" /> {t("product.features.quality")}</li>
              <li className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5 text-primary" /> {t("product.features.return")}</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> {t("product.features.secure")}</li>
            </ul>

            {collectionProducts.length > 1 && (
              <div className="mt-8 sm:mt-10 bg-card border border-border rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest font-semibold text-secondary mb-3">{t("product.alsoAsSet")}</p>
                <div className="flex gap-3">
                  {collectionProducts.map((cp) => (
                    <Link key={cp.id} to={`/product/${cp.slug}`} className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-border hover:border-secondary transition-colors">
                      <img src={cp.image} alt={cp.title} className="w-full h-full object-cover" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div id="reviews">
          <ProductReviews productId={product.id} />
        </div>

        <section className="mt-16 sm:mt-20">
          <h2 className="font-bebas text-3xl tracking-wide text-foreground mb-8">{t("product.youMightLike")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {recentProducts.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2 className="font-bebas text-3xl tracking-wide text-foreground mb-8">{t("product.recentlyViewed")}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recentProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ─── Sticky Add-to-Cart Bar ───────────────────────────────── */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-2xl border-t border-border shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <div className="w-10 h-14 rounded-xl overflow-hidden border border-border flex-shrink-0">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bebas text-lg tracking-wide text-foreground truncate">{product.title}</p>
                <p className="text-sm text-primary font-semibold">{formatPrice(product.prices[selectedSize])}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addItem(product.id, selectedSize, quantity)}
                  className="bg-foreground text-background px-4 sm:px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-primary-foreground transition-colors rounded-xl inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("product.addToCart")}</span>
                  <span className="sm:hidden">{t("product.addToCart")}</span>
                </button>
                <Link
                  to="/cart"
                  onClick={() => addItem(product.id, selectedSize, quantity)}
                  className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors rounded-xl inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("product.buyNow")}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </>
  );
};

export default ProductDetail;
