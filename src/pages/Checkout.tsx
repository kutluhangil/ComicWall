import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { type PosterSize, type Product } from "@/data/products";
import { useProducts } from "@/hooks/useCatalog";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import AddressBook, { type Address } from "@/components/AddressBook";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Lock, BookUser, Pencil, X } from "lucide-react";
import { calculateOrderTotals } from "@/lib/pricing";
import { TR_CITIES } from "@/data/trCities";
import { SITE_CONFIG } from "@/lib/siteConfig";

const inputClass =
  "bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

type Mode = "saved" | "new";

type CheckoutLine = {
  productId: string;
  size: PosterSize;
  quantity: number;
  product: Product;
  lineTotal: number;
};

const Checkout = () => {
  const { items, coupon } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const products = useProducts();
  const isGuest = !user || !!user.is_anonymous;

  const [mode, setMode] = useState<Mode>("saved");

  // Misafirin kayıtlı adresi olmaz → her zaman "yeni adres" formu
  useEffect(() => {
    if (isGuest) setMode("new");
  }, [isGuest]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [saveToBook, setSaveToBook] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    invoiceType: "individual",
    identityNumber: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Türkiye",
  });
  const [carrier, setCarrier] = useState<string>("yurtici");
  const [showTermsModal, setShowTermsModal] = useState<'none' | 'pre-info' | 'terms'>('none');

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
    .filter(Boolean) as CheckoutLine[];

  const subtotal = cartProducts.reduce((sum: number, cp: CheckoutLine) => sum + cp.lineTotal, 0);
  const totals = calculateOrderTotals(subtotal, coupon);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      toast({ title: t("checkout.termsRequired"), variant: "destructive" });
      return;
    }

    // Misafir checkout: oturum yoksa anonim oturum aç.
    // (Supabase → Authentication → Providers → "Anonymous sign-ins" açık olmalı)
    let activeUser = user;
    if (!activeUser) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error || !data.user) {
        toast({ title: t("checkout.loginRequired"), variant: "destructive" });
        navigate("/login");
        return;
      }
      activeUser = data.user;
    }

    let shipping: typeof form & { carrier: string };
    if (mode === "saved") {
      if (!selectedAddress) {
        toast({ title: t("checkout.selectAddress"), variant: "destructive" });
        return;
      }
      shipping = {
        firstName: selectedAddress.first_name,
        lastName: selectedAddress.last_name,
        email: form.email || activeUser.email || "",
        phone: selectedAddress.phone,
        invoiceType: selectedAddress.invoice_type || "individual",
        identityNumber: selectedAddress.identity_number || "",
        companyName: selectedAddress.company_name || "",
        taxOffice: selectedAddress.tax_office || "",
        taxNumber: selectedAddress.tax_number || "",
        address: selectedAddress.address_line,
        city: selectedAddress.city,
        district: selectedAddress.district || "",
        postalCode: selectedAddress.postal_code,
        country: selectedAddress.country,
        carrier,
      };
    } else {
      shipping = { ...form, carrier };
    }

    setLoading(true);
    try {
      if (mode === "new" && saveToBook) {
        try {
          await supabase.from("addresses").insert({
            user_id: activeUser.id,
            label: "Teslimat Adresi",
            first_name: shipping.firstName,
            last_name: shipping.lastName,
            invoice_type: shipping.invoiceType,
            identity_number: shipping.invoiceType === "individual" ? (shipping.identityNumber || null) : null,
            company_name: shipping.invoiceType === "corporate" ? (shipping.companyName || null) : null,
            tax_office: shipping.invoiceType === "corporate" ? (shipping.taxOffice || null) : null,
            tax_number: shipping.invoiceType === "corporate" ? (shipping.taxNumber || null) : null,
            address_line: shipping.address,
            city: shipping.city,
            district: shipping.district || null,
            postal_code: shipping.postalCode,
            country: shipping.country,
          });
        } catch {
          // adres kaydetme hatası siparişi bloklamasın
        }
      }

      const payload = {
        items: cartProducts.map((cp: CheckoutLine) => ({
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
    } catch (err) {
      console.error(err);
      toast({ title: t("checkout.errorTitle"), description: t("checkout.errorDesc"), variant: "destructive" });
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEO title={`${t("checkout.title")} — ComicWall`} description={t("checkout.seo.description")} canonicalUrl="/checkout" noindex />
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
        title={`${t("checkout.title")} — ComicWall`}
        description={t("checkout.seo.description")}
        canonicalUrl="/checkout"
        noindex
      />
      <SiteHeader />
      <main className="pt-[var(--header-h)] max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 min-h-screen">
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-2">{t("checkout.title")}</h1>
        <p className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" /> {t("cart.secureCheckout")} — iyzico
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bebas text-2xl tracking-wide text-foreground">{t("checkout.shipping")}</h2>
                {user && !user.is_anonymous && (
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

              {isGuest && (
                <p className="text-xs text-muted-foreground mb-4">
                  {t("checkout.guestNotice")}{" "}
                  <Link to="/login" className="text-primary hover:underline">{t("auth.login")}</Link>{" "}
                  {t("checkout.guestDesc")}
                </p>
              )}

              {mode === "saved" ? (
                <AddressBook
                  selectable
                  selectedId={selectedAddress?.id || null}
                  onSelect={setSelectedAddress}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input required name="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder={t("checkout.firstName")} className={inputClass} />
                  <input required name="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder={t("checkout.lastName")} className={inputClass} />
                  <input required name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("checkout.email")} type="email" className={`sm:col-span-2 ${inputClass}`} />
                  
                  <div className="sm:col-span-2">
                    <input 
                      required 
                      name="phone" 
                      value={form.phone} 
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "");
                        if (val.startsWith("90")) val = val.substring(2);
                        if (val.length > 10) val = val.substring(0, 10);
                        setForm({ ...form, phone: val });
                      }} 
                      placeholder={`${t("checkout.phone")} (örn: 05551234567)`} 
                      type="tel" 
                      className={`w-full ${inputClass}`} 
                    />
                  </div>

                  <div className="sm:col-span-2 bg-muted/40 p-4 rounded-xl border border-border space-y-3">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{t("checkout.invoiceType")}</p>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                        <input
                          type="radio"
                          name="invoiceType"
                          checked={form.invoiceType === "individual"}
                          onChange={() => setForm({ ...form, invoiceType: "individual" })}
                          className="accent-primary"
                        />
                        {t("checkout.invoiceIndividual")}
                      </label>
                      <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                        <input
                          type="radio"
                          name="invoiceType"
                          checked={form.invoiceType === "corporate"}
                          onChange={() => setForm({ ...form, invoiceType: "corporate" })}
                          className="accent-primary"
                        />
                        {t("checkout.invoiceCorporate")}
                      </label>
                    </div>

                    {form.invoiceType === "individual" ? (
                      <input
                        required
                        name="identityNumber"
                        maxLength={11}
                        pattern="[0-9]{11}"
                        value={form.identityNumber}
                        onChange={(e) => setForm({ ...form, identityNumber: e.target.value.replace(/\D/g, "") })}
                        placeholder={t("checkout.idNumberPlaceholder")}
                        className={`w-full ${inputClass}`}
                      />
                    ) : (
                      <div className="space-y-3">
                        <input
                          required
                          name="companyName"
                          value={form.companyName}
                          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                          placeholder={t("checkout.companyNamePlaceholder")}
                          className={`w-full ${inputClass}`}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            required
                            name="taxOffice"
                            value={form.taxOffice}
                            onChange={(e) => setForm({ ...form, taxOffice: e.target.value })}
                            placeholder={t("checkout.taxOfficePlaceholder")}
                            className={inputClass}
                          />
                          <input
                            required
                            name="taxNumber"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            value={form.taxNumber}
                            onChange={(e) => setForm({ ...form, taxNumber: e.target.value.replace(/\D/g, "") })}
                            placeholder={t("checkout.taxNumberPlaceholder")}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <input required name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t("checkout.address")} className={`sm:col-span-2 ${inputClass}`} />
                  
                  <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                    <select
                      required
                      name="city"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value, district: "" })}
                      className={inputClass}
                    >
                      <option value="">{t("checkout.selectCity")}</option>
                      {Object.keys(TR_CITIES).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <select
                      required
                      name="district"
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      disabled={!form.city}
                      className={inputClass}
                    >
                      <option value="">{t("checkout.selectDistrict")}</option>
                      {form.city && TR_CITIES[form.city]?.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <input required name="postalCode" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder={t("checkout.postalCode")} className={inputClass} />
                  <input required readOnly name="country" value={t("checkout.countryValue")} placeholder={t("checkout.countryValue")} className={`${inputClass} opacity-60`} />
                  
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
              <h2 className="font-bebas text-2xl tracking-wide text-foreground mb-4">{t("checkout.shippingOptions")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { value: "yurtici", name: "Yurtiçi Kargo" },
                  { value: "aras", name: "Aras Kargo" },
                  { value: "mng", name: "MNG Kargo" },
                ] as const).map((c) => (
                  <label
                    key={c.value}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${
                      carrier === c.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="carrier"
                      value={c.value}
                      checked={carrier === c.value}
                      onChange={() => setCarrier(c.value)}
                      className="sr-only"
                    />
                    <span className="text-xs uppercase tracking-widest font-semibold">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">{t("checkout.standardDelivery")}</span>
                  </label>
                ))}
              </div>
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
                {cartProducts.map((cp: CheckoutLine) => (
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
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm uppercase tracking-widest text-muted-foreground">{t("checkout.total")}</span>
                    <span className="font-bebas text-3xl text-primary">{formatPrice(totals.total)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right mt-1">({t("common.vatIncluded")})</p>
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer leading-relaxed">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="accent-primary rounded mt-0.5"
                />
                {language === "en" ? (
                  <span>
                    I have read and accept the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal("terms")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Distance Sales Agreement
                    </button>
                    {" "}and{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal("pre-info")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Pre-Information Form
                    </button>
                    .
                  </span>
                ) : (
                  <span>
                    <button
                      type="button"
                      onClick={() => setShowTermsModal("terms")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Mesafeli Satış Sözleşmesi
                    </button>
                    {" "}ve{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal("pre-info")}
                      className="text-primary hover:underline font-semibold"
                    >
                      Ön Bilgilendirme Formu
                    </button>
                    'nu okudum, kabul ediyorum.
                  </span>
                )}
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
                {t("checkout.secureNote")}
              </p>
            </div>
          </div>
        </form>
      </main>

      {/* Dinamik Yasal Sözleşmeler Popup Modalı */}
      {showTermsModal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-bebas text-2xl tracking-wide text-foreground">
                {showTermsModal === "pre-info" ? t("checkout.preInfoModalTitle") : t("checkout.termsModalTitle")}
              </h2>
              <button
                type="button"
                onClick={() => setShowTermsModal("none")}
                className="text-muted-foreground hover:text-foreground p-1 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto pr-3 space-y-4 text-xs text-muted-foreground leading-relaxed">
              {showTermsModal === "pre-info" ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-foreground">1. SATICI BİLGİLERİ</h3>
                  <p>
                    <strong>Ünvan:</strong> {SITE_CONFIG.legalName}<br />
                    <strong>Adres:</strong> {SITE_CONFIG.address}<br />
                    <strong>E-posta:</strong> {SITE_CONFIG.email}<br />
                    <strong>Telefon:</strong> {SITE_CONFIG.phone}<br />
                    <strong>MERSİS:</strong> {SITE_CONFIG.mersis}<br />
                    <strong>Vergi Dairesi / No:</strong> {SITE_CONFIG.taxOffice} / {SITE_CONFIG.taxNumber}
                  </p>

                  <h3 className="font-bold text-sm text-foreground">2. ALICI BİLGİLERİ</h3>
                  <p>
                    <strong>Ad Soyad / Ünvan:</strong> {mode === "saved" && selectedAddress ? `${selectedAddress.first_name} ${selectedAddress.last_name}` : `${form.firstName} ${form.lastName}`}<br />
                    <strong>Fatura Türü:</strong> {mode === "saved" && selectedAddress ? (selectedAddress.invoice_type === "corporate" ? "Kurumsal" : "Bireysel") : (form.invoiceType === "corporate" ? "Kurumsal" : "Bireysel")}<br />
                    <strong>Adres:</strong> {mode === "saved" && selectedAddress ? `${selectedAddress.address_line}, ${selectedAddress.district || ""}/${selectedAddress.city}` : `${form.address}, ${form.district || ""}/${form.city}`}<br />
                    <strong>Telefon:</strong> {mode === "saved" && selectedAddress ? selectedAddress.phone : form.phone}
                  </p>

                  <h3 className="font-bold text-sm text-foreground">3. SÖZLEŞME KONUSU ÜRÜNLER</h3>
                  <table className="w-full text-left border-collapse border border-border text-xs">
                    <thead>
                      <tr className="bg-muted text-[10px] uppercase font-semibold text-foreground">
                        <th className="p-2 border border-border">Ürün</th>
                        <th className="p-2 border border-border">Boyut</th>
                        <th className="p-2 border border-border">Adet</th>
                        <th className="p-2 border border-border text-right">Birim Fiyat</th>
                        <th className="p-2 border border-border text-right">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((cp) => (
                        <tr key={`${cp.productId}-${cp.size}`}>
                          <td className="p-2 border border-border">{cp.product.title}</td>
                          <td className="p-2 border border-border">{cp.size}</td>
                          <td className="p-2 border border-border">{cp.quantity}</td>
                          <td className="p-2 border border-border text-right">{formatPrice(cp.product.prices[cp.size])}</td>
                          <td className="p-2 border border-border text-right">{formatPrice(cp.lineTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3 className="font-bold text-sm text-foreground">4. ÖDEME VE TESLİMAT</h3>
                  <p>
                    <strong>Sepet Toplamı:</strong> {formatPrice(totals.subtotal)}<br />
                    {totals.discount > 0 && <><strong>İndirim:</strong> -{formatPrice(totals.discount)}<br /></>}
                    <strong>Kargo Ücreti:</strong> {totals.shipping === 0 ? "Ücretsiz" : formatPrice(totals.shipping)}<br />
                    <strong>Ödenecek Toplam Tutar:</strong> {formatPrice(totals.total)}<br />
                    <strong>Ödeme Türü:</strong> Kredi Kartı / Banka Kartı (iyzico güvenli ödeme altyapısı)
                  </p>

                  <h3 className="font-bold text-sm text-foreground">5. CAYMA HAKKI</h3>
                  <p>
                    Alıcı, malı teslim aldığı tarihten itibaren 14 (ondört) gün içinde cayma hakkını kullanabilir. Cayma bildirimi satıcı e-posta adresine yapılmalıdır. Ürün bedeli satıcıya ulaştıktan sonra 14 gün içinde ödeme kanalının aynısıyla iade edilir.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-foreground">MESAFELİ SATIŞ SÖZLEŞMESİ</h3>
                  <p>
                    <strong>1. TARAFLAR:</strong><br />
                    İşbu Sözleşme, aşağıda belirtilen şartlar dahilinde <strong>SATICI</strong> ({SITE_CONFIG.legalName}) ile <strong>ALICI</strong> ({mode === "saved" && selectedAddress ? `${selectedAddress.first_name} ${selectedAddress.last_name}` : `${form.firstName} ${form.lastName}`}) arasında akdedilmiştir.
                  </p>
                  <p>
                    <strong>2. KONU:</strong><br />
                    İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait {SITE_CONFIG.url} internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış ücreti belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                  </p>
                  <p>
                    <strong>3. SÖZLEŞME BEDELİ VE ÖDEME:</strong><br />
                    Toplam sipariş bedeli <strong>{formatPrice(totals.total)}</strong> olup ödeme kart ile tahsil edilecektir. Kargo taşıması {carrier === "yurtici" ? "Yurtiçi Kargo" : carrier === "aras" ? "Aras Kargo" : "MNG Kargo"} tarafından gerçekleştirilecektir.
                  </p>
                  <p>
                    <strong>4. TESLİMAT:</strong><br />
                    SATICI, ürünü 3-7 iş günü içerisinde teslim etmekle yükümlüdür. Kargo teslimatı sırasında üründe kırık/yırtık gibi hasarlar varsa alıcı kargo görevlisine tutanak tutturmalıdır.
                  </p>
                  <p>
                    <strong>5. YETKİLİ MAHKEME:</strong><br />
                    İşbu sözleşmeden doğan uyuşmazlıklarda yasal parasal sınırlar dahilinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal("none")}
                className="bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}
      <SiteFooter />
    </>
  );
};

export default Checkout;
