import { ReactNode } from "react";
import { Info } from "lucide-react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SEO from "./SEO";
import { useLanguage } from "@/context/LanguageContext";

interface LegalLayoutProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  lastUpdated: string;
  children: ReactNode;
}

const LegalLayout = ({ title, seoTitle, seoDescription, canonicalUrl, lastUpdated, children }: LegalLayoutProps) => {
  const { t, language } = useLanguage();

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} canonicalUrl={canonicalUrl} />
      <SiteHeader />
      <main className="pt-24 pb-20 max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 min-h-screen">
        <header className="mb-10 border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">{t("legal.badge")}</p>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground mt-3">{t("legal.lastUpdated")}: {lastUpdated}</p>
          {language === "en" && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{t("legal.notice")}</p>
            </div>
          )}
        </header>
        <article className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bebas prose-headings:tracking-wide prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:list-disc prose-ol:list-decimal space-y-6">
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
};

export default LegalLayout;
