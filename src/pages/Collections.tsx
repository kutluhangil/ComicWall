import { collections } from "@/data/products";
import CollectionCard from "@/components/CollectionCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";

const Collections = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO title="Collections — ComicWall" description="Shop themed poster sets and save." canonicalUrl="/collections" />
      <SiteHeader />
      <main className="pt-[var(--header-h)] max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-2">{t("collectionsPage.badge")}</p>
          <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground">{t("collectionsPage.title")}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default Collections;
