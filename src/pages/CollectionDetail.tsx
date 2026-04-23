import { useParams, Link } from "react-router-dom";
import { getCollection, getCollectionProducts, SIZES, type PosterSize } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format";

const CollectionDetail = () => {
  const { slug } = useParams();
  const collection = getCollection(slug || "");
  const [selectedSize, setSelectedSize] = useState<PosterSize>("13x18");
  const { addItem } = useCart();
  const { t } = useLanguage();

  if (!collection) {
    return (
      <>
        <SiteHeader />
        <main className="pt-32 text-center min-h-screen px-5">
          <h1 className="font-bebas text-4xl text-foreground">{t("collectionDetail.notFound")}</h1>
        </main>
        <SiteFooter />
      </>
    );
  }

  const collectionProducts = getCollectionProducts(collection.id);
  const bundlePrice = collection.bundlePrice[selectedSize];

  const addBundle = () => {
    collectionProducts.forEach((p) => addItem(p.id, selectedSize, 1));
  };

  return (
    <>
      <SEO title={`${collection.title} — ComicWall`} description={collection.description} canonicalUrl={`/collection/${collection.slug}`} />
      <SiteHeader />
      <main className="pt-[var(--header-h)] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-2">{t("collectionDetail.badge")}</p>
          <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wide text-foreground">{collection.title}</h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">{collection.description}</p>

          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 mt-8 inline-block">
            <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-3">{t("collectionDetail.buySet")}</p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedSize(s.value)}
                  className={`px-3 sm:px-4 py-2 text-sm rounded-xl border transition-all ${
                    selectedSize === s.value
                      ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <span className="font-bebas text-3xl text-foreground">{formatPrice(bundlePrice)}</span>
              <button
                onClick={addBundle}
                className="bg-secondary text-secondary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> {t("collectionDetail.addSetToCart")}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12">
          {collectionProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default CollectionDetail;
