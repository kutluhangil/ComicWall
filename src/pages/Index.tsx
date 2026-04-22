import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 2,
  duration: `${Math.random() * 6 + 5}s`,
  delay: `${Math.random() * 5}s`,
}));

const Index = () => {
  const featuredProducts = products.slice(0, 4);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => { setMounted(true); }, []);

  const heroBanner = mounted && theme === "light" ? heroBannerLight : heroBannerDark;

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
        {/* Hero Section */}
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-hero-zoom w-full h-full">
              <img src={heroBanner} alt="Hero poster banner" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            <div className="absolute inset-0 shadow-[inset_0_0_150px_40px_hsl(var(--background))]" />
          </div>

          {/* Floating particles */}
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

        {/* Featured Posters */}
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
        </section>

        {/* Collections */}
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

        {/* Sizes Section */}
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
      </main>

      <SiteFooter />
    </>
  );
};

export default Index;
