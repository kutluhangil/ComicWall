import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { getProduct, getCollectionProducts, products, SIZES, type PosterSize } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { motion } from "motion/react";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProduct(slug || "");
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<PosterSize>("13x18");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="pt-32 text-center min-h-screen">
          <h1 className="font-bebas text-4xl text-foreground">Poster Not Found</h1>
          <Link to="/shop" className="text-primary mt-4 inline-block">Back to Shop</Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const collectionProducts = product.collectionId ? getCollectionProducts(product.collectionId) : [];
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);
  const price = product.prices[selectedSize];

  return (
    <>
      <SEO title={`${product.title} — ComicWall`} description={product.description} canonicalUrl={`/product/${product.slug}`} />
      <SiteHeader />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-[3/4] bg-card rounded-lg overflow-hidden border border-border"
          >
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{product.category}</p>
            <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">{product.title}</h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-3">Size</p>
              <div className="flex gap-3">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedSize(s.value)}
                    className={`px-4 py-2 text-sm rounded-md border transition-all duration-200 ${
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

            {/* Price */}
            <p className="font-bebas text-4xl text-foreground mt-6">€{price.toFixed(2)}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-6">
              <p className="text-xs uppercase tracking-widest font-semibold text-foreground">Qty</p>
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-foreground hover:bg-muted transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-foreground hover:bg-muted transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => addItem(product.id, selectedSize, quantity)}
                className="flex-1 bg-foreground text-background px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-primary hover:text-primary-foreground transition-colors rounded-md inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <Link
                to="/cart"
                onClick={() => addItem(product.id, selectedSize, quantity)}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors rounded-md inline-flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </Link>
            </div>

            {/* Collection */}
            {collectionProducts.length > 1 && (
              <div className="mt-10 bg-card border border-border rounded-lg p-5">
                <p className="text-xs uppercase tracking-widest font-semibold text-secondary mb-3">Also available as a set</p>
                <div className="flex gap-3">
                  {collectionProducts.map((cp) => (
                    <Link key={cp.id} to={`/product/${cp.slug}`} className="w-16 h-20 rounded overflow-hidden border border-border hover:border-secondary transition-colors">
                      <img src={cp.image} alt={cp.title} className="w-full h-full object-cover" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related */}
        <section className="mt-20">
          <h2 className="font-bebas text-3xl tracking-wide text-foreground mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
};

export default ProductDetail;
