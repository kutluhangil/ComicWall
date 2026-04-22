import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SEO from "./SEO";

interface LegalLayoutProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  lastUpdated: string;
  children: ReactNode;
}

const LegalLayout = ({ title, seoTitle, seoDescription, canonicalUrl, lastUpdated, children }: LegalLayoutProps) => {
  return (
    <>
      <SEO title={seoTitle} description={seoDescription} canonicalUrl={canonicalUrl} />
      <SiteHeader />
      <main className="pt-24 pb-20 max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 min-h-screen">
        <header className="mb-10 border-b border-border pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2">Yasal</p>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground mt-3">Son güncelleme: {lastUpdated}</p>
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
