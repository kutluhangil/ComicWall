import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "comicwall.language";

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
  "product.features.quality": "Müze kalitesinde baskı, mat fotoğraf kağıdı",
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
  "shop.resultsCount": "ürün",
  "shop.resultsFor": "için sonuçlar",

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
  "checkout.selectAddress": "Lütfen bir adres seçin",
  "checkout.secureNote": "Ödemeyi onayladığınızda iyzico'nun güvenli ödeme sayfasına yönlendirileceksiniz.",

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
  "profile.addressSaveError": "Adres kaydedilemedi",
  "profile.addressDeleteError": "Adres silinemedi",

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
  "contact.address": "Adres",
  "contact.hours": "Çalışma Saatleri",
  "contact.hoursValue": "Pazartesi – Cuma",
  "contact.hoursRange": "09:00 – 18:00",
  "contact.corporate": "Kurumsal",
  "contact.liveSupport": "Canlı Destek",
  "contact.writeUs": "Bize Yazın",

  // FAQ
  "faq.badge": "Sıkça Sorulan Sorular",
  "faq.title": "SSS",
  "faq.desc": "En çok merak edilen soruların yanıtları.",
  "faq.notFound": "Sorunuzu bulamadınız mı?",
  "faq.supportHours": "Destek ekibimiz Pazartesi–Cuma 09:00–18:00 saatleri arasında yanıt veriyor.",
  "faq.contactCta": "İletişime Geç",

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
  "footer.corporate": "Kurumsal",
  "footer.copyright": "© 2026 ComicWall. Tüm hakları saklıdır. Tüm eserler yapay zeka ile üretilmiş orijinal sanattır.",

  // Legal pages (shared)
  "legal.badge": "Yasal",
  "legal.lastUpdated": "Son Güncelleme",
  "legal.downloadPdf": "PDF olarak indir",
  "legal.notice":
    "Bu sayfa Türkiye Cumhuriyeti mevzuatına göre hazırlanmıştır ve yalnızca Türkçe resmi metin olarak geçerlidir.",

  // Common
  "common.cancel": "İptal",
  "common.loading": "Yükleniyor...",
  "common.close": "Kapat",
  "common.language": "Dil",

  // 404
  "notFound.title": "Sayfa Bulunamadı",
  "notFound.desc": "Aradığınız sayfa mevcut değil veya taşınmış.",
  "notFound.returnHome": "Ana Sayfaya Dön",
};

