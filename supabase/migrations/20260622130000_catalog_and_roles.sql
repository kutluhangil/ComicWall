-- =============================================================================
-- Katalog (products + product_variants) ve rol altyapısı (user_roles)
-- - Ürünler/varyantlar DB'ye taşınır: fiyat & stok sunucu tarafında doğrulanır
-- - Admin rolü: sipariş yönetimi, stok/fiyat ve kupon CRUD için
-- Mevcut statik katalog (src/data/products.ts) seed olarak yüklenir.
-- =============================================================================

-- ---------- ROL ALTYAPISI -----------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS özyinelemesini önlemek için SECURITY DEFINER yardımcı fonksiyon
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ---------- ÜRÜNLER ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  badge TEXT,
  collection_id TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Okuma: aktif ürünler herkese açık
DROP POLICY IF EXISTS "Active products viewable by everyone" ON public.products;
CREATE POLICY "Active products viewable by everyone"
  ON public.products FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Variants viewable by everyone" ON public.product_variants;
CREATE POLICY "Variants viewable by everyone"
  ON public.product_variants FOR SELECT TO anon, authenticated
  USING (true);

-- Yazma: yalnızca admin
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products"
  ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage variants" ON public.product_variants;
CREATE POLICY "Admins manage variants"
  ON public.product_variants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- ADMIN: SİPARİŞ & KUPON YÖNETİMİ ----------------------------------
DROP POLICY IF EXISTS "Admins manage all orders" ON public.orders;
CREATE POLICY "Admins manage all orders"
  ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view all order items" ON public.order_items;
CREATE POLICY "Admins view all order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons"
  ON public.coupons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---------- SEED: mevcut statik katalog --------------------------------------
INSERT INTO public.products (id, slug, title, description, category, badge, collection_id, sort_order) VALUES
  ('dark-knight','dark-knight','Kara Şövalye','Yağmurlu bir şehrin üzerinde nöbet tutan karanlık bir kahraman; gökyüzünü yıldırımlar yarıyor. Gölgelerde adaletin ruhunu yakalayan noir esinli bir poster.','DC Esinli','Çok Satan','city-guardians',1),
  ('cosmic-hero','cosmic-hero','Kozmik Bekçi','Uzayın derinliklerinde süzülen bu kozmik kahraman, bulutsuların enerjisini avuçlarında topluyor. Bilim kurgu sanatı tutkunları için etkileyici bir parça.','Kozmik',NULL,NULL,2),
  ('speedster','speedster','Kızıl Şimşek','Şehir caddelerinde alev gibi yıldırım izleri bırakan, zamana karşı yarışan en hızlı kahraman. Tek karede yakalanmış saf hareket ve enerji.','DC Esinli',NULL,'city-guardians',3),
  ('warrior-queen','warrior-queen','Savaşçı Kraliçe','Altın renkli gün batımına karşı güçlü bir siluet. Antik zırh ile ilahi gücün birleştiği, savaşçı prensesin ihtişamlı bir sanat anıtı.','DC Esinli','Yeni','city-guardians',4),
  ('iron-titan','iron-titan','Demir Titan','Parlayan ark reaktörü, kırmızı-altın zırh ve endüstriyel arka plan. Dahi milyarder kahramanın sinematik ihtişamı tüm detayıyla.','Marvel Esinli',NULL,'avenger-series',5),
  ('emerald-guardian','emerald-guardian','Zümrüt Muhafız','İrade gücünün vücut bulmuş hâli. Yüzük gücüyle saf yeşil enerjiden silahlar yaratan bir kahraman, uzak dünyaların kozmik manzarasında.','Kozmik',NULL,NULL,6),
  ('thunder-god','thunder-god','Şimşek Tanrısı','İskandinav mitolojisi süper kahraman sinemasıyla buluşuyor. Fırtına gökyüzüne kalkan kudretli çekiç, şimşek tanrısının çağrısına yanıt veriyor.','Marvel Esinli','Popüler','avenger-series',7),
  ('web-slinger','web-slinger','Ağ Atan','Altın saatte gökdelenler arasında salınan, yer çekimine meydan okuyan akrobatik kahraman. Duvarınız için saf aksiyon enerjisi.','Marvel Esinli',NULL,'avenger-series',8)
ON CONFLICT (id) DO NOTHING;

-- Her ürüne 3 boyut varyantı (stok varsayılan 100)
INSERT INTO public.product_variants (product_id, size, price, stock)
SELECT p.id, v.size, v.price, 100
FROM public.products p
CROSS JOIN (VALUES ('10x15', 249), ('13x18', 379), ('20x30', 599)) AS v(size, price)
ON CONFLICT (product_id, size) DO NOTHING;
