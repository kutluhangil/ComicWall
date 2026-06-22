-- tetikleyici fonksiyon: doğrulanmış alıcı durumunu DB tarafında hesaplar
CREATE OR REPLACE FUNCTION public.check_review_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Kullanıcının bu üründen teslim edilmiş veya ödenmiş başarılı bir siparişi var mı kontrol et
  NEW.is_verified_purchase := EXISTS (
    SELECT 1 
    FROM public.orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.user_id = NEW.user_id 
      AND o.status IN ('paid', 'preparing', 'shipped', 'delivered')
      AND oi.product_id = NEW.product_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- tetikleyiciyi tanımla
DROP TRIGGER IF EXISTS trg_check_review_purchase ON public.product_reviews;
CREATE TRIGGER trg_check_review_purchase
  BEFORE INSERT OR UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.check_review_purchase();
