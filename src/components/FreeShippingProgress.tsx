import { Truck, PartyPopper } from "lucide-react";
import { motion } from "motion/react";
import { SHIPPING, remainingForFreeShipping } from "@/lib/siteConfig";
import { formatPrice } from "@/lib/format";
import { useLanguage } from "@/context/LanguageContext";

interface FreeShippingProgressProps {
  subtotal: number;
}

const FreeShippingProgress = ({ subtotal }: FreeShippingProgressProps) => {
  const { t } = useLanguage();
  const remaining = remainingForFreeShipping(subtotal);
  const earned = remaining === 0;
  const pct = Math.min(100, Math.round((subtotal / SHIPPING.freeThreshold) * 100));

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {earned ? (
          <PartyPopper className="w-4 h-4 text-accent" />
        ) : (
          <Truck className="w-4 h-4 text-primary" />
        )}
        <p className="text-xs text-foreground font-medium">
          {earned ? (
            t("cart.freeShippingEarned")
          ) : (
            <>
              {t("cart.freeShippingLeft")}{" "}
              <span className="text-primary font-bold">{formatPrice(remaining)}</span>{" "}
              {t("cart.freeShippingLeft2")}
            </>
          )}
        </p>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${earned ? "bg-accent" : "bg-primary"}`}
        />
      </div>
    </div>
  );
};

export default FreeShippingProgress;
