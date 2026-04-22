# ComicWall — Manuel Yapılacaklar Listesi

Bu dosya, yazılım tarafında tamamlanan işlerin **canlıya alınabilmesi** için senin manuel olarak yapman gereken adımları içerir. Sırasıyla git, her adımı bitirdikten sonra `[x]` işaretleyebilirsin.

> Son güncelleme: 2026-04-23

---

## 1. Supabase Yapılandırması

### 1.1. Ortam değişkenleri
- [ ] Proje kökünde `.env` dosyası oluştur (yoksa).
- [ ] Aşağıdaki değişkenleri Supabase panelinden (Project Settings → API) alıp ekle:
  ```env
  VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
  VITE_SUPABASE_PROJECT_ID=xxxxxxxx
  ```
- [ ] `.env` dosyasının `.gitignore` içinde olduğundan emin ol.

### 1.2. Veritabanı migration'ları
- [ ] Supabase CLI kuruluysa: `supabase db push` komutuyla tüm migration'ları uygula.
- [ ] Alternatif: `supabase/migrations/` klasöründeki SQL dosyalarını Supabase Studio → SQL Editor üzerinden sırayla çalıştır.
- [ ] Özellikle kontrol et:
  - `newsletter_subscribers`
  - `coupons`
  - `addresses`
  - `product_reviews`
  - `orders` ve `order_items`

### 1.3. RLS (Row Level Security) politikaları
- [ ] Supabase Studio → Authentication → Policies sekmesinden **her tablonun** RLS'sinin **açık** olduğunu doğrula.
- [ ] Özellikle şu politikalar olmalı:
  - `addresses`: kullanıcı yalnızca kendi adreslerini okuyabilir/yazabilir.
  - `product_reviews`: okuma herkese açık, yazma yalnızca giriş yapmış kullanıcıya.
  - `orders`: kullanıcı yalnızca kendi siparişlerini görebilir.
  - `newsletter_subscribers`: yalnızca insert public, update/delete admin-only.

---

## 2. iyzico Ödeme Entegrasyonu

