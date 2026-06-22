# ComicWall — Backend Uygulama Checklist'i

> Frontend Vercel'de canlı ve **statik fallback'lerle çalışıyor**. Aşağıdaki backend adımları
> uygulanınca DB/admin/ödeme/stok özellikleri tam aktif olur. Sırayla git.

## 1. Migration'lar (Supabase → SQL Editor veya `supabase db push`) — SIRAYLA
Bu oturumda eklenen, **henüz uygulanmamış** migration'lar:

```
supabase/migrations/20260622120000_coupon_free_shipping.sql     # free_shipping kupon tipi
supabase/migrations/20260622130000_catalog_and_roles.sql        # products + variants + user_roles + RLS + seed
supabase/migrations/20260622140000_stock_decrement.sql          # apply_order_stock() RPC
supabase/migrations/20260622150000_product_images_storage.sql   # product-images storage bucket + RLS
supabase/migrations/20260622160000_shipping_refund.sql          # orders: kargo + iade kolonları
```

## 2. Edge Function deploy
```bash
supabase functions deploy iyzico-create-payment   # DB fiyat/stok doğrulama + kupon
supabase functions deploy iyzico-callback         # kupon sayacı + stok düşümü + sipariş maili
supabase functions deploy send-contact-email      # iletişim formu
supabase functions deploy send-shipping-notification  # kargo bildirimi (admin)
supabase functions deploy request-refund          # iade talebi (müşteri)
supabase functions deploy process-refund          # iade onay/red + iyzico cancel (admin)
```
> `config.toml` JWT ayarları hazır: callback/send-contact-email `verify_jwt=false`, diğerleri `true`.

## 3. Secret'lar (Supabase → Edge Functions → Secrets)
```
IYZICO_API_KEY, IYZICO_SECRET_KEY
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com   # önce sandbox, sonra https://api.iyzipay.com
RESEND_API_KEY=re_...                              # iletişim + sipariş maili (yoksa mail atlanır)
# opsiyonel: ORDER_EMAIL_ADMIN, CONTACT_EMAIL_TO
```

## 4. Admin rolü ata (migration 130000 sonrası)
Supabase → Authentication → Users'tan kendi UID'ini al, sonra SQL Editor:
```sql
insert into public.user_roles (user_id, role) values ('<SENIN_AUTH_UID>', 'admin');
```
→ Artık `/admin` paneline erişebilirsin (Profilim → Yönetim Paneli linki de görünür).

## 5. Misafir checkout için
Supabase → Authentication → Providers → **Anonymous sign-ins** → Enable.

## 6. (Opsiyonel) TypeScript tipleri
```bash
supabase gen types typescript --project-id oatzzxujvcxnvkaonlhv > src/integrations/supabase/types.ts
```
→ products/product_variants/user_roles tipleri eklenir (kod şu an da çalışıyor, sadece tip netliği).

## 7. (Opsiyonel) Vercel — Google Analytics
Vercel → Project → Settings → Environment Variables → `VITE_GA_ID=G-XXXX` (GA4).

---

## Test (sandbox)
1. Anonymous + admin ayarlandıktan sonra siteye gir.
2. Sepete ekle → kupon uygula → checkout → iyzico test kartı `5528790000000008` / `12/30` / `123`.
3. **Doğrula:** iyzico'da çekilen tutar = sepette gösterilen toplam (indirim + kargo dahil).
4. `/admin` → sipariş "paid" görünmeli, stok düşmeli, dashboard sayıları güncellenmeli.
5. `/admin/products` → yeni ürün oluştur + görsel yükle test et.
