import { useParams, Link } from "react-router-dom";
import { getCollection, getCollectionProducts, SIZES, type PosterSize } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";

const CollectionDetail = () => {
  const { slug } = useParams();
  const collection = getCollection(slug || "");
  const [selectedSize, setSelectedSize] = useState<PosterSize>("13x18");
  const { addItem } = useCart();

  if (!collection) {
    return (
      <>
        <SiteHeader />
        <main className="pt-32 text-center min-h-screen">
          <h1 className="font-bebas text-4xl text-foreground">Collection Not Found</h1>
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
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-2">Collection</p>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">{collection.title}</h1>
          <p className="text-muted-foreground mt-3 max-w-xl">{collection.description}</p>

          {/* Bundle buy */}
          <div className="bg-card border border-border rounded-lg p-6 mt-8 inline-block">
            <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-3">Buy the entire set</p>
            <div className="flex gap-3 mb-4">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedSize(s.value)}
                  className={`px-4 py-2 text-sm rounded-md border transition-all ${
                    selectedSize === s.value
                      ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bebas text-3xl text-foreground">€{bundlePrice.toFixed(2)}</span>
              <button
                onClick={addBundle}
                className="bg-secondary text-secondary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-md hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add Set to Cart
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
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
