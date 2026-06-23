import { X, ArrowRight, Truck, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useCatalog";
import { remainingForFreeShipping } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/format";

interface AnnouncementBarProps {
  onDismiss: () => void;
}

const AnnouncementBar = ({ onDismiss }: AnnouncementBarProps) => {
  const { t } = useLanguage();
  const { items } = useCart();
  const products = useProducts();

  const subtotal = items.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.prices[item.size] * item.quantity : 0);
  }, 0);

  const remaining = remainingForFreeShipping(subtotal);
  const earned = remaining === 0;

  return (
    <div className={`${earned ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"} text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-2 relative transition-colors duration-300`}>
      {subtotal === 0 ? (
        <>
          <span>{t("announcement.text")}</span>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            {t("announcement.cta")} <ArrowRight className="w-3 h-3" />
          </Link>
        </>
      ) : earned ? (
        <span className="flex items-center gap-1.5 font-bold">
          <PartyPopper className="w-4 h-4" /> {t("announcement.freeEarned")}
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <Truck className="w-4 h-4" /> {t("announcement.freeLeft")}{" "}
          <span className="font-bold underline">{formatPrice(remaining)}</span>{" "}
          {t("announcement.freeLeft2")}
        </span>
      )}
      <button
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1 rounded"
        aria-label={t("common.close")}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
