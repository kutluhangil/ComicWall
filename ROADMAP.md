# ComicWall — Geliştirme Yol Haritası

> Son güncelleme: 2026-06-22
> Sahiplik: 🛠️ = kod (frontend/edge function/migration, geliştirici yapar) · 👤 = manuel (hesap/secret/yasal/para) · 🤝 = ikisi birlikte
> Efor: S = <1 gün · M = 1-3 gün · L = 1-2 hafta · XL = haftalar

---

## ✅ Tamamlanan (temel)
Ödeme tutar/kupon güvenliği, iletişim+sipariş e-posta function'ları, katalog DB katmanı (products/variants/roller), admin paneli, stok rozetleri, misafir checkout, analitik, WebP görseller, Vercel canlı deploy.

---

## P0 — Aktivasyon & Hijyen (BLOKER) · 1-2 gün
**Amaç:** Yazılan her şeyi canlıda gerçekten çalışır hale getir. Diğer tüm fazların önkoşulu.

| # | İş | Sahip | Efor |
|---|---|---|---|
| 0.1 | Supabase migration'ları uygula (`coupon_free_shipping`, `catalog_and_roles`) | 👤 | S |
| 0.2 | Edge function deploy (iyzico-create-payment, iyzico-callback, send-contact-email) | 👤 | S |
| 0.3 | Admin rolü ata (`user_roles` insert) + Anonymous sign-ins aç | 👤 | S |
| 0.4 | Secret'lar: IYZICO_*, RESEND_API_KEY | 👤 | S |
| 0.5 | iyzico **sandbox** uçtan uca test (tutar = sepet toplamı doğrulaması) | 🤝 | S |
| 0.6 | Git: değişiklikleri commit + GitHub'a push (Vercel auto-deploy bağlı) | 🛠️ | S |
| 0.7 | CI: GitHub Actions — PR'da lint + tsc + build | 🛠️ | S |
| 0.8 | `supabase gen types` ile types.ts yenile (products/variants/roller eklensin) | 👤 | S |

**Çıkış kriteri:** Sandbox'ta sipariş tam akışı çalışıyor, admin panel girişi var, CI yeşil.

---

## P1 — Sipariş Operasyonu & Fulfillment · 1-2 hafta
**Amaç:** İşi gerçekten yönetebilmek — sipariş geldikten sonrası.

| # | İş | Sahip | Efor |
|---|---|---|---|
| 1.1 | Sipariş durum timeline'ı (müşteri Orders sayfasında: hazırlanıyor→kargo→teslim) | 🛠️ | M |
| 1.2 | Kargo entegrasyonu (takip no + taşıyıcı; Aras/Yurtiçi/MNG API veya manuel giriş) | 🤝 | L |
| 1.3 | Kargo durumu değişince müşteriye e-posta/SMS bildirimi | 🛠️ | M |
| 1.4 | Admin: ürün **oluştur/sil** + görsel yükleme (Supabase Storage) | 🛠️ | M |
| 1.5 | Admin: düşük stok uyarısı + dashboard özet (günlük ciro, bekleyen sipariş) | 🛠️ | M |
| 1.6 | Stok düşürme: ödeme başarılı olunca callback'te `stock -=` (atomik) | 🛠️ | S |
| 1.7 | e-Arşiv fatura entegrasyonu (Paraşüt/Logo/Mikro) | 👤 | L |
| 1.8 | İade/iptal akışı (müşteri talebi + admin onayı + iyzico refund API) | 🛠️ | L |

**Çıkış kriteri:** Sipariş → kargo → teslim → fatura zinciri panelden yönetiliyor.

---

## P2 — Dönüşüm & Elde Tutma · 1-2 hafta
**Amaç:** Aynı trafikten daha çok satış.

| # | İş | Sahip | Efor |
|---|---|---|---|
| 2.1 | Terk edilen sepet kurtarma (e-posta + opsiyonel kupon) | 🛠️ | M |
| 2.2 | Foto'lu yorumlar + yorum moderasyonu (admin onayı) | 🛠️ | M |
| 2.3 | Ürün detayda çoklu görsel + zoom (react-medium-image-zoom zaten var) | 🛠️ | S |
| 2.4 | Upsell/cross-sell ("birlikte alınanlar", koleksiyon tamamla) | 🛠️ | M |
| 2.5 | Wishlist fiyat düşüşü / stok geldi bildirimi | 🛠️ | M |
| 2.6 | Çerçeve/kağıt tipi gibi ek varyant seçenekleri (variants genişlet) | 🛠️ | M |
| 2.7 | Güçlü site içi arama (öneri, yazım toleransı; Typesense/Algolia ya da fuse.js) | 🛠️ | M |

