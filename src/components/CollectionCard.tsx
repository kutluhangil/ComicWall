import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useCatalog";
import { useLanguage } from "@/context/LanguageContext";
import type { Collection } from "@/data/products";
import { motion } from "motion/react";
import { formatPrice } from "@/lib/format";

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const products = useProducts();
  const collectionProducts = collection.products
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-secondary/40 transition-all duration-500 hover:shadow-xl"
    >
      <div className="flex h-44 sm:h-52 overflow-hidden rounded-t-2xl">
        {collectionProducts.slice(0, 3).map((p) => (
          <div key={p!.id} className="flex-1 overflow-hidden">
            <img
              src={p!.image}
              alt={t("product." + p!.id + ".title") || p!.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-bebas text-xl sm:text-2xl tracking-wide text-foreground">{t("collection." + collection.id + ".title") || collection.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t("collection." + collection.id + ".desc") || collection.description}</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-foreground">
            {t("collections.bundleFrom")} <span className="font-semibold text-secondary">{formatPrice(collection.bundlePrice["10x15"])}</span>
          </p>
          <Link
            to={`/collection/${collection.slug}`}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-secondary hover:text-foreground transition-colors"
          >
            {t("collections.viewSet")} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionCard;
