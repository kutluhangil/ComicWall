import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products, SIZES } from "@/data/products";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";

const Cart = () => {
  const { items, updateQuantity, removeItem } = useCart();

  const cartProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;
    const sizeLabel = SIZES.find((s) => s.value === item.size)?.label || item.size;
    return { ...item, product, sizeLabel, lineTotal: product.prices[item.size] * item.quantity };
  }).filter(Boolean) as Array<{
    productId: string; size: string; quantity: number; product: typeof products[0]; sizeLabel: string; lineTotal: number;
  }>;

  const total = cartProducts.reduce((sum, cp) => sum + cp.lineTotal, 0);

  return (
    <>
      <SEO title="Cart — ComicWall" description="Your shopping cart." canonicalUrl="/cart" />
      <SiteHeader />
      <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <h1 className="font-bebas text-5xl tracking-wide text-foreground mb-8">Your Cart</h1>

        {cartProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartProducts.map((cp) => (
                <div key={`${cp.productId}-${cp.size}`} className="flex gap-4 bg-card border border-border rounded-lg p-4">
                  <Link to={`/product/${cp.product.slug}`} className="w-20 h-28 rounded overflow-hidden flex-shrink-0">
                    <img src={cp.product.image} alt={cp.product.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bebas text-xl tracking-wide text-foreground">{cp.product.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cp.sizeLabel}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border rounded-md">
                        <button onClick={() => updateQuantity(cp.productId, cp.size as any, cp.quantity - 1)} className="px-2 py-1 text-foreground hover:bg-muted transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-foreground">{cp.quantity}</span>
                        <button onClick={() => updateQuantity(cp.productId, cp.size as any, cp.quantity + 1)} className="px-2 py-1 text-foreground hover:bg-muted transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(cp.productId, cp.size as any)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-foreground">€{cp.lineTotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">Total</span>
                <span className="font-bebas text-3xl text-foreground">€{total.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-primary text-primary-foreground text-center px-6 py-3 text-sm uppercase tracking-widest font-bold rounded-md hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
};

export default Cart;