**Çıkış kriteri:** Dönüşüm oranı ölçülüyor (analytics) ve en az 3 kaldıraç canlı.

---

## P3 — Büyüme & SEO · 2-4 hafta
**Amaç:** Bedava organik trafik. En yüksek uzun vadeli kaldıraç.

| # | İş | Sahip | Efor |
|---|---|---|---|
| 3.1 | **SSR/SSG'ye geçiş** (Next.js migrate veya vite-react-ssg prerender) — SPA Google'da boş render | 🛠️ | XL |
| 3.2 | Ürün/koleksiyon yapısal veri (Product/Offer schema — kısmen var, genişlet) | 🛠️ | S |
| 3.3 | Dinamik sitemap (DB ürünlerinden otomatik) + Search Console | 🤝 | S |
| 3.4 | AI-SEO / AEO (LLM'lerde alıntılanma; içerik + schema) | 🛠️ | M |
| 3.5 | Blog/içerik (poster bakımı, dekorasyon rehberleri — uzun kuyruk SEO) | 🤝 | L |
| 3.6 | EN içerik çevirisi (ürün title_en/desc_en, FAQ, yasal metinler) | 🤝 | M |
| 3.7 | Görsel: responsive srcset + AVIF + CDN | 🛠️ | M |

**Çıkış kriteri:** Ürün sayfaları Google'da indeksli, Lighthouse SEO ≥95, organik tıklama artıyor.

---

## P4 — Pazarlama & CRM · 1-2 hafta
**Amaç:** Yeni müşteri kazanımı + sadakat.

| # | İş | Sahip | Efor |
|---|---|---|---|
| 4.1 | Newsletter kampanya gönderimi (toplanan e-postalara Resend broadcast) | 🛠️ | M |
| 4.2 | Meta Pixel + Google Ads conversion + TikTok pixel (reklam için şart) | 🤝 | S |
| 4.3 | Referans programı (arkadaşını getir → kupon) | 🛠️ | M |
| 4.4 | Sadakat/puan sistemi (alışverişte puan, puanla indirim) | 🛠️ | L |
| 4.5 | Otomatik kampanya kuponları (ilk alışveriş, doğum günü, win-back) | 🛠️ | M |
| 4.6 | Google Merchant Center / ürün feed (Shopping reklamları) | 🤝 | M |

---

## P5 — Sağlamlık & Kalite · sürekli
**Amaç:** Ölçeklenince çökmeyen, güvenli, bakımı kolay sistem.

| # | İş | Sahip | Efor |
|---|---|---|---|
| 5.1 | Sentry hata izleme (frontend + edge functions) | 🤝 | S |
| 5.2 | Edge function rate limiting + form'larda captcha (Turnstile) | 🛠️ | M |
| 5.3 | RLS güvenlik denetimi (tüm tablolar, admin/anon yolları) | 🛠️ | M |
| 5.4 | Test altyapısı (Vitest unit + Playwright e2e: checkout akışı) | 🛠️ | L |
| 5.5 | Erişilebilirlik denetimi (a11y, klavye, kontrast — Lighthouse ≥95) | 🛠️ | M |
| 5.6 | Performans bütçesi + route bazlı lazy load (bundle küçült) | 🛠️ | S |
| 5.7 | PWA (manifest var; offline + "ana ekrana ekle") | 🛠️ | S |

---

## P6 — Ölçek & İleri Seviye · gelecek
Çoklu para birimi/uluslararası, öneri motoru (kişiselleştirme), B2B/toplu sipariş, baskı tedarikçi otomasyonu (print-on-demand API), mobil uygulama.

---

## 🔒 Yasal & Uyumluluk (P0-P1 boyunca paralel) · 👤
- `siteConfig.ts` gerçek kurumsal bilgiler (MERSİS, vergi, ETBİS — şu an placeholder)
- Yasal metinler avukat onayı (mesafeli satış, KVKK, ön bilgilendirme, iade)
- **ETBİS kaydı** (zorunlu), e-Arşiv fatura
- KVKK: aydınlatma + açık rıza akışları, veri saklama/silme

---

## Önerilen sıra (özet)
**P0 → P1 → P2 → P3** ana hat. P4/P5 P2'den sonra paralel başlatılabilir. P3 (SSR/SEO) en büyük iş ama en yüksek uzun vadeli getiri — P1/P2 ile gelir akarken arka planda yürütülür.
