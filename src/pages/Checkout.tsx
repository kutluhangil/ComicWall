import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import AddressBook, { type Address } from "@/components/AddressBook";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Lock, BookUser, Pencil } from "lucide-react";
import { calculateOrderTotals } from "@/lib/pricing";

const inputClass =
  "bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

type Mode = "saved" | "new";

const Checkout = () => {
  const { items, coupon } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  const [mode, setMode] = useState<Mode>("saved");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [saveToBook, setSaveToBook] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Türkiye",
    identityNumber: "",
  });

  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((f) => ({ ...f, email: user.email || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product, lineTotal: product.prices[item.size] * item.quantity };
    })
    .filter(Boolean) as any[];

  const subtotal = cartProducts.reduce((sum: number, cp: any) => sum + cp.lineTotal, 0);
  const totals = calculateOrderTotals(subtotal, coupon);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: t("checkout.loginRequired"), variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!termsAgreed) {
      toast({ title: t("checkout.termsRequired"), variant: "destructive" });
      return;
    }

    let shipping: typeof form;
    if (mode === "saved") {
      if (!selectedAddress) {
        toast({ title: t("checkout.selectAddress"), variant: "destructive" });
        return;
      }
      shipping = {
        firstName: selectedAddress.first_name,
        lastName: selectedAddress.last_name,
        email: form.email || user.email || "",
        phone: selectedAddress.phone,
        address: selectedAddress.address_line,
        city: selectedAddress.city,
        postalCode: selectedAddress.postal_code,
        country: selectedAddress.country,
        identityNumber: selectedAddress.identity_number || form.identityNumber,
      };
    } else {
      shipping = form;
    }

    setLoading(true);
    try {
      if (mode === "new" && saveToBook) {
        try {
          await supabase.from("addresses").insert({
            user_id: user.id,
            label: "Teslimat Adresi",
            first_name: shipping.firstName,
            last_name: shipping.lastName,
            phone: shipping.phone,
            identity_number: shipping.identityNumber || null,
            address_line: shipping.address,
            city: shipping.city,
            postal_code: shipping.postalCode,
            country: shipping.country,
          });
        } catch {
          // adres kaydetme hatası siparişi bloklamasın
        }
      }

      const payload = {
        items: cartProducts.map((cp: any) => ({
          productId: cp.product.id,
          productTitle: cp.product.title,
          size: cp.size,
          quantity: cp.quantity,
          unitPrice: cp.product.prices[cp.size],
        })),
        shipping,
        coupon: coupon
          ? {
              code: coupon.code,
              discountAmount: totals.discount,
            }
          : null,
        totals: {
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          total: totals.total,
        },
        callbackOrigin: window.location.origin,
      };

      const { data, error } = await supabase.functions.invoke("iyzico-create-payment", {
        body: payload,
      });

      if (error || !data?.paymentPageUrl) {
        console.error("Payment init error:", error, data);
        toast({
          title: t("checkout.errorTitle"),
          description: data?.error || t("checkout.errorDesc"),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      window.location.href = data.paymentPageUrl;
    } catch (err: any) {
      console.error(err);
      toast({ title: t("checkout.errorTitle"), description: t("checkout.errorDesc"), variant: "destructive" });
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEO title="Ödeme — ComicWall" description="Siparişinizi tamamlayın." canonicalUrl="/checkout" noindex />
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
      <SEO
        title="Ödeme — ComicWall"
        description="Siparişinizi güvenle tamamlayın. iyzico ile 256-bit SSL korumalı ödeme."
        canonicalUrl="/checkout"
        noindex
      />
      <SiteHeader />
      <main className="pt-24 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-2">{t("checkout.title")}</h1>
        <p className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" /> 256-bit SSL ile güvenli ödeme — iyzico
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bebas text-2xl tracking-wide text-foreground">{t("checkout.shipping")}</h2>
                {user && (
                  <div className="flex bg-muted rounded-xl p-1 text-[11px] uppercase tracking-widest font-semibold">
                    <button
                      type="button"
                      onClick={() => setMode("saved")}
                      className={`px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors ${
                        mode === "saved" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <BookUser className="w-3.5 h-3.5" />
                      {t("checkout.savedAddresses")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("new")}
                      className={`px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors ${
                        mode === "new" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      {t("checkout.newAddress")}
                    </button>
                  </div>
                )}
              </div>

              {mode === "saved" ? (
                <AddressBook
                  selectable
                  selectedId={selectedAddress?.id || null}
                  onSelect={setSelectedAddress}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input required name="firstName" value={form.firstName} onChange={handleChange} placeholder={t("checkout.firstName")} className={inputClass} />
                  <input required name="lastName" value={form.lastName} onChange={handleChange} placeholder={t("checkout.lastName")} className={inputClass} />
                  <input required name="email" value={form.email} onChange={handleChange} placeholder={t("checkout.email")} type="email" className={`sm:col-span-2 ${inputClass}`} />
                  <input required name="phone" value={form.phone} onChange={handleChange} placeholder={`${t("checkout.phone")} (örn: +905551234567)`} type="tel" className={inputClass} />
                  <input required name="identityNumber" value={form.identityNumber} onChange={handleChange} placeholder={t("checkout.identityNumber")} maxLength={11} pattern="[0-9]{11}" className={inputClass} />
                  <input required name="address" value={form.address} onChange={handleChange} placeholder={t("checkout.address")} className={`sm:col-span-2 ${inputClass}`} />
                  <input required name="city" value={form.city} onChange={handleChange} placeholder={t("checkout.city")} className={inputClass} />
                  <input required name="postalCode" value={form.postalCode} onChange={handleChange} placeholder={t("checkout.postalCode")} className={inputClass} />
                  <input required name="country" value={form.country} onChange={handleChange} placeholder={t("checkout.country")} className={`sm:col-span-2 ${inputClass}`} />
                  <label className="sm:col-span-2 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveToBook}
                      onChange={(e) => setSaveToBook(e.target.checked)}
                      className="accent-primary rounded"
                    />
                    {t("checkout.saveAddress")}
                  </label>
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <h2 className="font-bebas text-2xl tracking-wide text-foreground mb-4">{t("checkout.payment")}</h2>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">{t("checkout.creditCard")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("checkout.iyzicoNote")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 sticky top-24 space-y-5">
              <h2 className="font-bebas text-2xl tracking-wide text-foreground">{t("checkout.orderSummary")}</h2>
              <div className="space-y-3 max-h-64 overflow-auto pr-2">
                {cartProducts.map((cp: any) => (
                  <div key={`${cp.productId}-${cp.size}`} className="flex justify-between text-sm gap-2">
                    <span className="text-muted-foreground line-clamp-2">
                      {cp.product.title} ({cp.size}) ×{cp.quantity}
                    </span>
                    <span className="text-foreground font-medium whitespace-nowrap">{formatPrice(cp.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
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
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">{t("checkout.total")}</span>
                  <span className="font-bebas text-3xl text-primary">{formatPrice(totals.total)}</span>
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer leading-relaxed">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="accent-primary rounded mt-0.5"
                />
                <span>
                  <Link to="/terms" target="_blank" className="text-primary hover:underline">Mesafeli Satış Sözleşmesi</Link>
                  {" "}ve{" "}
                  <Link to="/pre-info" target="_blank" className="text-primary hover:underline">Ön Bilgilendirme Formu</Link>
                  'nu okudum, kabul ediyorum.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {loading ? t("checkout.processing") : t("checkout.placeOrder")}
              </button>
              <p className="text-[10px] text-center text-muted-foreground">
                Ödemeyi onayladığınızda iyzico'nun güvenli ödeme sayfasına yönlendirileceksiniz.
              </p>
            </div>
          </div>
        </form>
      </main>
      <SiteFooter />
    </>
  );
};

export default Checkout;
