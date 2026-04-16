# 🚀 ComicWall — Manuel Kurulum Adımları (iyzico Ödeme)

Bu dosya, ComicWall'un canlıya çıkması için **senin manuel olarak yapman gereken** adımları içerir. Tüm kod hazır ve çalışır durumda — sadece aşağıdaki yapılandırmaları tamamlaman yeterli.

---

## 1️⃣ iyzico Hesabı Oluştur

### A) Sandbox (Test) Hesabı — Önce bunu yap
Canlıya geçmeden önce her şeyi sandbox (test) ortamında deneyebilirsin. **Tamamen ücretsiz.**

1. https://sandbox-merchant.iyzipay.com adresine git
2. **"Hesap Oluştur"** butonuna tıkla
3. E-posta + şifre ile kayıt ol (gerçek bilgi vermene gerek yok)
4. Giriş yaptıktan sonra sol menüden **"Ayarlar" → "API Anahtarları"**'na git
5. Şu iki değeri kopyala:
   - **API Key** (örnek: `sandbox-xxxxxxxxxxxx`)
   - **Secret Key** (örnek: `sandbox-yyyyyyyyyyyy`)

### B) Canlı (Üretim) Hesabı — Sonra
Test her şey çalıştığında:

1. https://www.iyzico.com/basvuru adresinden gerçek başvuru yap
2. Şirket bilgileri, vergi numarası, banka hesabı bilgileri gerekecek
3. Onaylandıktan sonra https://merchant.iyzipay.com adresinde canlı API anahtarlarını alacaksın

---

## 2️⃣ API Anahtarlarını Lovable'a Ekle

ComicWall'un edge function'ları bu anahtarları kullanarak iyzico ile konuşacak. Anahtarları **Lovable Cloud'a güvenli şekilde** eklemen gerekiyor.

### Adımlar:
1. Lovable editöründe **chat'e şu mesajı yaz**:
   > "iyzico secret'larını eklemek istiyorum"

2. Lovable sana 3 secret alanı açacak. Her birine şu değerleri gir:

| Secret Adı | Değer | Açıklama |
|---|---|---|
| `IYZICO_API_KEY` | `sandbox-xxxx...` | Sandbox API Key |
| `IYZICO_SECRET_KEY` | `sandbox-yyyy...` | Sandbox Secret Key |
| `IYZICO_BASE_URL` | `https://sandbox-api.iyzipay.com` | Test ortamı URL'i |

### Canlıya geçtiğinde:
- `IYZICO_API_KEY` → canlı API Key ile değiştir
- `IYZICO_SECRET_KEY` → canlı Secret Key ile değiştir
- `IYZICO_BASE_URL` → `https://api.iyzipay.com` olarak güncelle

---

## 3️⃣ iyzico Panelinde Callback URL'ini Yapılandır (İsteğe Bağlı)

iyzico Checkout Form için callback URL'ini biz dinamik olarak gönderiyoruz, bu yüzden ek yapılandırma **gerekmez**. Ama panelden de görmek istersen:

- Callback URL kalıbımız:
  ```
  https://oatzzxujvcxnvkaonlhv.supabase.co/functions/v1/iyzico-callback
  ```

---

## 4️⃣ Test Et

### Sandbox Test Kartları
iyzico'nun resmi test kartları (gerçek para çekilmez):

| Kart Tipi | Kart No | Son Kul. | CVV |
|---|---|---|---|
| **Başarılı** | `5528790000000008` | `12/30` | `123` |
| Başarısız (Yetersiz Bakiye) | `5406670000000009` | `12/30` | `123` |
| 3D Secure | `4543600000000004` | `12/30` | `123` |

### Test Adımları
1. Siteye gir, kayıt ol veya giriş yap
2. Sepete ürün ekle, **"Ödemeye Geç"** butonuna bas
3. Teslimat formunu doldur (T.C. Kimlik No için test ortamında `11111111111` kabul edilir)
4. **"Ödemeye Geç"** → iyzico ödeme sayfasına yönlendirileceksin
5. Yukarıdaki test kartını gir
6. Ödeme başarılı olursa **"Siparişiniz Alındı 🎉"** ekranını göreceksin
7. **Profilim → Siparişlerim** menüsünden siparişi görebilirsin

---

## 5️⃣ Sipariş Durumlarını Yönetme

Şu anda siparişler ödeme sonrası `paid` olarak işaretleniyor. Sipariş durumunu **manuel** olarak güncellemek için:

### Seçenek A: Lovable veritabanı paneli
1. Sol menüde **"Backend"** → **"Veritabanı"**
2. `orders` tablosunu aç
3. İlgili siparişi bul
4. `status` alanını şu değerlerden biriyle değiştir:
   - `pending` — Ödeme bekleniyor
   - `paid` — Ödendi
   - `preparing` — Hazırlanıyor (sen baskıyı hazırlarken)
   - `shipped` — Kargoda
   - `delivered` — Teslim edildi
   - `failed` — Başarısız
   - `cancelled` — İptal edildi

### Seçenek B: Admin paneli (gelecek özellik)
İleride, sipariş durumlarını sürükle-bırak ile yönetebileceğin bir admin paneli ekleyebiliriz. Bunu istersen söyle.

---

## 6️⃣ Domain & Yayınlama

1. Lovable editöründe sağ üstteki **"Publish"** butonuna bas
2. `comicwall.lovable.app` gibi bir alt domain alacaksın
3. Kendi domain'in (örn. `comicwall.com.tr`) için: **Project Settings → Domains** menüsünden bağla

---

## 7️⃣ KVKK & Yasal Uyumluluk (Türkiye)

Türkiye'de e-ticaret yapacağın için şu sayfaları **eklememiz gerekecek** (henüz yok):

- ✅ **Mesafeli Satış Sözleşmesi** (zorunlu)
- ✅ **Ön Bilgilendirme Formu** (zorunlu)
- ✅ **Gizlilik & KVKK Aydınlatma Metni** (zorunlu)
- ✅ **İade & İptal Koşulları** (zorunlu)
- ✅ **Çerez Politikası**

Hazır olduğunda bana söyle, tüm bu sayfaları Türkiye e-ticaret mevzuatına uygun şekilde oluşturayım.

Ayrıca **ETBIS kaydı** (e-ticaret bilgi sistemi) yapman gerekiyor: https://etbis.gtb.gov.tr

---

## 🆘 Sorun mu var?

- **"iyzico API anahtarları yapılandırılmamış"** hatası → 2. adımı yapmamışsın
- **Ödeme sayfası açılmıyor** → Console'da edge function hatası olabilir, bana yapıştır
- **Test kartı çalışmıyor** → Sandbox URL'ini doğru ayarladığından emin ol (`https://sandbox-api.iyzipay.com`)
- **"Geçersiz oturum"** hatası → Önce siteye giriş yapman gerekiyor

Herhangi bir adımda takılırsan chat'e yaz, beraber çözeriz! 🚀
