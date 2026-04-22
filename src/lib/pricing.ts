import type { AppliedCoupon } from "@/context/CartContext";
import { calculateShipping } from "@/lib/siteConfig";

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingFromCoupon: boolean;
}

export function calculateOrderTotals(subtotal: number, coupon: AppliedCoupon | null): OrderTotals {
  let discount = 0;
  let freeShippingFromCoupon = false;

  const couponValid = coupon && subtotal >= coupon.minOrderAmount;

  if (couponValid) {
    if (coupon.discountType === "percent") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else if (coupon.discountType === "fixed") {
      discount = Math.min(coupon.discountValue, subtotal);
    } else if (coupon.discountType === "free_shipping") {
      freeShippingFromCoupon = true;
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const baseShipping = calculateShipping(subtotalAfterDiscount);
  const shipping = freeShippingFromCoupon ? 0 : baseShipping;
  const total = subtotalAfterDiscount + shipping;

  return { subtotal, discount, shipping, total, freeShippingFromCoupon };
}
