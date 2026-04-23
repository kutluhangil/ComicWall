import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Award, ShieldCheck, Package, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/siteConfig";

const About = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const values = [
    { Icon: Sparkles, color: "bg-primary/10 text-primary",   title: t("about.v1.title"), desc: t("about.v1.desc") },
    { Icon: Award,    color: "bg-secondary/10 text-secondary", title: t("about.v2.title"), desc: t("about.v2.desc") },
    { Icon: ShieldCheck, color: "bg-accent/10 text-accent",  title: t("about.v3.title"), desc: t("about.v3.desc") },
    { Icon: Package,  color: "bg-primary/10 text-primary",   title: t("about.v4.title"), desc: t("about.v4.desc") },
  ];

  return (
    <>
      <SEO
        title={isEn ? "About Us — ComicWall" : "Hakkımızda — ComicWall"}
        description={
          isEn
            ? "Learn about ComicWall — original AI-generated comic-style posters, museum-quality printing and our story."
            : "ComicWall hakkında: yapay zeka ile üretilmiş özgün posterler, müze kalitesinde baskı ve hikayemiz."
        }
        canonicalUrl="/about"
      />
      <SiteHeader />

      <main className="pt-[var(--header-h)] pb-20 min-h-screen">

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(var(--primary)/0.08),transparent)]" />
          <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">{t("about.badge")}</p>
              <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl tracking-wide text-foreground leading-none">
                {t("about.title")}
              </h1>
              <p className="text-muted-foreground mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                {t("about.missionDesc")}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                <span className="inline-flex items-center gap-1.5 border border-border rounded-xl px-4 py-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> AI-Generated Art
                </span>
                <span className="inline-flex items-center gap-1.5 border border-border rounded-xl px-4 py-2 text-xs text-muted-foreground">
                  <Award className="w-3.5 h-3.5 text-secondary" /> Museum-Quality Print
                </span>
                <span className="inline-flex items-center gap-1.5 border border-border rounded-xl px-4 py-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" /> 100% Copyright-Free
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Mission ──────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">{t("about.missionBadge")}</p>
              <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground leading-tight">
                {t("about.missionTitle")}
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">{t("about.missionDesc")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 space-y-4"
            >
              {[
                { num: "2026", label: isEn ? "Founded" : "Kuruluş yılı" },
                { num: "100%", label: isEn ? "Original AI artwork" : "Özgün AI eserleri" },
                { num: "250gsm", label: isEn ? "Museum-quality paper" : "Müze kalitesi kağıt" },
                { num: "14 " + (isEn ? "days" : "gün"), label: isEn ? "Free return guarantee" : "Ücretsiz iade garantisi" },
              ].map(({ num, label }) => (
                <div key={num} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                  <span className="font-bebas text-3xl text-primary tracking-wide">{num}</span>
                  <span className="text-sm text-muted-foreground text-right">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── AI Art Explainer ─────────────────────────────────────── */}
        <section className="bg-muted/20 border-y border-border py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: isEn ? "Licensed Content" : "Lisanslı İçerik", value: isEn ? "None" : "Yok", ok: true },
                    { label: isEn ? "Copyright Risk" : "Telif Riski", value: isEn ? "Zero" : "Sıfır", ok: true },
                    { label: isEn ? "Unique designs" : "Benzersiz Tasarım", value: "100%", ok: true },
                    { label: isEn ? "Human oversight" : "İnsan Denetimi", value: isEn ? "Always" : "Her Zaman", ok: true },
                  ].map(({ label, value, ok }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                      <p className="font-bebas text-2xl text-primary tracking-wide">{value}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-tight">{label}</p>
                      {ok && <span className="inline-block mt-2 text-[10px] text-primary border border-primary/30 rounded-lg px-2 py-0.5">✓</span>}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 md:order-2"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3">{t("about.aiBadge")}</p>
                <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground leading-tight">
                  {t("about.aiTitle")}
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">{t("about.aiDesc")}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Values ───────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">{t("about.valuesBadge")}</p>
            <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground">{t("about.valuesTitle")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(({ Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:border-primary/30 transition-colors"
              >
                <div className={`inline-flex p-3 rounded-xl ${color} flex-shrink-0 h-fit`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bebas text-xl tracking-wide text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">{t("about.ctaTitle")}</p>
            <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground mb-3">{t("about.ctaDesc")}</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
              {SITE_CONFIG.legalName} · {SITE_CONFIG.taxOffice} V.D.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
            >
              {t("about.cta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
};

export default About;
