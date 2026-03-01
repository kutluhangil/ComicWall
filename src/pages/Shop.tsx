import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";

const Shop = () => {
  return (
    <>
      <SEO title="Shop All Posters — ComicWall" description="Browse all premium comic-style posters." canonicalUrl="/shop" />
      <SiteHeader />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">All Posters</p>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">The Shop</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default Shop;
