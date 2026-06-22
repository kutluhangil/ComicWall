-- =============================================================================
-- Kupon: free_shipping (ücretsiz kargo) tipini destekle
-- discount_type CHECK kısıtını genişletir ve KARGOBEDAVA kuponunu free_shipping yapar.
-- =============================================================================

ALTER TABLE public.coupons
  DROP CONSTRAINT IF EXISTS coupons_discount_type_check;

ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_discount_type_check
  CHECK (discount_type IN ('percent', 'fixed', 'free_shipping'));

-- KARGOBEDAVA artık gerçek ücretsiz kargo kuponu (sabit 49 TL indirim yerine)
UPDATE public.coupons
SET discount_type = 'free_shipping',
    discount_value = 0,
    description = 'Belirtilen tutar üzeri ücretsiz kargo'
WHERE code = 'KARGOBEDAVA';
