-- =============================================================================
-- Stok düşümü: sipariş ödendiğinde (paid) order_items üzerinden product_variants.stock azaltılır.
-- iyzico-callback edge function, ödeme başarılı olduğunda bu RPC'yi çağırır.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.apply_order_stock(_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  oi RECORD;
BEGIN
  FOR oi IN
    SELECT product_id, size, quantity
    FROM public.order_items
    WHERE order_id = _order_id
  LOOP
    UPDATE public.product_variants
    SET stock = GREATEST(0, stock - oi.quantity)
    WHERE product_id = oi.product_id AND size = oi.size;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_order_stock(UUID) TO service_role;
