

# ComicWall - Animasyon ve Acik Tema Plani

## Ozet
Landing page'e canli motion animasyonlari eklenecek, acik tema (light mode) destegi eklenecek ve acik temada farkli bir super kahraman gorseli kullanilacak.

---

## 1. Acik Tema (Light Mode) Destegi

**`src/index.css`** dosyasina `.light` sinifi icin yeni renk degiskenleri eklenecek:
- Beyaz/acik gri arka plan
- Koyu metin renkleri
- Ayni vurgu renkleri (kirmizi, mavi, sari) korunacak ama acik temaya uygun tonlarda
- Glow efektleri acik temada daha soft olacak

**`src/App.tsx`** dosyasina `next-themes` paketi ile `ThemeProvider` eklenecek (paket zaten yuklu).

**`src/components/SiteHeader.tsx`** dosyasina tema degistirme butonu (gunes/ay ikonu) eklenecek.

---

## 2. Hero Section Animasyonlari

**`src/pages/Index.tsx`** dosyasinda hero bolumune su animasyonlar eklenecek:

- **Baslik animasyonu**: "Turn Your Wall Into a" satirlari tek tek yukari kayarak gelecek (staggered fade-in). "Superpower" kelimesi ozel bir gradient animasyonu ile parlayacak (shimmer efekti).
- **Arka plan gorseli**: Yavas bir zoom-in (scale) animasyonu ile canli hissi verecek (15-20 saniye dongude).
- **Floating particles**: Arka planda yukari dogru suzulen kucuk isik parcaciklari (CSS keyframes ile).
- **CTA butonlari**: Hafif pulse/glow animasyonu ile dikkat cekecek.
- **Vignette efekti**: Kenarlardan iceri dogru koyu gradient ile sinematik his.

**`src/index.css`** dosyasina yeni keyframe animasyonlari eklenecek:
- `@keyframes hero-zoom` - arka plan yavas zoom
- `@keyframes float-particle` - parcacik yukselme
- `@keyframes shimmer` - gradient kayma efekti
- `@keyframes pulse-glow` - buton parlama

---

## 3. Temaya Gore Farkli Hero Gorseli

- Karanlik temada mevcut `hero-banner.jpg` kullanilacak
- Acik tema icin yeni bir super kahraman gorseli olusturulacak (parlak, aydinlik tonlarda bir kahraman -- ornegin kozmik/gunesin gucunu kullanan bir karakter)
- `useTheme()` hook'u ile aktif temaya gore gorsel degistirilecek

---

## 4. Sayfa Genelinde Canlilik

- **ProductCard**: Hover'da hafif yukariya kayma + gllow animasyonu guclendirilecek
- **CollectionCard**: Hover'da gorsel uzerinde hafif paralaks efekti
- **Section basliklari**: Scroll ile gorunur oldugunda soldan saga kayarak gelme animasyonu (motion whileInView)
- **Size kartlari**: Hover'da hafif donme/titresim efekti

---

## Teknik Detaylar

Degisecek dosyalar:
1. **`src/index.css`** - Light tema renkleri + yeni keyframe animasyonlari
2. **`src/App.tsx`** - ThemeProvider eklenmesi
3. **`src/pages/Index.tsx`** - Hero animasyonlari, tema bazli gorsel, parcacik efektleri
4. **`src/components/SiteHeader.tsx`** - Tema degistirme butonu
5. **`src/components/ProductCard.tsx`** - Gelistirilmis hover animasyonlari
6. **`src/components/CollectionCard.tsx`** - Paralaks hover efekti
7. Yeni acik tema hero gorseli olusturulacak

Kullanilacak teknolojiler:
- `motion/react` (zaten yuklu) - Baslik ve kart animasyonlari
- `next-themes` (zaten yuklu) - Tema yonetimi
- CSS `@keyframes` - Arka plan ve parcacik animasyonlari
- Tailwind dark mode class strategy (zaten konfigured)

