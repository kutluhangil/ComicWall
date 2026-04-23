import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Printer, RefreshCw, Truck, ShieldCheck, Sparkles, Award, PackageCheck, Star, Send, Check } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import heroBannerDark from "@/assets/posters/hero-banner.jpg";
import heroBannerLight from "@/assets/posters/hero-banner-light.jpg";
import { products, collections, SIZES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/format";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 2,
  duration: `${Math.random() * 6 + 5}s`,
  delay: `${Math.random() * 5}s`,
}));

const TESTIMONIALS = [
  {
    name: "Ayşe K.",
    initials: "AK",
    location: "İstanbul",
    rating: 5,
    text: "Muhteşem kalite! Çerçeveleyip salona astım, herkes nereden aldığımı soruyor. Baskı çok canlı, renkleri gerçekten poster üstüne çıktı.",
    date: "Mart 2026",
    colorClass: "bg-primary/20 text-primary",
  },
  {
    name: "Mert D.",
    initials: "MD",
    location: "Ankara",
    rating: 5,
    text: "Hızlı kargo, sağlam paketleme. 3'lü seti aldım, her biri ayrı ayrı harika. Ücrete göre kalitesi çok üstünde. Tekrar sipariş vereceğim.",
    date: "Şubat 2026",
    colorClass: "bg-secondary/20 text-secondary",
  },
  {
    name: "Selin A.",
    initials: "SA",
    location: "İzmir",
    rating: 5,
    text: "Orijinal ve telifsiz tasarımlar olması çok önemli benim için. Hem dekoratif hem de biricik. Her odaya bir set almayı planlıyorum!",
    date: "Nisan 2026",
    colorClass: "bg-accent/20 text-accent",
  },
];