const en: Record<string, string> = {
  // Header
  "nav.home": "Home",
  "nav.shop": "Shop",
  "nav.collections": "Collections",
  "nav.wishlist": "Wishlist",
  "nav.login": "Sign In",
  "nav.profile": "Profile",
  "nav.orders": "Orders",
  "nav.contact": "Contact",
  "nav.faq": "FAQ",
  "nav.search": "Search",
  "nav.searchPlaceholder": "Search posters, heroes or collections...",

  // Hero
  "hero.badge": "Premium Art Posters",
  "hero.line1": "Turn Your",
  "hero.line2": "Wall Into",
  "hero.line3": "Superpower",
  "hero.desc": "AI-generated, original comic-style posters. Cinematic. Bold. Collectible.",
  "hero.shopNow": "Shop Now",
  "hero.explore": "Explore Collections",

  // Featured
  "featured.badge": "Curated",
  "featured.title": "Featured Posters",
  "featured.viewAll": "View All",

  // Collections section
  "collections.badge": "Themed Sets",
  "collections.title": "Collections",
  "collections.desc": "Buy as a set and save more.",
  "collections.viewSet": "View Set",
  "collections.bundleFrom": "Bundle from",

  // Sizes
  "sizes.badge": "Sizes",
  "sizes.title": "Available Sizes",
  "sizes.from": "From",

  // Product Card
  "product.from": "From",
  "product.quickView": "Quick View",
  "product.set": "Set",

  // Product Detail
  "product.notFound": "Poster Not Found",
  "product.backToShop": "Back to Shop",
  "product.size": "Size",
  "product.qty": "Qty",
  "product.addToCart": "Add to Cart",
  "product.buyNow": "Buy Now",
  "product.alsoAsSet": "This poster is part of a set",
  "product.youMightLike": "You Might Also Like",
  "product.recentlyViewed": "Recently Viewed",
  "product.reviews": "Customer Reviews",
  "product.noReviews": "No reviews yet. Be the first to review!",
  "product.writeReview": "Write a Review",
  "product.verifiedPurchase": "Verified Purchase",
  "product.rating": "Rating",
  "product.reviewTitle": "Title (optional)",
  "product.reviewComment": "Share your experience...",
  "product.submitReview": "Submit Review",
  "product.updateReview": "Update Review",
  "product.deleteReview": "Delete Review",
  "product.basedOn": "reviews",
  "product.share": "Share",
  "product.linkCopied": "Link copied",
  "product.reviewSaved": "Your review was saved ✓",
  "product.reviewDeleted": "Your review was deleted",
  "product.loginForReview": "Sign in to write a review",
  "product.features.shipping": "Free shipping across Turkey (over 750 TL)",
  "product.features.quality": "Museum-quality print, matte photo paper",
  "product.features.return": "Free returns within 14 days",
  "product.features.secure": "Secure checkout with 256-bit SSL",

  // Shop page
  "shop.badge": "All Posters",
  "shop.title": "Shop",
  "shop.allCategories": "All",
  "shop.filter": "Filter",
  "shop.surpriseMe": "Surprise Me!",
  "shop.noResults": "No posters match your search.",
  "shop.clearFilters": "Clear Filters",
  "shop.priceRange": "Price Range",
  "shop.sizeFilter": "Size",
  "shop.allSizes": "All Sizes",
  "shop.bundles": "Bundles Only",
  "shop.sortBy": "Sort",
  "shop.sort.featured": "Featured",
  "shop.sort.priceAsc": "Price (Low to High)",
  "shop.sort.priceDesc": "Price (High to Low)",
  "shop.sort.newest": "Newest",
  "shop.sort.popular": "Most Popular",
  "shop.searchPlaceholder": "Search by poster name or category...",
  "shop.resultsCount": "products",
  "shop.resultsFor": "results for",

  // Collections page
  "collectionsPage.badge": "Themed Sets",
  "collectionsPage.title": "Collections",

  // Collection Detail
  "collectionDetail.badge": "Collection",
  "collectionDetail.notFound": "Collection Not Found",
  "collectionDetail.buySet": "Buy the whole set",
  "collectionDetail.addSetToCart": "Add Set to Cart",

  // Cart
  "cart.title": "Shopping Cart",
  "cart.empty": "Your cart is empty.",
  "cart.startShopping": "Start Shopping",
  "cart.orderSummary": "Order Summary",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Shipping",
  "cart.discount": "Discount",
  "cart.couponCode": "Coupon Code",
  "cart.applyCoupon": "Apply",
  "cart.couponPlaceholder": "Enter discount code",
  "cart.couponInvalid": "Invalid or expired coupon",
  "cart.couponMinOrder": "Minimum order amount for this coupon",
  "cart.couponApplied": "Coupon applied",
  "cart.couponRemoved": "Coupon removed",
  "cart.remove": "Remove",
  "cart.free": "Free",
  "cart.total": "Total",
  "cart.checkout": "Checkout",
  "cart.freeShippingLeft": "For free shipping",
  "cart.freeShippingLeft2": "left",
  "cart.freeShippingEarned": "🎉 You earned free shipping!",
  "cart.secureCheckout": "Secure checkout with 256-bit SSL",

  // Checkout
  "checkout.title": "Checkout",
  "checkout.shipping": "Shipping Details",
  "checkout.firstName": "First Name",
  "checkout.lastName": "Last Name",
  "checkout.email": "Email",
  "checkout.phone": "Phone",
  "checkout.address": "Address",
  "checkout.city": "City",
  "checkout.postalCode": "Postal Code",
  "checkout.country": "Country",
  "checkout.identityNumber": "National ID (TCKN)",
  "checkout.savedAddresses": "Saved Addresses",
  "checkout.newAddress": "New Address",
  "checkout.saveAddress": "Save this address to my address book",
  "checkout.payment": "Payment Method",
  "checkout.creditCard": "Credit / Debit Card (iyzico)",
  "checkout.iyzicoNote": "You will be redirected to the payment page. All card details are entered within iyzico's secure environment.",
  "checkout.orderSummary": "Order Summary",
  "checkout.total": "Total",
  "checkout.placeOrder": "Place Order",
  "checkout.processing": "Redirecting...",
  "checkout.emptyCart": "Your cart is empty.",
  "checkout.goShopping": "Go shopping",
  "checkout.orderPlaced": "Your order has been received!",
  "checkout.orderThanks": "Thank you for your purchase.",
  "checkout.errorTitle": "Payment could not be started",
  "checkout.errorDesc": "Please check your details and try again.",
  "checkout.loginRequired": "You must sign in to checkout.",
  "checkout.termsAgreement": "I have read and accept the Distance Sales Agreement and Pre-Information Form.",
  "checkout.termsRequired": "You must accept the agreements to continue.",
  "checkout.selectAddress": "Please select an address",
  "checkout.secureNote": "You will be redirected to iyzico's secure payment page when you confirm.",

  // Auth
  "auth.login": "Sign In",
  "auth.register": "Register",
  "auth.logout": "Sign Out",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.displayName": "Display Name",
  "auth.displayNamePlaceholder": "Your name",
  "auth.loginDesc": "Sign in to your account",
  "auth.registerDesc": "Create a new account",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.loggingIn": "Signing in...",
  "auth.creating": "Creating...",
  "auth.error": "Error",
  "auth.welcomeBack": "Welcome back! 🎉",
  "auth.accountCreated": "Your account has been created! 🎉",
  "auth.welcomeNew": "Welcome to ComicWall!",
  "auth.passwordMin": "Password must be at least 6 characters",

  // Profile
  "profile.title": "Profile",
  "profile.save": "Save",
  "profile.saving": "Saving...",
  "profile.saved": "Profile updated ✓",
  "profile.addresses": "Address Book",
  "profile.addressesDesc": "Manage your saved delivery addresses.",
  "profile.addAddress": "Add New Address",
  "profile.editAddress": "Edit Address",
  "profile.deleteAddress": "Delete Address",
  "profile.makeDefault": "Make Default",
  "profile.default": "Default",
  "profile.addressLabel": "Label",
  "profile.addressLabelPlaceholder": "Home, Work, ...",
  "profile.noAddresses": "You have no saved addresses yet.",
  "profile.addressSaved": "Address saved ✓",
  "profile.addressDeleted": "Address deleted",
  "profile.addressSaveError": "Could not save address",
  "profile.addressDeleteError": "Could not delete address",

  // Wishlist
  "wishlist.title": "Wishlist",
  "wishlist.badge": "Your Favorites",
  "wishlist.empty": "Your wishlist is empty. Save posters you love with the heart icon.",
  "wishlist.goShopping": "Go to Shop",
  "wishlist.loginRequired": "Sign in to use the wishlist",

  // Orders
  "orders.title": "My Orders",
  "orders.empty": "You don't have any orders yet.",
  "orders.orderNo": "Order No",
  "orders.date": "Date",
  "orders.status": "Status",
  "orders.total": "Total",
  "orders.items": "Items",
  "orders.viewDetails": "View Details",
  "orders.reorder": "Reorder",
  "orders.reordered": "Items added to cart",
  "orders.status.pending": "Awaiting Payment",
  "orders.status.paid": "Paid",
  "orders.status.preparing": "Preparing",
  "orders.status.shipped": "Shipped",
  "orders.status.delivered": "Delivered",
  "orders.status.failed": "Failed",
  "orders.status.cancelled": "Cancelled",

  // Order Success
  "orderSuccess.title": "Your Order is Received! 🎉",
  "orderSuccess.desc": "Your payment was successful. Your order will be prepared shortly.",
  "orderSuccess.viewOrders": "View My Orders",
  "orderSuccess.continueShopping": "Continue Shopping",
  "orderSuccess.orderNo": "Order Number",

  // Order Failed
  "orderFailed.title": "Payment Failed",
  "orderFailed.desc": "Your payment could not be completed. Please try again.",
  "orderFailed.tryAgain": "Try Again",
  "orderFailed.backToCart": "Back to Cart",

  // Cookie Banner
  "cookie.title": "Accept Cookies",
  "cookie.desc": "We use cookies to improve your experience. By continuing to use the site, you accept our cookie policy.",
  "cookie.accept": "Accept All",
  "cookie.reject": "Essential Only",
  "cookie.learnMore": "Learn More",

  // Contact
  "contact.badge": "We're Here to Help",
  "contact.title": "Contact",
  "contact.desc": "Reach us for questions, suggestions or partnerships. We usually respond within 24 hours.",
  "contact.name": "Full Name",
  "contact.subject": "Subject",
  "contact.message": "Your message",
  "contact.send": "Send",
  "contact.sending": "Sending...",
  "contact.success": "Message sent! We'll get back to you shortly.",
  "contact.error": "Could not send message. Please try again.",
  "contact.address": "Address",
  "contact.hours": "Working Hours",
  "contact.hoursValue": "Monday – Friday",
  "contact.hoursRange": "09:00 – 18:00",
  "contact.corporate": "Corporate",
  "contact.liveSupport": "Live Support",
  "contact.writeUs": "Write to Us",

  // FAQ
  "faq.badge": "Frequently Asked Questions",
  "faq.title": "FAQ",
  "faq.desc": "Answers to the most common questions.",
  "faq.notFound": "Couldn't find your question?",
  "faq.supportHours": "Our support team responds Monday–Friday, 09:00–18:00.",
  "faq.contactCta": "Get in Touch",

  // Newsletter
  "newsletter.success": "Subscription confirmed ✓",
  "newsletter.exists": "This email is already subscribed",
  "newsletter.error": "Subscription failed. Please try again.",
  "newsletter.invalidEmail": "Please enter a valid email",

  // Footer
  "footer.tagline": "Premium AI-generated comic-style posters. Turn your walls into superpower.",
  "footer.shop": "Shop",
  "footer.allPosters": "All Posters",
  "footer.collections": "Collections",
  "footer.info": "Info",
  "footer.shippingReturns": "Shipping & Returns",
  "footer.contact": "Contact",
  "footer.faq": "FAQ",
  "footer.connect": "Connect",
  "footer.newsletter": "Join our newsletter — never miss a drop.",
  "footer.join": "Join",
  "footer.legal": "Legal",
  "footer.privacy": "Privacy Policy",
  "footer.kvkk": "KVKK Notice",
  "footer.terms": "Distance Sales",
  "footer.preInfo": "Pre-Information",
  "footer.cookies": "Cookie Policy",
  "footer.corporate": "Corporate",
  "footer.copyright": "© 2026 ComicWall. All rights reserved. All artwork is original AI-generated art.",

  // Legal pages (shared)
  "legal.badge": "Legal",
  "legal.lastUpdated": "Last updated",
  "legal.downloadPdf": "Download as PDF",
  "legal.notice":
    "This page is prepared under the laws of the Republic of Türkiye and is legally binding only in its Turkish original.",

  // Common
  "common.cancel": "Cancel",
  "common.loading": "Loading...",
  "common.close": "Close",
  "common.language": "Language",

  // 404
  "notFound.title": "Page Not Found",
  "notFound.desc": "The page you're looking for doesn't exist or has moved.",
  "notFound.returnHome": "Back to Home",
};

const dictionaries: Record<Language, Record<string, string>> = { tr, en };

function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "tr";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "tr" || stored === "en") return stored;
  } catch {
    // ignore
  }
  const browser = typeof navigator !== "undefined" ? navigator.language : "tr";
  return browser.toLowerCase().startsWith("en") ? "en" : "tr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string): string => dictionaries[language][key] ?? tr[key] ?? key;

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
