import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { products, SIZES } from "@/data/products";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import CouponInput from "@/components/CouponInput";
import { formatPrice } from "@/lib/format";
import { calculateOrderTotals } from "@/lib/pricing";

const Cart = () => {
  const { items, updateQuantity, removeItem, coupon } = useCart();
  const { t } = useLanguage();

  const cartProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;
    const sizeLabel = SIZES.find((s) => s.value === item.size)?.label || item.size;
    return { ...item, product, sizeLabel, lineTotal: product.prices[item.size] * item.quantity };
  }).filter(Boolean) as Array<{
    productId: string; size: string; quantity: number; product: typeof products[0]; sizeLabel: string; lineTotal: number;
  }>;

  const subtotal = cartProducts.reduce((sum, cp) => sum + cp.lineTotal, 0);
  const totals = calculateOrderTotals(subtotal, coupon);

  return (
    <>
      <SEO
        title="Alışveriş Sepeti — ComicWall"
        description="Alışveriş sepetinizdeki posterleri gözden geçirin ve ödemeye geçin."
        canonicalUrl="/cart"
        noindex
      />
      <SiteHeader />
      <main className="pt-24 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-8 italic">{t("cart.title")}</h1>

        {cartProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t("cart.empty")}</p>
            <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-2xl inline-block">
              {t("cart.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <FreeShippingProgress subtotal={subtotal} />
              {cartProducts.map((cp) => (
                <div key={`${cp.productId}-${cp.size}`} className="flex gap-3 sm:gap-4 bg-card border border-border rounded-2xl p-3 sm:p-4 items-center">
                  <Link to={`/product/${cp.product.slug}`} className="w-16 h-22 sm:w-20 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={cp.product.image} alt={cp.product.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bebas text-lg sm:text-xl tracking-wide text-foreground">{cp.product.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("product.size")}: {cp.sizeLabel}</p>
                    <div className="flex items-center gap-3 mt-2 sm:mt-3">
                      <div className="flex items-center border border-border rounded-xl">
                        <button onClick={() => updateQuantity(cp.productId, cp.size as any, cp.quantity - 1)} className="px-2 py-1 text-foreground hover:bg-muted transition-colors rounded-l-xl">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-foreground">{cp.quantity}</span>
                        <button onClick={() => updateQuantity(cp.productId, cp.size as any, cp.quantity + 1)} className="px-2 py-1 text-foreground hover:bg-muted transition-colors rounded-r-xl">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(cp.productId, cp.size as any)} className="text-muted-foreground hover:text-destructive transition-colors ml-auto" aria-label={t("cart.remove")}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-foreground text-base sm:text-lg">{formatPrice(cp.lineTotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 sticky top-24 space-y-5">
                <h2 className="font-bebas text-2xl tracking-wide text-foreground">{t("cart.orderSummary")}</h2>

                <CouponInput subtotal={subtotal} />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                    <span className="text-foreground font-medium">{formatPrice(totals.subtotal)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.discount")}{coupon ? ` (${coupon.code})` : ""}</span>
                      <span className="text-accent font-medium">-{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cart.shipping")}</span>
                    <span className={totals.shipping === 0 ? "text-accent font-medium" : "text-foreground font-medium"}>
                      {totals.shipping === 0 ? t("cart.free") : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                    <span className="text-foreground font-semibold">{t("cart.total")}</span>
                    <span className="font-bebas text-3xl text-primary">{formatPrice(totals.total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
                >
                  {t("cart.checkout")} <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-3 h-3" />
                  {t("cart.secureCheckout")}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
};

export default Cart;
