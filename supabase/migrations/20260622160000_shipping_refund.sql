-- =============================================================================
-- Kargo takibi + iade iş akışı
-- orders tablosuna kargo (tracking_number, carrier) ve iade (refund_status,
-- refund_reason) alanları ekler.
-- refund_status: 'none' | 'requested' | 'approved' | 'rejected' | 'refunded'
-- =============================================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS carrier text,
  ADD COLUMN IF NOT EXISTS refund_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS refund_reason text;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_refund_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_refund_status_check
  CHECK (refund_status IN ('none', 'requested', 'approved', 'rejected', 'refunded'));

CREATE INDEX IF NOT EXISTS idx_orders_refund_status ON public.orders(refund_status);
