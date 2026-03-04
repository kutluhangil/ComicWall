import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Header
    "nav.home": "Ana Sayfa",
    "nav.shop": "Mağaza",
    "nav.collections": "Koleksiyonlar",
    "nav.wishlist": "İstek Listesi",
    "nav.login": "Giriş Yap",
    "nav.profile": "Profilim",

    // Hero
    "hero.badge": "Premium Sanat Posterleri",
    "hero.line1": "Duvarını",
    "hero.line2": "Süper Güce",
    "hero.line3": "Dönüştür",
    "hero.desc": "Yapay zeka ile üretilmiş, orijinal çizgi roman tarzı posterler. Sinematik. Cesur. Koleksiyon parçası.",
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
    "checkout.address": "Adres",
    "checkout.city": "Şehir",
    "checkout.postalCode": "Posta Kodu",
    "checkout.country": "Ülke",
    "checkout.payment": "Ödeme Yöntemi",
    "checkout.creditCard": "Kredi Kartı",
    "checkout.orderSummary": "Sipariş Özeti",
    "checkout.total": "Toplam",
    "checkout.placeOrder": "Siparişi Onayla",
    "checkout.processing": "İşleniyor...",
    "checkout.emptyCart": "Sepetiniz boş.",
    "checkout.goShopping": "Alışverişe git",
    "checkout.orderPlaced": "Siparişiniz alındı!",
    "checkout.orderThanks": "Satın aldığınız için teşekkür ederiz.",

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
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.collections": "Collections",
    "nav.wishlist": "Wishlist",
    "nav.login": "Login",
    "nav.profile": "My Profile",

    // Hero
    "hero.badge": "Premium Art Posters",
    "hero.line1": "Turn Your Wall",
    "hero.line2": "Into a",
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
    "collections.desc": "Save more when you buy a complete set.",
    "collections.viewSet": "View Set",
    "collections.bundleFrom": "Bundle from",

    // Sizes
    "sizes.badge": "Dimensions",
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
    "product.alsoAsSet": "Also available as a set",
    "product.youMightLike": "You Might Also Like",

    // Shop page
    "shop.badge": "All Posters",
    "shop.title": "The Shop",
    "shop.allCategories": "All",
    "shop.filter": "Filter",
    "shop.surpriseMe": "Surprise Me!",
    "shop.noResults": "No posters match your filters.",
    "shop.clearFilters": "Clear Filters",
    "shop.priceRange": "Price Range",
    "shop.sizeFilter": "Size",
    "shop.allSizes": "All Sizes",
    "shop.bundles": "Sets Only",

    // Collections page
    "collectionsPage.badge": "Themed Sets",
    "collectionsPage.title": "Collections",

    // Collection Detail
    "collectionDetail.badge": "Collection",
    "collectionDetail.notFound": "Collection Not Found",
    "collectionDetail.buySet": "Buy the entire set",
    "collectionDetail.addSetToCart": "Add Set to Cart",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty.",
    "cart.startShopping": "Start Shopping",
    "cart.orderSummary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "Free",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.shipping": "Shipping Details",
    "checkout.firstName": "First Name",
    "checkout.lastName": "Last Name",
    "checkout.email": "Email",
    "checkout.address": "Address",
    "checkout.city": "City",
    "checkout.postalCode": "Postal Code",
    "checkout.country": "Country",
    "checkout.payment": "Payment",
    "checkout.creditCard": "Credit Card",
    "checkout.orderSummary": "Order Summary",
    "checkout.total": "Total",
    "checkout.placeOrder": "Place Order",
    "checkout.processing": "Processing...",
    "checkout.emptyCart": "Your cart is empty.",
    "checkout.goShopping": "Go shopping",
    "checkout.orderPlaced": "Order placed!",
    "checkout.orderThanks": "Thank you for your purchase.",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
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
    "auth.accountCreated": "Account created! 🎉",
    "auth.welcomeNew": "Welcome to ComicWall!",
    "auth.passwordMin": "Password must be at least 6 characters",

    // Profile
    "profile.title": "My Profile",
    "profile.save": "Save",
    "profile.saving": "Saving...",
    "profile.saved": "Profile updated ✓",

    // Wishlist
    "wishlist.title": "Wishlist",
    "wishlist.badge": "Your Favorites",
    "wishlist.empty": "Your wishlist is empty. Save posters you like with the heart icon.",
    "wishlist.goShopping": "Go to Shop",
    "wishlist.loginRequired": "Login required for wishlist",

    // Footer
    "footer.tagline": "Premium AI-generated comic-style posters. Turn your walls into a superpower.",
    "footer.shop": "Shop",
    "footer.allPosters": "All Posters",
    "footer.collections": "Collections",
    "footer.info": "Info",
    "footer.shippingReturns": "Shipping & Returns",
    "footer.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.connect": "Connect",
    "footer.newsletter": "Newsletter",
    "footer.join": "Join",
    "footer.copyright": "© 2026 ComicWall. All rights reserved. All artwork is AI-generated original art.",

    // 404
    "notFound.title": "Page Not Found",
    "notFound.desc": "The page you're looking for doesn't exist or has been moved.",
    "notFound.returnHome": "Return Home",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("comicwall-lang");
      if (saved === "tr" || saved === "en") return saved;
    } catch {}
    if (typeof navigator !== "undefined" && navigator.language?.startsWith("tr")) return "tr";
    return "tr";
  });

  useEffect(() => {
    localStorage.setItem("comicwall-lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

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
