import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useEffect } from "react";

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlist } = useWishlist();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (authLoading) return null;

  return (
    <>
      <SEO title={`${t("wishlist.title")} — ComicWall`} description="Your saved posters" canonicalUrl="/wishlist" />
      <SiteHeader />
      <main className="pt-[var(--header-h)] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{t("wishlist.badge")}</p>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">{t("wishlist.title")}</h1>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t("wishlist.empty")}</p>
            <Link to="/shop" className="text-primary font-semibold hover:underline">{t("wishlist.goShopping")}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
};

export default Wishlist;
