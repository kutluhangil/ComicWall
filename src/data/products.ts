import posterDarkKnight from "@/assets/posters/poster-dark-knight.jpg";
import posterCosmicHero from "@/assets/posters/poster-cosmic-hero.jpg";
import posterSpeedster from "@/assets/posters/poster-speedster.jpg";
import posterWarriorQueen from "@/assets/posters/poster-warrior-queen.jpg";
import posterIronTitan from "@/assets/posters/poster-iron-titan.jpg";
import posterEmeraldGuardian from "@/assets/posters/poster-emerald-guardian.jpg";
import posterThunderGod from "@/assets/posters/poster-thunder-god.jpg";
import posterWebSlinger from "@/assets/posters/poster-web-slinger.jpg";

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

export const products: Product[] = [
  {
    id: "dark-knight",
    slug: "dark-knight",
    title: "The Dark Knight",
    description: "A brooding vigilante stands watch over a rain-soaked city, lightning cracking the sky. This noir-inspired poster captures the essence of justice in the shadows.",
    image: posterDarkKnight,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "DC Inspired",
    badge: "Best Seller",
    collectionId: "city-guardians",
  },
  {
    id: "cosmic-hero",
    slug: "cosmic-hero",
    title: "Cosmic Sentinel",
    description: "Floating in the vastness of space, this cosmic-powered hero channels the energy of nebulae through their hands. A stunning piece for any sci-fi art collector.",
    image: posterCosmicHero,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "Cosmic",
  },
  {
    id: "speedster",
    slug: "speedster",
    title: "Crimson Speedster",
    description: "Lightning trails blaze through the city streets as the fastest hero alive races against time. Dynamic motion and energy captured in a single frame.",
    image: posterSpeedster,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "DC Inspired",
    collectionId: "city-guardians",
  },
  {
    id: "warrior-queen",
    slug: "warrior-queen",
    title: "Warrior Queen",
    description: "An empowering silhouette against a golden sunset sky. Ancient armor meets divine power in this striking tribute to the ultimate warrior princess.",
    image: posterWarriorQueen,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "DC Inspired",
    badge: "New",
    collectionId: "city-guardians",
  },
  {
    id: "iron-titan",
    slug: "iron-titan",
    title: "Iron Titan",
    description: "Glowing arc reactor, red and gold armor, industrial backdrop. The genius billionaire's alter ego rendered in full cinematic glory.",
    image: posterIronTitan,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "Marvel Inspired",
    collectionId: "avenger-series",
  },
  {
    id: "emerald-guardian",
    slug: "emerald-guardian",
    title: "Emerald Guardian",
    description: "Willpower made manifest. A ring-wielding hero constructs weapons of pure green energy against a cosmic backdrop of alien worlds.",
    image: posterEmeraldGuardian,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "Cosmic",
  },
  {
    id: "thunder-god",
    slug: "thunder-god",
    title: "Thunder God",
    description: "Norse mythology meets superhero cinema. A mighty hammer raised to the storm-torn sky, lightning answering the call of the god of thunder.",
    image: posterThunderGod,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "Marvel Inspired",
    badge: "Popular",
    collectionId: "avenger-series",
  },
  {
    id: "web-slinger",
    slug: "web-slinger",
    title: "Web Slinger",
    description: "Swinging between skyscrapers at golden hour, the friendly neighborhood hero defies gravity with acrobatic grace. Pure action energy on your wall.",
    image: posterWebSlinger,
    prices: { "10x15": 12.99, "13x18": 18.99, "20x30": 29.99 },
    category: "Marvel Inspired",
    collectionId: "avenger-series",
  },
];

export const collections: Collection[] = [
  {
    id: "city-guardians",
    slug: "city-guardians",
    title: "City Guardians Collection",
    description: "Three iconic city-protecting heroes united in one collection. Perfect for creating a dramatic gallery wall.",
    products: ["dark-knight", "speedster", "warrior-queen"],
    bundlePrice: { "10x15": 29.99, "13x18": 44.99, "20x30": 69.99 },
  },
  {
    id: "avenger-series",
    slug: "avenger-series",
    title: "Avenger Series Collection",
    description: "Earth's mightiest heroes assembled. Three powerful posters that belong together.",
    products: ["iron-titan", "thunder-god", "web-slinger"],
    bundlePrice: { "10x15": 29.99, "13x18": 44.99, "20x30": 69.99 },
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
