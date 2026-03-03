import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { products, SIZES } from "@/data/products";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const cartProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;
    return { ...item, product, lineTotal: product.prices[item.size] * item.quantity };
  }).filter(Boolean) as any[];

  const total = cartProducts.reduce((sum: number, cp: any) => sum + cp.lineTotal, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      toast({ title: t("checkout.orderPlaced"), description: t("checkout.orderThanks") });
      navigate("/");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="pt-32 text-center min-h-screen px-5">
          <p className="text-muted-foreground mb-4">{t("checkout.emptyCart")}</p>
          <Link to="/shop" className="text-primary">{t("checkout.goShopping")}</Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout — ComicWall" description="Complete your order." canonicalUrl="/checkout" />
      <SiteHeader />
      <main className="pt-24 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-8">{t("checkout.title")}</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <h2 className="font-bebas text-2xl tracking-wide text-foreground mb-4">{t("checkout.shipping")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input required placeholder={t("checkout.firstName")} className="bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                <input required placeholder={t("checkout.lastName")} className="bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                <input required placeholder={t("checkout.email")} type="email" className="sm:col-span-2 bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                <input required placeholder={t("checkout.address")} className="sm:col-span-2 bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                <input required placeholder={t("checkout.city")} className="bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                <input required placeholder={t("checkout.postalCode")} className="bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                <input required placeholder={t("checkout.country")} className="sm:col-span-2 bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <h2 className="font-bebas text-2xl tracking-wide text-foreground mb-4">{t("checkout.payment")}</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="accent-primary" />
                  <span className="text-sm text-foreground">{t("checkout.creditCard")}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" className="accent-primary" />
                  <span className="text-sm text-foreground">PayPal</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 sticky top-24">
              <h2 className="font-bebas text-2xl tracking-wide text-foreground mb-4">{t("checkout.orderSummary")}</h2>
              <div className="space-y-3">
                {cartProducts.map((cp: any) => (
                  <div key={`${cp.productId}-${cp.size}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cp.product.title} ({cp.size}) ×{cp.quantity}
                    </span>
                    <span className="text-foreground font-medium">€{cp.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">{t("checkout.total")}</span>
                <span className="font-bebas text-2xl text-foreground">€{total.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? t("checkout.processing") : t("checkout.placeOrder")}
              </button>
            </div>
          </div>
        </form>
      </main>
      <SiteFooter />
    </>
  );
};

export default Checkout;