const Index = () => {
  const featuredProducts = products.slice(0, 4);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaState, setCtaState] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => { setMounted(true); }, []);

  const heroBanner = mounted && theme === "light" ? heroBannerLight : heroBannerDark;

  const handleCtaSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setCtaState("loading");
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: ctaEmail.trim().toLowerCase() });
      if (error && error.code !== "23505") throw error;
      toast({ title: t("newsletter.success") });
      setCtaState("success");
      setCtaEmail("");
    } catch {
      toast({ title: t("newsletter.error"), variant: "destructive" });
      setCtaState("idle");
    }
  };

  return (
    <>
      <SEO
        title="ComicWall — Premium Çizgi Roman Tarzı Posterler"
        description="Yapay zeka ile üretilmiş, orijinal çizgi roman tarzı posterler. Süper kahraman temalı duvar sanatı. Türkiye'nin her yerine hızlı teslimat."
        canonicalUrl="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_CONFIG.name,
            legalName: SITE_CONFIG.legalName,
            url: SITE_CONFIG.url,
            logo: `${SITE_CONFIG.url}/favicon.ico`,
            email: SITE_CONFIG.email,
            telephone: SITE_CONFIG.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: SITE_CONFIG.address,
              addressCountry: "TR",
            },
            sameAs: [SITE_CONFIG.instagram, SITE_CONFIG.twitter].filter(Boolean),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_CONFIG.url}/shop?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      <SiteHeader />

      <main>
        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-hero-zoom w-full h-full">
              <img src={heroBanner} alt="Hero poster banner" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            <div className="absolute inset-0 shadow-[inset_0_0_150px_40px_hsl(var(--background))]" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-primary/60 animate-particle"
                style={{
                  left: p.left,
                  bottom: "-10px",
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  "--duration": p.duration,
                  "--delay": p.delay,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-20">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4 flex items-center gap-2"
              >
                <Zap className="w-3 h-3" /> {t("hero.badge")}
              </motion.p>

              <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-wide text-foreground">
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="block"
                >
                  {t("hero.line1")}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="block"
                >
                  {t("hero.line2")}{" "}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 100 }}
                  className="text-shimmer inline-block"
                >
                  {t("hero.line3")}
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-muted-foreground text-base sm:text-lg mt-6 max-w-md leading-relaxed"
              >
                {t("hero.desc")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8"
              >
                <Link
                  to="/shop"
                  className="animate-pulse-glow bg-primary text-primary-foreground px-8 py-3.5 text-sm uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors rounded-2xl text-center"
                >
                  {t("hero.shopNow")}
                </Link>
                <Link
                  to="/collections"
                  className="border border-border text-foreground px-8 py-3.5 text-sm uppercase tracking-widest font-bold hover:bg-muted transition-colors rounded-2xl text-center"
                >
                  {t("hero.explore")}
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Trust Strip ──────────────────────────────────────────── */}
        <section className="border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
              {([
                { Icon: Printer,      color: "text-primary",   title: t("trust.print"),    desc: t("trust.printDesc") },
                { Icon: RefreshCw,    color: "text-secondary", title: t("trust.return"),   desc: t("trust.returnDesc") },
                { Icon: Truck,        color: "text-accent",    title: t("trust.shipping"), desc: t("trust.shippingDesc") },
                { Icon: ShieldCheck,  color: "text-primary",   title: t("trust.secure"),   desc: t("trust.secureDesc") },
              ] as const).map(({ Icon, color, title, desc }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className={`${color} flex-shrink-0`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{title}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Featured Posters ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{t("featured.badge")}</p>
              <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">{t("featured.title")}</h2>
            </motion.div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("featured.viewAll")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground transition-colors">
              {t("featured.viewAll")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

        {/* ─── Collections ──────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-2">{t("collections.badge")}</p>
            <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">{t("collections.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("collections.desc")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <CollectionCard collection={col} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Why ComicWall ────────────────────────────────────────── */}
        <section className="bg-muted/20 border-y border-border py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">{t("why.badge")}</p>
                <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-wide text-foreground leading-tight">
                  {t("why.title")}
                </h2>
                <p className="text-muted-foreground mt-5 text-base leading-relaxed max-w-sm">
                  {t("why.desc")}
                </p>
                <Link
                  to="/shop"
                  className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
                >
                  {t("hero.shopNow")} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {([
                  { Icon: Sparkles,     color: "bg-primary/10 text-primary",   title: t("why.ai.title"),      desc: t("why.ai.desc"),      num: "01" },
                  { Icon: Award,        color: "bg-secondary/10 text-secondary", title: t("why.quality.title"), desc: t("why.quality.desc"), num: "02" },
                  { Icon: PackageCheck, color: "bg-accent/10 text-accent",     title: t("why.fast.title"),    desc: t("why.fast.desc"),    num: "03" },
                  { Icon: ShieldCheck,  color: "bg-primary/10 text-primary",   title: t("why.secure.title"),  desc: t("why.secure.desc"),  num: "04" },
                ] as const).map(({ Icon, color, title, desc, num }, i) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className={`inline-flex p-2.5 rounded-xl ${color} mb-4`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono tracking-widest mb-1">{num}</p>
                    <h3 className="font-bebas text-xl tracking-wide text-foreground mb-2">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-2">{t("testimonials.badge")}</p>
            <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">{t("testimonials.title")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {TESTIMONIALS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-primary/30 transition-colors duration-300 hover:shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <div className={`w-9 h-9 rounded-full ${item.colorClass} flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.location} · {item.date}</p>
                  </div>
                  <span className="ml-auto text-[10px] text-primary border border-primary/30 rounded-lg px-2 py-1 flex-shrink-0">
                    ✓
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Sizes ────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">{t("sizes.badge")}</p>
            <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-foreground">{t("sizes.title")}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {SIZES.map((size, i) => (
              <motion.div
                key={size.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-2xl p-8 text-center hover:border-accent/40 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className="mx-auto bg-muted rounded-xl flex items-center justify-center mb-6"
                  style={{
                    width: `${60 + i * 30}px`,
                    height: `${80 + i * 40}px`,
                  }}
                >
                  <span className="text-xs text-muted-foreground font-mono">{size.value}</span>
                </div>
                <h3 className="font-bebas text-2xl tracking-wide text-foreground">{size.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("sizes.from")} {formatPrice(SIZES[i] ? products[0].prices[SIZES[i].value] : 249)}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Newsletter CTA Strip ─────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">{t("cta.badge")}</p>
              <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-wide text-foreground mb-5 leading-tight">
                {t("cta.title")}
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto leading-relaxed">
                {t("cta.desc")}
              </p>

              {ctaState === "success" ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 text-primary rounded-2xl px-8 py-4 text-sm font-semibold"
                >
                  <Check className="w-5 h-5" />
                  {t("newsletter.success")}
                </motion.div>
              ) : (
                <form onSubmit={handleCtaSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    placeholder={t("cta.placeholder")}
                    disabled={ctaState === "loading"}
                    className="flex-1 bg-background border border-border text-sm px-4 py-3.5 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={ctaState === "loading"}
                    className="bg-primary text-primary-foreground px-6 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    {ctaState === "loading" ? "..." : t("cta.button")}
                  </button>
                </form>
              )}

              <p className="text-xs text-muted-foreground mt-5">{t("cta.note")}</p>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
};

export default Index;
