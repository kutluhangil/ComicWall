import { useState } from "react";
import { Tag, X, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";

interface CouponInputProps {
  subtotal: number;
}

const CouponInput = ({ subtotal }: CouponInputProps) => {
  const { t } = useLanguage();
  const { coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", normalized)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast({ title: t("cart.couponInvalid"), variant: "destructive" });
        return;
      }

      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        toast({ title: t("cart.couponInvalid"), variant: "destructive" });
        return;
      }

      if (data.usage_limit && data.times_used >= data.usage_limit) {
        toast({ title: t("cart.couponInvalid"), variant: "destructive" });
        return;
      }

      if (subtotal < Number(data.min_order_amount)) {
        toast({
          title: `${t("cart.couponMinOrder")}: ${formatPrice(Number(data.min_order_amount))}`,
          variant: "destructive",
        });
        return;
      }

      applyCoupon({
        code: data.code,
        discountType: data.discount_type as "percent" | "fixed" | "free_shipping",
        discountValue: Number(data.discount_value),
        minOrderAmount: Number(data.min_order_amount),
      });
      toast({ title: t("cart.couponApplied") });
      setCode("");
    } catch {
      toast({ title: t("cart.couponInvalid"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between gap-2 bg-primary/10 border border-primary/30 rounded-xl px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Check className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary truncate">{coupon.code}</p>
            <p className="text-[10px] text-muted-foreground">
              {coupon.discountType === "percent" && `%${coupon.discountValue} indirim`}
              {coupon.discountType === "fixed" && `${formatPrice(coupon.discountValue)} indirim`}
              {coupon.discountType === "free_shipping" && "Ücretsiz kargo"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            removeCoupon();
            toast({ title: t("cart.couponRemoved") });
          }}
          aria-label="Kuponu kaldır"
          className="text-muted-foreground hover:text-destructive flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
        <Tag className="w-3 h-3" />
        {t("cart.couponCode")}
      </label>
      <div className="flex">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("cart.couponPlaceholder")}
          disabled={loading}
          className="flex-1 bg-muted border border-border rounded-l-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary uppercase disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="bg-primary text-primary-foreground text-xs uppercase tracking-widest px-4 py-2.5 rounded-r-xl hover:bg-primary/90 transition-colors font-semibold disabled:opacity-60"
        >
          {t("cart.applyCoupon")}
        </button>
      </div>
    </form>
  );
};

export default CouponInput;
