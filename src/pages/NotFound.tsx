import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title="404 — ComicWall"
        description="Page not found."
        canonicalUrl="/404"
      />
      <SiteHeader />
      <main className="min-h-screen flex items-center justify-center px-5 pt-20 animate-fade-in">
        <div className="text-center max-w-2xl">
          <h1 className="font-bebas text-8xl md:text-9xl tracking-tight text-foreground mb-6">
            404
          </h1>
          <p className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-4">
            {t("notFound.title")}
          </p>
          <p className="text-base text-muted-foreground mb-10 max-w-md mx-auto">
            {t("notFound.desc")}
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3.5 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
          >
            {t("notFound.returnHome")}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default NotFound;
