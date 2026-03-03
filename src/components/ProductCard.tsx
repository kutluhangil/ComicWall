import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/data/products";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-xl"
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded-t-2xl">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-xl">
            {product.badge}
          </span>
        )}
        {product.collectionId && (
          <span className="absolute top-3 right-3 bg-secondary/90 text-secondary-foreground text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-xl">
            {t("product.set")}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <span className="inline-flex items-center gap-2 text-foreground text-xs uppercase tracking-widest font-semibold">
            <Eye className="w-4 h-4" /> {t("product.quickView")}
          </span>
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
        <h3 className="font-bebas text-lg sm:text-xl tracking-wide text-foreground">{product.title}</h3>
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <p className="text-sm text-foreground">
            {t("product.from")} <span className="font-semibold text-primary">€{product.prices["10x15"]}</span>
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product.id, "10x15");
            }}
            className="bg-foreground text-background p-2 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
