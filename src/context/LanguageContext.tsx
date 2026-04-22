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
  "nav.contact": "İletişim",
  "nav.faq": "SSS",
  "nav.search": "Ara",
  "nav.searchPlaceholder": "Poster, kahraman veya koleksiyon ara...",

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
  "product.recentlyViewed": "Son Baktıkların",
  "product.reviews": "Müşteri Yorumları",
  "product.noReviews": "Henüz yorum yok. İlk yorumu siz yazın!",
  "product.writeReview": "Yorum Yaz",
  "product.verifiedPurchase": "Doğrulanmış Alışveriş",
  "product.rating": "Değerlendirme",
  "product.reviewTitle": "Başlık (ops.)",
  "product.reviewComment": "Deneyiminizi paylaşın...",
  "product.submitReview": "Yorumu Gönder",
  "product.updateReview": "Yorumu Güncelle",
  "product.deleteReview": "Yorumu Sil",
  "product.basedOn": "değerlendirme",
  "product.share": "Paylaş",
  "product.linkCopied": "Bağlantı kopyalandı",
  "product.reviewSaved": "Yorumunuz kaydedildi ✓",
  "product.reviewDeleted": "Yorumunuz silindi",
  "product.loginForReview": "Yorum yazmak için giriş yapın",
  "product.features.shipping": "Türkiye'nin her yerine ücretsiz kargo (750 TL üzeri)",
  "product.features.quality": "Müzik kalitesinde baskı, mat fotoğraf kağıdı",
  "product.features.return": "14 gün içinde ücretsiz iade",
  "product.features.secure": "256-bit SSL ile güvenli ödeme",

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
  "shop.sortBy": "Sırala",
  "shop.sort.featured": "Önerilen",
  "shop.sort.priceAsc": "Fiyat (Artan)",
  "shop.sort.priceDesc": "Fiyat (Azalan)",
  "shop.sort.newest": "En Yeni",
  "shop.sort.popular": "En Popüler",
  "shop.searchPlaceholder": "Poster adı veya kategoriye göre ara...",

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
  "cart.discount": "İndirim",
  "cart.couponCode": "Kupon Kodu",
  "cart.applyCoupon": "Uygula",
  "cart.couponPlaceholder": "İndirim kodu girin",
  "cart.couponInvalid": "Geçersiz veya süresi dolmuş kupon",
  "cart.couponMinOrder": "Bu kupon için minimum sipariş tutarı",
  "cart.couponApplied": "Kupon uygulandı",
  "cart.couponRemoved": "Kupon kaldırıldı",
  "cart.remove": "Kaldır",
  "cart.free": "Ücretsiz",
  "cart.total": "Toplam",
  "cart.checkout": "Ödemeye Geç",
  "cart.freeShippingLeft": "Ücretsiz kargo için",
  "cart.freeShippingLeft2": "daha kaldı",
  "cart.freeShippingEarned": "🎉 Ücretsiz kargo kazandınız!",
  "cart.secureCheckout": "256-bit SSL ile güvenli ödeme",

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
  "checkout.savedAddresses": "Kayıtlı Adreslerim",
  "checkout.newAddress": "Yeni Adres",
  "checkout.saveAddress": "Bu adresi adres defterime kaydet",
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
  "checkout.termsAgreement": "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu'nu okudum, kabul ediyorum.",
  "checkout.termsRequired": "Devam etmek için sözleşmeleri kabul etmelisiniz.",

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
  "profile.addresses": "Adres Defterim",
  "profile.addressesDesc": "Teslimat için kayıtlı adreslerinizi yönetin.",
  "profile.addAddress": "Yeni Adres Ekle",
  "profile.editAddress": "Adresi Düzenle",
  "profile.deleteAddress": "Adresi Sil",
  "profile.makeDefault": "Varsayılan Yap",
  "profile.default": "Varsayılan",
  "profile.addressLabel": "Adres Başlığı",
  "profile.addressLabelPlaceholder": "Ev, İş, ...",
  "profile.noAddresses": "Henüz kayıtlı adresiniz yok.",
  "profile.addressSaved": "Adres kaydedildi ✓",
  "profile.addressDeleted": "Adres silindi",

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
  "orders.reorder": "Tekrar Sipariş Ver",
  "orders.reordered": "Ürünler sepete eklendi",
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

  // Cookie Banner
  "cookie.title": "Çerezleri Kabul Et",
  "cookie.desc": "Deneyiminizi iyileştirmek için çerezleri kullanıyoruz. Siteyi kullanmaya devam ederek çerez politikamızı kabul etmiş olursunuz.",
  "cookie.accept": "Tümünü Kabul Et",
  "cookie.reject": "Yalnızca Gerekli",
  "cookie.learnMore": "Daha Fazla",

  // Contact
  "contact.badge": "Size Yardımcı Olalım",
  "contact.title": "İletişim",
  "contact.desc": "Soru, öneri veya iş birliği için bize ulaşın. Genellikle 24 saat içinde yanıt veriyoruz.",
  "contact.name": "Ad Soyad",
  "contact.subject": "Konu",
  "contact.message": "Mesajınız",
  "contact.send": "Gönder",
  "contact.sending": "Gönderiliyor...",
  "contact.success": "Mesajınız iletildi! En kısa sürede dönüş yapacağız.",
  "contact.error": "Mesaj gönderilemedi. Lütfen tekrar deneyin.",

  // FAQ
  "faq.badge": "Sıkça Sorulan Sorular",
  "faq.title": "SSS",
  "faq.desc": "En çok merak edilen soruların yanıtları.",

  // Newsletter
  "newsletter.success": "Aboneliğiniz kaydedildi ✓",
  "newsletter.exists": "Bu e-posta zaten kayıtlı",
  "newsletter.error": "Abonelik başarısız. Lütfen tekrar deneyin.",
  "newsletter.invalidEmail": "Geçerli bir e-posta giriniz",

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
  "footer.newsletter": "Bültenimize katıl — özel kampanyaları kaçırma.",
  "footer.join": "Katıl",
  "footer.legal": "Yasal",
  "footer.privacy": "Gizlilik Politikası",
  "footer.kvkk": "KVKK Aydınlatma",
  "footer.terms": "Mesafeli Satış",
  "footer.preInfo": "Ön Bilgilendirme",
  "footer.cookies": "Çerez Politikası",
  "footer.copyright": "© 2026 ComicWall. Tüm hakları saklıdır. Tüm eserler yapay zeka ile üretilmiş orijinal sanattır.",

  // Legal pages (shared)
  "legal.lastUpdated": "Son Güncelleme",
  "legal.downloadPdf": "PDF olarak indir",

  // 404
  "notFound.title": "Sayfa Bulunamadı",
  "notFound.desc": "Aradığınız sayfa mevcut değil veya taşınmış.",
  "notFound.returnHome": "Ana Sayfaya Dön",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language: Language = "tr";

  const setLanguage = (_lang: Language) => {};

  const t = (key: string): string => tr[key] || key;

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
