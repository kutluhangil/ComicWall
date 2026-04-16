

# ComicWall - iyzico Ödeme + Tam Türkçe + TRY Para Birimi

## Özet
1. Tüm site sadece Türkçe olacak (dil seçici kaldırılacak, varsayılan TR)
2. Tüm fiyatlar Euro (€) yerine Türk Lirası (₺) olacak
3. iyzico ödeme entegrasyonu eklenecek (sandbox + canlı destek)
4. Backend için Supabase Edge Function ile iyzico REST API kullanılacak
5. Siparişler veritabanında saklanacak

---

## 1. Para Birimi: € → ₺ (TRY)

Yeni bir `formatPrice()` yardımcı fonksiyonu (`src/lib/format.ts`) oluşturulacak. Türkiye standardına uygun:
- Örn: `₺249,90` (virgül ondalık, sonda TL sembolü Türkiye'de yaygın)
- `Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" })` kullanılacak

**Fiyatlar TRY'ye çevrilecek** (`src/data/products.ts`):
- Tek poster: 10x15 → ₺249, 13x18 → ₺379, 20x30 → ₺599
- Bundle (3'lü): 10x15 → ₺599, 13x18 → ₺899, 20x30 → ₺1.399

Etkilenen dosyalar: `Cart.tsx`, `Checkout.tsx`, `ProductDetail.tsx`, `Shop.tsx`, `Index.tsx`, `ProductCard.tsx`, `CollectionCard.tsx`, `CollectionDetail.tsx`, `Wishlist.tsx`

---

## 2. Tam Türkçe Site

- `LanguageContext.tsx` basitleştirilecek: sadece TR çevirileri kalacak, dil değiştirici kaldırılacak (`useLanguage` API'si geriye uyumlu kalacak ki mevcut kodlar bozulmasın)
- Header'daki 🌐 butonu kaldırılacak
- `<html lang="tr">` sabit olacak
- Ürün başlıkları/açıklamaları Türkçeleştirilecek (`products.ts`):
  - "The Dark Knight" → "Kara Şövalye"
  - "Cosmic Sentinel" → "Kozmik Bekçi"
  - "Crimson Speedster" → "Kızıl Şimşek"
  - "Warrior Queen" → "Savaşçı Kraliçe"
  - "Iron Titan" → "Demir Titan"
  - "Emerald Guardian" → "Zümrüt Muhafız"
  - "Thunder God" → "Şimşek Tanrısı"
  - "Web Slinger" → "Ağ Atan"
  - Kategoriler: "DC Inspired" → "DC Esinli", "Marvel Inspired" → "Marvel Esinli", "Cosmic" → "Kozmik"
  - Badge'ler: "Best Seller" → "Çok Satan", "New" → "Yeni", "Popular" → "Popüler"
  - Koleksiyon başlıkları ve açıklamaları da TR olacak

---

## 3. iyzico Ödeme Entegrasyonu

### Backend (Supabase Edge Functions)

**Yeni tablolar (migration):**
- `orders`: id, user_id, status (pending/paid/preparing/shipped/delivered/failed), total_amount, currency, shipping_info (jsonb), iyzico_payment_id, iyzico_conversation_id, created_at
- `order_items`: id, order_id, product_id, product_title, size, quantity, unit_price, line_total
- RLS: kullanıcılar yalnızca kendi siparişlerini görebilir

**Edge Functions:**
1. `iyzico-create-payment` — Sepet bilgilerini alır, iyzico **Checkout Form** API'sine istek atar, ödeme formu URL'i + token döner. Sipariş "pending" olarak kaydedilir.
2. `iyzico-callback` — iyzico'dan gelen callback'i alır, ödemeyi doğrular, sipariş durumunu "paid" olarak günceller.

### iyzico Yöntemi: Checkout Form (önerilen)
- Kullanıcı checkout sayfasında bilgileri girer → "Ödemeye Geç"
- Backend iyzico API'ye `paymentCard` olmadan checkout form başlatır
- iyzico'nun güvenli ödeme sayfasına yönlendirilir (kart bilgileri orada girilir → PCI uyumu Lovable tarafında gerek yok)
- Ödeme sonrası callback URL'imize döner → sipariş onaylanır → `/order-success` sayfasına yönlendirilir

### Gerekli Secret'lar (kullanıcıdan istenecek):
- `IYZICO_API_KEY`
- `IYZICO_SECRET_KEY`
- `IYZICO_BASE_URL` (sandbox: `https://sandbox-api.iyzipay.com`, canlı: `https://api.iyzipay.com`)

### Frontend değişiklikleri:
- `Checkout.tsx`: form alanları TR olacak, "Siparişi Onayla" butonu artık edge function'ı çağırıp iyzico'ya yönlendirecek
- Yeni `OrderSuccess.tsx` sayfası: ödeme sonrası teşekkür ekranı + sipariş özeti
- Yeni `Orders.tsx` (sipariş geçmişi) sayfası: profil menüsünden erişilebilir, sipariş listesi + durum (Hazırlanıyor / Kargoda / Teslim Edildi)

---

## 4. Etkilenen Dosyalar

**Yeni:**
- `src/lib/format.ts` (TRY formatlama)
- `src/pages/OrderSuccess.tsx`
- `src/pages/Orders.tsx`
- `supabase/functions/iyzico-create-payment/index.ts`
- `supabase/functions/iyzico-callback/index.ts`
- Migration: `orders`, `order_items` tabloları

**Güncellenecek:**
- `src/data/products.ts` (TR + TRY fiyatlar)
- `src/context/LanguageContext.tsx` (sadece TR)
- `src/components/SiteHeader.tsx` (dil butonu kaldır, "Siparişlerim" ekle)
- `src/pages/Checkout.tsx` (iyzico entegrasyonu, TRY)
- `src/pages/Cart.tsx`, `ProductDetail.tsx`, `Shop.tsx`, `Index.tsx`, `Wishlist.tsx`, `CollectionDetail.tsx` (TRY)
- `src/components/ProductCard.tsx`, `CollectionCard.tsx` (TRY)
- `src/App.tsx` (yeni route'lar)
- `index.html` (`lang="tr"`)

---

## Kullanıcının Yapması Gerekenler
1. iyzico hesabı açmak (ücretsiz sandbox: https://sandbox-merchant.iyzipay.com)
2. API anahtarlarını sağlamak — secret tool ile istenecek

