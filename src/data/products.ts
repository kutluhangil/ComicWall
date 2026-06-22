import posterDarkKnight from "@/assets/posters/poster-dark-knight.webp";
import posterCosmicHero from "@/assets/posters/poster-cosmic-hero.webp";
import posterSpeedster from "@/assets/posters/poster-speedster.webp";
import posterWarriorQueen from "@/assets/posters/poster-warrior-queen.webp";
import posterIronTitan from "@/assets/posters/poster-iron-titan.webp";
import posterEmeraldGuardian from "@/assets/posters/poster-emerald-guardian.webp";
import posterThunderGod from "@/assets/posters/poster-thunder-god.webp";
import posterWebSlinger from "@/assets/posters/poster-web-slinger.webp";

export type PosterSize = "10x15" | "13x18" | "20x30";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  prices: Record<PosterSize, number>;
  category: string;
  badge?: string;
  collectionId?: string;
  /** DB varyantlarından toplam stok. Statik fallback'te undefined (sınırsız varsayılır). */
  stock?: number;
  /** Boyut bazında stok. DB'den gelir; statikte yok. */
  variantStock?: Partial<Record<PosterSize, number>>;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  products: string[]; // product ids
  bundlePrice: Record<PosterSize, number>;
}

export const SIZES: { value: PosterSize; label: string }[] = [
  { value: "10x15", label: "10 × 15 cm" },
  { value: "13x18", label: "13 × 18 cm" },
  { value: "20x30", label: "20 × 30 cm" },
];

// Tüm fiyatlar Türk Lirası (TRY) cinsindendir
const SINGLE_PRICES: Record<PosterSize, number> = { "10x15": 249, "13x18": 379, "20x30": 599 };
const BUNDLE_PRICES: Record<PosterSize, number> = { "10x15": 599, "13x18": 899, "20x30": 1399 };

export const products: Product[] = [
  {
    id: "dark-knight",
    slug: "dark-knight",
    title: "Kara Şövalye",
    description: "Yağmurlu bir şehrin üzerinde nöbet tutan karanlık bir kahraman; gökyüzünü yıldırımlar yarıyor. Gölgelerde adaletin ruhunu yakalayan noir esinli bir poster.",
    image: posterDarkKnight,
    prices: SINGLE_PRICES,
    category: "DC Esinli",
    badge: "Çok Satan",
    collectionId: "city-guardians",
  },
  {
    id: "cosmic-hero",
    slug: "cosmic-hero",
    title: "Kozmik Bekçi",
    description: "Uzayın derinliklerinde süzülen bu kozmik kahraman, bulutsuların enerjisini avuçlarında topluyor. Bilim kurgu sanatı tutkunları için etkileyici bir parça.",
    image: posterCosmicHero,
    prices: SINGLE_PRICES,
    category: "Kozmik",
  },
  {
    id: "speedster",
    slug: "speedster",
    title: "Kızıl Şimşek",
    description: "Şehir caddelerinde alev gibi yıldırım izleri bırakan, zamana karşı yarışan en hızlı kahraman. Tek karede yakalanmış saf hareket ve enerji.",
    image: posterSpeedster,
    prices: SINGLE_PRICES,
    category: "DC Esinli",
    collectionId: "city-guardians",
  },
  {
    id: "warrior-queen",
    slug: "warrior-queen",
    title: "Savaşçı Kraliçe",
    description: "Altın renkli gün batımına karşı güçlü bir siluet. Antik zırh ile ilahi gücün birleştiği, savaşçı prensesin ihtişamlı bir sanat anıtı.",
    image: posterWarriorQueen,
    prices: SINGLE_PRICES,
    category: "DC Esinli",
    badge: "Yeni",
    collectionId: "city-guardians",
  },
  {
    id: "iron-titan",
    slug: "iron-titan",
    title: "Demir Titan",
    description: "Parlayan ark reaktörü, kırmızı-altın zırh ve endüstriyel arka plan. Dahi milyarder kahramanın sinematik ihtişamı tüm detayıyla.",
    image: posterIronTitan,
    prices: SINGLE_PRICES,
    category: "Marvel Esinli",
    collectionId: "avenger-series",
  },
  {
    id: "emerald-guardian",
    slug: "emerald-guardian",
    title: "Zümrüt Muhafız",
    description: "İrade gücünün vücut bulmuş hâli. Yüzük gücüyle saf yeşil enerjiden silahlar yaratan bir kahraman, uzak dünyaların kozmik manzarasında.",
    image: posterEmeraldGuardian,
    prices: SINGLE_PRICES,
    category: "Kozmik",
  },
  {
    id: "thunder-god",
    slug: "thunder-god",
    title: "Şimşek Tanrısı",
    description: "İskandinav mitolojisi süper kahraman sinemasıyla buluşuyor. Fırtına gökyüzüne kalkan kudretli çekiç, şimşek tanrısının çağrısına yanıt veriyor.",
    image: posterThunderGod,
    prices: SINGLE_PRICES,
    category: "Marvel Esinli",
    badge: "Popüler",
    collectionId: "avenger-series",
  },
  {
    id: "web-slinger",
    slug: "web-slinger",
    title: "Ağ Atan",
    description: "Altın saatte gökdelenler arasında salınan, yer çekimine meydan okuyan akrobatik kahraman. Duvarınız için saf aksiyon enerjisi.",
    image: posterWebSlinger,
    prices: SINGLE_PRICES,
    category: "Marvel Esinli",
    collectionId: "avenger-series",
  },
];

export const collections: Collection[] = [
  {
    id: "city-guardians",
    slug: "city-guardians",
    title: "Şehrin Koruyucuları Koleksiyonu",
    description: "Şehri koruyan üç ikonik kahraman tek bir koleksiyonda. Etkileyici bir galeri duvarı oluşturmak için ideal.",
    products: ["dark-knight", "speedster", "warrior-queen"],
    bundlePrice: BUNDLE_PRICES,
  },
  {
    id: "avenger-series",
    slug: "avenger-series",
    title: "İntikamcılar Serisi Koleksiyonu",
    description: "Dünyanın en güçlü kahramanları bir araya geldi. Birlikte sergilenmesi gereken üç güçlü poster.",
    products: ["iron-titan", "thunder-god", "web-slinger"],
    bundlePrice: BUNDLE_PRICES,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getCollectionProducts(collectionId: string) {
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return [];
  return col.products.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
}