- [ ] [iyzico Merchant Paneli](https://merchant.iyzipay.com) üzerinden canlı hesabını aktive et (MERSİS + vergi levhası gerekli).
- [ ] Aşağıdaki secret'ları Supabase → Edge Functions → Secrets kısmına ekle:
  ```
  IYZICO_API_KEY=...
  IYZICO_SECRET_KEY=...
  IYZICO_BASE_URL=https://api.iyzipay.com   # prod
  # veya sandbox için:
  # IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
  ```
- [ ] `iyzico-create-payment` ve `iyzico-callback` edge function'larını deploy et:
  ```bash
  supabase functions deploy iyzico-create-payment
  supabase functions deploy iyzico-callback
  ```
- [ ] Sandbox kart bilgileriyle uçtan uca test et (bkz. madde 12).
- [ ] Prod'a geçmeden önce iyzico **3DS + taksit** ayarlarını kontrol et.

---

## 3. Kurumsal Bilgiler (`src/lib/siteConfig.ts`)

Dosyayı aç ve **placeholder** değerleri gerçekleriyle değiştir:

- [ ] `legalName` — "ComicWall Ticaret Ltd. Şti." benzeri tam yasal unvan
- [ ] `mersis` — 16 haneli MERSİS numarası
- [ ] `taxOffice` — Vergi dairesi (ör. "Beşiktaş")
- [ ] `taxNumber` — Vergi kimlik numarası
- [ ] `etbis` — ETBİS kayıt numarası (Ticaret Bakanlığı)
- [ ] `tradeRegistry` — Ticaret sicil numarası
- [ ] `email` — `info@...`
- [ ] `phone` — Uluslararası formatta (ör. "+90 212 000 00 00")
- [ ] `whatsapp` — `+` ve boşluk olmadan (ör. "905551112233")
- [ ] `address` — Tam adres
- [ ] `instagram`, `twitter` — Gerçek profil URL'leri

> Bu bilgiler footer, iletişim sayfası ve tüm yasal metinlerde otomatik kullanılıyor.

---

## 4. Sosyal Medya & İletişim

- [ ] `SiteFooter.tsx` içindeki Instagram/Twitter `href="#"` linklerini gerçek profillerle değiştir (veya `siteConfig`'den otomatik al).
- [ ] WhatsApp Business hesabını kurumsal numaraya bağla.
- [ ] İsteğe bağlı: Facebook, TikTok, Pinterest hesapları eklenecekse `siteConfig.ts`'e yeni alanlar ekle.

---

## 5. Görsel Varlıklar

- [ ] `public/og-image.jpg` — **1200×630 px** OpenGraph görseli (sosyal paylaşımlarda görünür).
- [ ] `public/favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (180×180).
- [ ] `public/manifest.json` içindeki ikon yollarının doğruluğunu kontrol et.
- [ ] Hero görselleri ve koleksiyon kapak fotoğrafları WebP formatında optimize edilmiş olsun.

---

## 6. Yasal Metin İncelemesi

Aşağıdaki sayfalardaki metinleri **mutlaka bir avukatla** gözden geçir:

- [ ] `/privacy` — Gizlilik Politikası
- [ ] `/kvkk` — KVKK Aydınlatma Metni
- [ ] `/terms` — Kullanım Koşulları
- [ ] `/pre-info` — Ön Bilgilendirme Formu
- [ ] `/cookies` — Çerez Politikası
- [ ] `/shipping-returns` — Teslimat & İade

> Bu metinler taslak niteliğindedir. Türkiye Ticaret Bakanlığı Mesafeli Sözleşmeler Yönetmeliği uyumluluğu için avukat onayı şart.

---

## 7. Kupon Kodları

- [ ] Supabase Studio → `coupons` tablosuna git.
- [ ] Seed edilmiş örnek kuponları (`HOSGELDIN10`, `KARGOBEDAVA`, `YILBASI20`) kontrol et.
- [ ] Kendi kampanya kodlarını ekle; `active`, `valid_from`, `valid_until`, `max_uses`, `min_order_amount` alanlarını doğru doldur.
- [ ] Test etmek için Cart sayfasında kupon kodu gir.

---

## 8. İletişim Formu (Önemli)

`src/pages/Contact.tsx` şu an **sadece simülasyon** — gerçek mail göndermiyor.

- [ ] [Resend](https://resend.com) hesabı aç ve API key al.
- [ ] `supabase/functions/send-contact-email/index.ts` adında yeni bir edge function oluştur.
- [ ] Function içinden Resend API'sine POST at; form verisini `contact@comicwall.com` adresine gönder.
- [ ] Secret ekle: `RESEND_API_KEY=re_...`
- [ ] `Contact.tsx` içindeki `handleSubmit` fonksiyonunu edge function'ı çağıracak şekilde güncelle.

---

## 9. Sipariş E-posta Bildirimleri

- [ ] Ödeme başarılı olduğunda **müşteriye** sipariş özeti e-postası gönderen edge function yaz.
- [ ] Yeni sipariş geldiğinde **yöneticiye** bildirim e-postası gönder.
- [ ] Kargo atıldığında takip numarası bilgilendirmesi (elle veya Supabase trigger ile).

---

## 10. SEO & Analitik

- [ ] `public/sitemap.xml` içindeki URL'leri gerçek domain ile güncelle (`comicwall.com.tr` vb.).
- [ ] `public/robots.txt` içinde `Sitemap:` satırını doğrula.
- [ ] [Google Search Console](https://search.google.com/search-console) hesabı aç, domain'i doğrula, sitemap submit et.
- [ ] [Google Analytics 4](https://analytics.google.com) property oluştur; GTM veya direkt gtag ile `index.html`'e ekle.
- [ ] (Opsiyonel) Meta Pixel, Hotjar, Clarity gibi araçlar.

---

## 11. Domain & Altyapı

- [ ] Domain satın al (örn. `comicwall.com.tr`).
- [ ] Hosting platformu seç (Vercel / Netlify / Cloudflare Pages).
- [ ] DNS kayıtlarını yönlendir.
- [ ] SSL sertifikasının otomatik kurulduğunu doğrula.
- [ ] `www` → root (veya tersi) yönlendirmesini ayarla.
- [ ] Cloudflare veya benzeri CDN arkasına al (isteğe bağlı ama önerilir).

---

## 12. Uçtan Uca Test (Canlıya Geçmeden)

Aşağıdaki akışı **sandbox iyzico** ile baştan sona dene:

- [ ] Kayıt ol → doğrulama maili al
- [ ] Giriş yap
- [ ] Shop sayfasında ara, filtrele, sırala
- [ ] Ürün detayına git, yorum bırak
- [ ] Sepete ekle, kupon uygula
- [ ] Ücretsiz kargo barının doğru çalıştığını kontrol et
- [ ] Adres defterinden adres seç (veya yeni adres ekle)
- [ ] Checkout → iyzico → başarılı ödeme
- [ ] "Siparişlerim" sayfasında siparişi gör
- [ ] Siparişi iptal / iade taleplerini test et
- [ ] Mobilde tüm akışı tekrar dene
- [ ] TR ↔ EN dil değiştirmeyi header'daki toggle ile test et

---

## 13. Opsiyonel: Admin Paneli

- [ ] Supabase Studio yeterli olabilir; ancak custom bir `/admin` route planlıyorsan:
  - Sipariş listesi + durum güncelleme
  - Stok yönetimi
  - Kupon CRUD
  - Müşteri mesajları
- [ ] RLS: Admin rolü için ayrı policy gerekir.

---

## 14. İngilizce Çeviri (Devam Niteliğinde)

Site altyapısı bilingual (TR + EN); ancak **veri içerikleri** hâlâ Türkçe:

- [ ] `src/data/products.ts` — ürün başlık ve açıklamalarını çevir, veya veritabanında `title_en`, `description_en` alanı ekleyip ürün kartlarını diline göre göster.
- [ ] `src/pages/FAQ.tsx` — `groups` dizisi içindeki soru/cevaplar Türkçe; EN için ayrı bir dizi kur ve `language` değerine göre seç.
- [ ] Yasal metinler (Privacy, KVKK vs.) — hukuki olarak **Türkçe asıl geçerli**; `LegalLayout` zaten EN'de uyarı banner'ı gösteriyor. İstersen çeviri ekle.

---

## 15. Son Kontroller

- [ ] `npm run build` lokalde sorunsuz çalışıyor.
- [ ] `npm run lint` uyarısız (veya kabul edilebilir düzeyde).
- [ ] Tarayıcı console'unda hata/uyarı yok.
- [ ] Lighthouse skoru: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) ile prod URL'yi test et.
- [ ] Cookie banner doğru çalışıyor, reddet/kabul sonrası localStorage'a yazıyor.
- [ ] KVKK aydınlatma metnine kayıt formlarından link var.
- [ ] Mesafeli Satış Sözleşmesi checkout'ta onaylatılıyor.

---

## 16. Yayın Sonrası

- [ ] Google My Business kaydı (fiziksel adres varsa).
- [ ] ETBİS kaydı (Ticaret Bakanlığı — zorunlu).
- [ ] e-Arşiv Fatura entegrasyonu (Paraşüt, Logo, Mikro vs.).
- [ ] Muhasebeci ile KDV iadesi / stopaj prosedürleri.
- [ ] İlk 30 gün: düzenli error log takibi (Sentry kuruluysa).

---

**İyi çalışmalar!** Herhangi bir adımda takılırsan bu dosyadaki ilgili başlığı referans göstererek tekrar sor — birlikte çözeriz.
