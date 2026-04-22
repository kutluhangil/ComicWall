// ComicWall site-wide yapılandırma sabitleri
// Kurumsal bilgiler, kargo eşikleri ve iletişim kanalları tek noktadan yönetilir.

export const SITE_CONFIG = {
  name: "ComicWall",
  legalName: "ComicWall E-Ticaret A.Ş.",
  url: "https://comicwall.com.tr",
  email: "destek@comicwall.com.tr",
  phone: "+90 850 000 00 00",
  whatsapp: "905000000000",
  instagram: "https://instagram.com/comicwall",
  twitter: "https://twitter.com/comicwall",
  address: "Teknopark Mah. Dijital Cad. No: 1, 34000 İstanbul / Türkiye",
  tradeRegistry: "İstanbul Ticaret Sicili No: 000000",
  mersis: "0000000000000000",
  taxOffice: "Maslak Vergi Dairesi",
  taxNumber: "0000000000",
  etbis: "ETBİS No: 0000-0000-0000-0000",
} as const;

export const SHIPPING = {
  // Ücretsiz kargo eşiği (TL)
  freeThreshold: 750,
  // Eşiğin altında uygulanan kargo ücreti (TL)
  standardFee: 49,
} as const;

export const calculateShipping = (subtotal: number): number =>
  subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.standardFee;

export const remainingForFreeShipping = (subtotal: number): number =>
  Math.max(0, SHIPPING.freeThreshold - subtotal);
