import { createContext, useContext, ReactNode } from "react";

export type Language = "tr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const tr: Record<string, string> = {
  // Header
  "nav.home": "Ana Sayfa",
  "nav.shop": "Mağaza",
  "nav.collections": "Koleksiyonlar",
  "nav.wishlist": "İstek Listesi",
  "nav.login": "Giriş Yap",
  "nav.profile": "Profilim",
  "nav.orders": "Siparişlerim",

  // Hero
  "hero.badge": "Premium Sanat Posterleri",
  "hero.line1": "Duvarını",
  "hero.line2": "Süper Güce",
  "hero.line3": "Dönüştür",
  "hero.desc": "Yapay zeka ile üretilmiş, orijinal çizgi roman tarzı posterler. Sinematik. Cesur. Koleksiyonluk.",
  "hero.shopNow": "Hemen Al",
  "hero.explore": "Koleksiyonları Keşfet",

  // Featured
  "featured.badge": "Seçmeler",
  "featured.title": "Öne Çıkan Posterler",
  "featured.viewAll": "Tümünü Gör",

  // Collections section
  "collections.badge": "Tematik Setler",
  "collections.title": "Koleksiyonlar",
  "collections.desc": "Set olarak alın, daha fazla tasarruf edin.",
  "collections.viewSet": "Seti Gör",
  "collections.bundleFrom": "Set fiyatı",

  // Sizes
  "sizes.badge": "Boyutlar",
  "sizes.title": "Mevcut Boyutlar",
  "sizes.from": "Başlangıç",

  // Product Card
  "product.from": "Başlangıç",
  "product.quickView": "Hızlı Bakış",
  "product.set": "Set",

  // Product Detail
  "product.notFound": "Poster Bulunamadı",
  "product.backToShop": "Mağazaya Dön",
  "product.size": "Boyut",
  "product.qty": "Adet",
  "product.addToCart": "Sepete Ekle",
  "product.buyNow": "Hemen Satın Al",
  "product.alsoAsSet": "Bu poster bir setin parçasıdır",
  "product.youMightLike": "Bunları da Beğenebilirsiniz",

  // Shop page
  "shop.badge": "Tüm Posterler",
  "shop.title": "Mağaza",
  "shop.allCategories": "Tümü",
  "shop.filter": "Filtrele",
  "shop.surpriseMe": "Beni Şaşırt!",
  "shop.noResults": "Aramanıza uygun poster bulunamadı.",
  "shop.clearFilters": "Filtreleri Temizle",
  "shop.priceRange": "Fiyat Aralığı",
  "shop.sizeFilter": "Boyut",
  "shop.allSizes": "Tüm Boyutlar",
  "shop.bundles": "Sadece Setler",

  // Collections page
  "collectionsPage.badge": "Tematik Setler",
  "collectionsPage.title": "Koleksiyonlar",

  // Collection Detail
  "collectionDetail.badge": "Koleksiyon",
  "collectionDetail.notFound": "Koleksiyon Bulunamadı",
  "collectionDetail.buySet": "Tüm seti satın al",
  "collectionDetail.addSetToCart": "Seti Sepete Ekle",

  // Cart
  "cart.title": "Alışveriş Sepeti",
  "cart.empty": "Sepetiniz boş.",
  "cart.startShopping": "Alışverişe Başla",
  "cart.orderSummary": "Sipariş Özeti",
  "cart.subtotal": "Ara Toplam",
  "cart.shipping": "Kargo",
  "cart.free": "Ücretsiz",
  "cart.total": "Toplam",
  "cart.checkout": "Ödemeye Geç",

  // Checkout
  "checkout.title": "Ödeme",
  "checkout.shipping": "Teslimat Bilgileri",
  "checkout.firstName": "Ad",
  "checkout.lastName": "Soyad",
  "checkout.email": "E-posta",
  "checkout.phone": "Telefon",
  "checkout.address": "Adres",
  "checkout.city": "Şehir",
  "checkout.postalCode": "Posta Kodu",
  "checkout.country": "Ülke",
  "checkout.identityNumber": "T.C. Kimlik No",
  "checkout.payment": "Ödeme Yöntemi",
  "checkout.creditCard": "Kredi / Banka Kartı (iyzico)",
  "checkout.iyzicoNote": "Ödeme sayfasına yönlendirileceksiniz. Tüm kart bilgileri iyzico'nun güvenli ortamında girilir.",
  "checkout.orderSummary": "Sipariş Özeti",
  "checkout.total": "Toplam",
  "checkout.placeOrder": "Ödemeye Geç",
  "checkout.processing": "Yönlendiriliyor...",
  "checkout.emptyCart": "Sepetiniz boş.",
  "checkout.goShopping": "Alışverişe git",
  "checkout.orderPlaced": "Siparişiniz alındı!",
  "checkout.orderThanks": "Satın aldığınız için teşekkür ederiz.",
  "checkout.errorTitle": "Ödeme başlatılamadı",
  "checkout.errorDesc": "Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
  "checkout.loginRequired": "Ödeme yapmak için giriş yapmalısınız.",

  // Auth
  "auth.login": "Giriş Yap",
  "auth.register": "Kayıt Ol",
  "auth.logout": "Çıkış Yap",
  "auth.email": "E-posta",
  "auth.password": "Şifre",
  "auth.displayName": "Görünen Ad",
  "auth.displayNamePlaceholder": "Adınız",
  "auth.loginDesc": "Hesabınıza giriş yapın",
  "auth.registerDesc": "Yeni hesap oluşturun",
  "auth.noAccount": "Hesabınız yok mu?",
  "auth.hasAccount": "Zaten hesabınız var mı?",
  "auth.loggingIn": "Giriş yapılıyor...",
  "auth.creating": "Oluşturuluyor...",
  "auth.error": "Hata",
  "auth.welcomeBack": "Tekrar hoş geldiniz! 🎉",
  "auth.accountCreated": "Hesabınız oluşturuldu! 🎉",
  "auth.welcomeNew": "ComicWall'a hoş geldiniz!",
  "auth.passwordMin": "Şifre en az 6 karakter olmalıdır",

  // Profile
  "profile.title": "Profilim",
  "profile.save": "Kaydet",
  "profile.saving": "Kaydediliyor...",
  "profile.saved": "Profil güncellendi ✓",

  // Wishlist
  "wishlist.title": "İstek Listesi",
  "wishlist.badge": "Favorileriniz",
  "wishlist.empty": "İstek listeniz boş. Beğendiğiniz posterleri kalp ikonuyla kaydedin.",
  "wishlist.goShopping": "Mağazaya Git",
  "wishlist.loginRequired": "İstek listesi için giriş yapmalısınız",

  // Orders
  "orders.title": "Siparişlerim",
  "orders.empty": "Henüz siparişiniz bulunmuyor.",
  "orders.orderNo": "Sipariş No",
  "orders.date": "Tarih",
  "orders.status": "Durum",
  "orders.total": "Toplam",
  "orders.items": "Ürünler",
  "orders.viewDetails": "Detayları Gör",
  "orders.status.pending": "Ödeme Bekleniyor",
  "orders.status.paid": "Ödendi",
  "orders.status.preparing": "Hazırlanıyor",
  "orders.status.shipped": "Kargoda",
  "orders.status.delivered": "Teslim Edildi",
  "orders.status.failed": "Başarısız",
  "orders.status.cancelled": "İptal Edildi",

  // Order Success
  "orderSuccess.title": "Siparişiniz Alındı! 🎉",
  "orderSuccess.desc": "Ödemeniz başarıyla tamamlandı. Siparişiniz en kısa sürede hazırlanacak.",
  "orderSuccess.viewOrders": "Siparişlerimi Gör",
  "orderSuccess.continueShopping": "Alışverişe Devam Et",
  "orderSuccess.orderNo": "Sipariş Numarası",

  // Order Failed
  "orderFailed.title": "Ödeme Başarısız",
  "orderFailed.desc": "Ödemeniz tamamlanamadı. Lütfen tekrar deneyin.",
  "orderFailed.tryAgain": "Tekrar Dene",
  "orderFailed.backToCart": "Sepete Dön",

  // Footer
  "footer.tagline": "Yapay zeka ile üretilmiş premium çizgi roman tarzı posterler. Duvarlarınızı süper güce dönüştürün.",
  "footer.shop": "Mağaza",
  "footer.allPosters": "Tüm Posterler",
  "footer.collections": "Koleksiyonlar",
  "footer.info": "Bilgi",
  "footer.shippingReturns": "Kargo & İade",
  "footer.contact": "İletişim",
  "footer.faq": "SSS",
  "footer.connect": "Bağlantı",
  "footer.newsletter": "Bülten",
  "footer.join": "Katıl",
  "footer.copyright": "© 2026 ComicWall. Tüm hakları saklıdır. Tüm eserler yapay zeka ile üretilmiş orijinal sanattır.",

  // 404
  "notFound.title": "Sayfa Bulunamadı",
  "notFound.desc": "Aradığınız sayfa mevcut değil veya taşınmış.",
  "notFound.returnHome": "Ana Sayfaya Dön",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language: Language = "tr";

  // Tek dil destekli — geri uyumluluk için boş setter
  const setLanguage = (_lang: Language) => {};

  const t = (key: string): string => tr[key] || key;

  // HTML lang sabitlenir
  if (typeof document !== "undefined") {
    document.documentElement.lang = "tr";
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
