import type { Brand, Product } from "./types";
import { formatPriceCompact } from "./format";

/**
 * ---------------------------------------------------------------------------
 * SEED CATALOGUE
 * ---------------------------------------------------------------------------
 * This is placeholder data so the site looks and behaves complete on day one.
 * Replace the arrays below with your real brands and products — keep the same
 * shape (see `lib/types.ts`) and every page, filter and checkout path keeps
 * working untouched.
 *
 * Product photos live in `public/images/products/<slug>.jpg`. To use your own
 * photography, drop files into that folder using the product slug as the file
 * name and the rest of the app picks them up automatically.
 * ---------------------------------------------------------------------------
 */

export const brands: Brand[] = [
  {
    slug: "maison-lumiere",
    name: "Maison Lumière",
    tagline: "Light, bottled",
    origin: "Grasse, France",
    founded: 2011,
    excerpt:
      "Sunlit florals and golden amber built around a single idea: a fragrance should glow on skin.",
    story:
      "Founded in Grasse by third-generation perfumer Élise Marchand, Maison Lumière builds every composition around light — the way bergamot catches a morning window, the way amber warms as the day turns. The house works exclusively in small batches, macerating each concentrate for a minimum of eight weeks before it is bottled.",
    accent: "#dfc678",
  },
  {
    slug: "oud-and-ember",
    name: "Oud & Ember",
    tagline: "Fire, resin, smoke",
    origin: "Dubai, UAE",
    founded: 2016,
    excerpt:
      "For collectors. Deep agarwood, scorched leather and resins that last long into the night.",
    story:
      "Oud & Ember was built for people who wear fragrance like armour. The house sources aged agarwood from Assam and pairs it with smoked resins, saffron and leather — compositions that unfold slowly and hold their shape for twelve hours or more. Every flacon is numbered.",
    accent: "#c96f3a",
  },
  {
    slug: "fleur-sauvage",
    name: "Fleur Sauvage",
    tagline: "Flowers, untamed",
    origin: "Paris, France",
    founded: 2019,
    excerpt:
      "White florals with a wild streak — tuberose, jasmine sambac and a warm skin finish.",
    story:
      "Fleur Sauvage takes the classic French floral and lets it run free. No powdery restraint, no nostalgia: just jasmine sambac picked at dusk, tuberose at its most narcotic, and a drydown that settles into warm skin rather than soap.",
    accent: "#e08fa8",
  },
  {
    slug: "azur-blu",
    name: "Azur Blu",
    tagline: "Salt air, every day",
    origin: "Capri, Italy",
    founded: 2018,
    excerpt:
      "Mediterranean freshness at an easy price. Sea salt, citrus and clean cedar for daily wear.",
    story:
      "Azur Blu began as a single summer scent made for a friend's wedding in Capri and never stopped being requested. The house now produces a tight range of bright, unfussy fragrances designed to be worn generously, every single day.",
    accent: "#6fb0c9",
  },
  {
    slug: "sable-dore",
    name: "Sable Doré",
    tagline: "Golden hour, held still",
    origin: "Marrakech, Morocco",
    founded: 2014,
    excerpt:
      "Warm amber, praline and vanilla — comfort wrapped in something undeniably luxurious.",
    story:
      "Sable Doré translates the last hour of desert light into scent: warm sand, toasted sugar, resins softening in the heat. The house's gourmands are deliberately grown-up — sweet, yes, but always cut with woods and spice so they never tip into candy.",
    accent: "#d0ac4c",
  },
];

export const products: Product[] = [
  {
    slug: "lumiere-d-or",
    name: "Lumière d'Or",
    brandSlug: "maison-lumiere",
    price: 78000,
    compareAtPrice: 88000,
    sizeMl: 100,
    concentration: "Eau de Parfum",
    audience: "Women",
    families: ["Floral", "Oriental"],
    topNotes: ["Sicilian bergamot", "Pink pepper", "Mandarin"],
    heartNotes: ["Orange blossom", "Jasmine", "Ylang-ylang"],
    baseNotes: ["Golden amber", "Benzoin", "Sandalwood"],
    summary:
      "Radiant orange blossom over molten amber — the signature the house is known for.",
    description:
      "Lumière d'Or opens on a rush of Sicilian bergamot before settling into a heart of orange blossom and jasmine picked at dawn. As it warms, golden amber and benzoin rise through the base, leaving a soft halo that lasts well past sunset. It is the most awarded fragrance in the Maison Lumière range, and the one we recommend to anyone meeting the house for the first time.",
    longevity: "8–10 hours",
    sillage: "Moderate to strong",
    season: "Autumn, Winter, Evening",
    rating: 4.8,
    reviewCount: 124,
    stock: 14,
    featured: true,
    badge: "Bestseller",
    image: "/images/products/lumiere-d-or.jpg",
  },
  {
    slug: "rosee-nocturne",
    name: "Rosée Nocturne",
    brandSlug: "maison-lumiere",
    price: 48500,
    sizeMl: 50,
    concentration: "Eau de Parfum",
    audience: "Women",
    families: ["Floral"],
    topNotes: ["Dewberry", "Lychee", "Violet leaf"],
    heartNotes: ["Rose de Mai", "Peony", "Magnolia"],
    baseNotes: ["White musk", "Cashmere wood", "Orris"],
    summary: "A dewy rose softened with white musk — quiet, clean, quietly addictive.",
    description:
      "Inspired by a garden at four in the morning, Rosée Nocturne pairs Rose de Mai absolute with the green crush of violet leaf. Lychee keeps the opening bright while orris and cashmere wood give the drydown a powdery, skin-like finish. Understated enough for the office, memorable enough for dinner.",
    longevity: "6–8 hours",
    sillage: "Moderate",
    season: "Spring, Summer",
    rating: 4.6,
    reviewCount: 68,
    stock: 21,
    featured: true,
    badge: "House favourite",
    image: "/images/products/rosee-nocturne.jpg",
  },
  {
    slug: "ember-oud",
    name: "Ember Oud",
    brandSlug: "oud-and-ember",
    price: 215000,
    sizeMl: 100,
    concentration: "Extrait de Parfum",
    audience: "Unisex",
    families: ["Oriental", "Woody"],
    topNotes: ["Saffron", "Pink pepper", "Cardamom"],
    heartNotes: ["Assam agarwood", "Rose absolute", "Incense"],
    baseNotes: ["Smoked leather", "Labdanum", "Ambergris"],
    summary:
      "Aged Assam oud, saffron and smoked leather at extrait strength. The most powerful thing on this shelf.",
    description:
      "Ember Oud is a statement. Twenty-eight percent concentration of aged Assam agarwood, wrapped in saffron and incense, drying down to smoked leather and ambergris that clings to fabric for days. Two sprays is the correct dose. Each numbered flacon is macerated for sixteen weeks before release.",
    longevity: "12–14 hours",
    sillage: "Very strong",
    season: "Winter, Evening, Occasion",
    rating: 4.9,
    reviewCount: 91,
    stock: 6,
    featured: true,
    badge: "Last few",
    image: "/images/products/ember-oud.jpg",
  },
  {
    slug: "midnight-resin",
    name: "Midnight Resin",
    brandSlug: "oud-and-ember",
    price: 128000,
    sizeMl: 75,
    concentration: "Eau de Parfum",
    audience: "Men",
    families: ["Oriental", "Woody"],
    topNotes: ["Black pepper", "Grapefruit peel", "Elemi"],
    heartNotes: ["Labdanum", "Frankincense", "Cypress"],
    baseNotes: ["Vetiver", "Guaiac wood", "Tonka"],
    summary: "Church incense and cold stone at midnight — resinous, mineral, impeccable.",
    description:
      "Midnight Resin takes the smoke of Ember Oud and cools it down. Frankincense and labdanum sit over a mineral vetiver base, with a crack of black pepper at the top that never fully disappears. It reads formal without feeling old, and it is the easiest way into the house's heavier work.",
    longevity: "9–11 hours",
    sillage: "Strong",
    season: "Autumn, Winter, Evening",
    rating: 4.7,
    reviewCount: 54,
    stock: 11,
    featured: false,
    image: "/images/products/midnight-resin.jpg",
  },
  {
    slug: "fleur-sauvage",
    name: "Fleur Sauvage",
    brandSlug: "fleur-sauvage",
    price: 92000,
    sizeMl: 100,
    concentration: "Eau de Parfum",
    audience: "Women",
    families: ["Floral"],
    topNotes: ["Green mandarin", "Neroli", "Wild berries"],
    heartNotes: ["Jasmine sambac", "Tuberose", "Vanilla orchid"],
    baseNotes: ["Sandalwood", "Musk", "Tonka bean"],
    summary:
      "Narcotic tuberose and jasmine sambac with a creamy vanilla-orchid undertow.",
    description:
      "The fragrance the house is named for. Fleur Sauvage opens green and slightly wild before the tuberose takes over — big, creamy, unrepentant. Jasmine sambac picked at dusk gives it a narcotic edge, and the vanilla orchid in the base keeps everything from tipping into soap. One of the most complimented scents we stock.",
    longevity: "9–11 hours",
    sillage: "Strong",
    season: "Evening, Occasion, Winter",
    rating: 4.8,
    reviewCount: 143,
    stock: 9,
    featured: true,
    badge: "Bestseller",
    image: "/images/products/fleur-sauvage.jpg",
  },
  {
    slug: "peau-de-fleur",
    name: "Peau de Fleur",
    brandSlug: "fleur-sauvage",
    price: 56000,
    compareAtPrice: 64000,
    sizeMl: 50,
    concentration: "Eau de Parfum",
    audience: "Women",
    families: ["Floral", "Fruity"],
    topNotes: ["White peach", "Osmanthus", "Bergamot"],
    heartNotes: ["Peony", "Freesia", "Apricot skin"],
    baseNotes: ["Blond woods", "Soft musk", "Ambrette"],
    summary: "Flowers worn close to the skin — peach, peony and blond woods.",
    description:
      "Where Fleur Sauvage shouts, Peau de Fleur murmurs. White peach and osmanthus give the opening a suede-soft fruit note, peony and freesia bloom briefly, and then it settles into blond woods and ambrette — a clean, second-skin musk that people will lean in to ask about.",
    longevity: "6–8 hours",
    sillage: "Intimate to moderate",
    season: "Spring, Summer, Office",
    rating: 4.5,
    reviewCount: 47,
    stock: 18,
    featured: false,
    badge: "New",
    image: "/images/products/peau-de-fleur.jpg",
  },
  {
    slug: "azur-blu",
    name: "Azur Blu",
    brandSlug: "azur-blu",
    price: 32000,
    sizeMl: 100,
    concentration: "Eau de Toilette",
    audience: "Men",
    families: ["Fresh"],
    topNotes: ["Sea salt", "Grapefruit", "Mint"],
    heartNotes: ["Neroli", "Rosemary", "Juniper"],
    baseNotes: ["Driftwood", "Cedar", "White musk"],
    summary:
      "Salt air, cold grapefruit and driftwood. The easiest everyday fragrance we sell.",
    description:
      "Azur Blu is the bottle we hand to anyone who says they don't like perfume. Grapefruit and sea salt hit first, an aromatic neroli and rosemary heart keeps it clean, and driftwood anchors the drydown without turning heavy. Generous, unfussy, and genuinely wearable in Lagos heat.",
    longevity: "5–7 hours",
    sillage: "Moderate",
    season: "Summer, Everyday, Gym",
    rating: 4.6,
    reviewCount: 210,
    stock: 32,
    featured: true,
    badge: "Bestseller",
    image: "/images/products/azur-blu.jpg",
  },
  {
    slug: "brise-marine",
    name: "Brise Marine",
    brandSlug: "azur-blu",
    price: 21500,
    sizeMl: 50,
    concentration: "Eau de Toilette",
    audience: "Unisex",
    families: ["Fresh", "Fruity"],
    topNotes: ["Spearmint", "Lemon zest", "Sea breeze accord"],
    heartNotes: ["Neroli", "Green tea", "Jasmine"],
    baseNotes: ["Cedar", "Amber", "Musk"],
    summary:
      "A cold green blast of mint and lemon — the most affordable way into the collection.",
    description:
      "Brise Marine is a summer reset button. Spearmint and lemon zest over a green tea and neroli heart, with just enough cedar to keep it standing up. Keep it in the fridge and it becomes the best thing about a hot afternoon.",
    longevity: "4–6 hours",
    sillage: "Light to moderate",
    season: "Summer, Everyday",
    rating: 4.3,
    reviewCount: 96,
    stock: 40,
    featured: false,
    image: "/images/products/brise-marine.jpg",
  },
  {
    slug: "sable-dore",
    name: "Sable Doré",
    brandSlug: "sable-dore",
    price: 105000,
    sizeMl: 100,
    concentration: "Eau de Parfum",
    audience: "Unisex",
    families: ["Gourmand", "Oriental"],
    topNotes: ["Praline", "Pink pepper", "Coriander"],
    heartNotes: ["Tonka bean", "Orange blossom", "Cinnamon"],
    baseNotes: ["Sandalwood", "Amber", "Vanilla"],
    summary: "Toasted praline and tonka over warm sandalwood — the golden hour, bottled.",
    description:
      "Sable Doré is what the house calls an adult gourmand: praline and tonka bean warmed with cinnamon, then pulled back into balance by dry sandalwood and amber. Sweet, yes — but structured, and it projects beautifully in the evening. Equally good on any skin.",
    longevity: "9–12 hours",
    sillage: "Strong",
    season: "Autumn, Winter, Evening",
    rating: 4.8,
    reviewCount: 132,
    stock: 13,
    featured: true,
    badge: "House favourite",
    image: "/images/products/sable-dore.jpg",
  },
  {
    slug: "vanille-noire",
    name: "Vanille Noire",
    brandSlug: "sable-dore",
    price: 86000,
    sizeMl: 50,
    concentration: "Extrait de Parfum",
    audience: "Women",
    families: ["Gourmand", "Oriental"],
    topNotes: ["Madagascan vanilla", "Bitter cocoa", "Rum"],
    heartNotes: ["Benzoin", "Tobacco leaf", "Plum"],
    baseNotes: ["Guaiac wood", "Labdanum", "Musk"],
    summary: "Dark vanilla at extrait strength — cocoa, rum and tobacco leaf, no sugar rush.",
    description:
      "Forget everything you think you know about vanilla. Vanille Noire macerates Madagascan pods with bitter cocoa and a splash of rum, then deepens the whole thing with tobacco leaf and guaiac wood. At extrait strength it is dense, dark and genuinely sophisticated — a cold-weather signature.",
    longevity: "10–12 hours",
    sillage: "Strong",
    season: "Winter, Evening",
    rating: 4.7,
    reviewCount: 78,
    stock: 8,
    featured: true,
    badge: "Last few",
    image: "/images/products/vanille-noire.jpg",
  },
];

/* ------------------------------------------------------------------ */
/* Query helpers                                                       */
/* ------------------------------------------------------------------ */

export function getAllProducts(): Product[] {
  return products;
}

export function getAllBrands(): Brand[] {
  return brands;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((brand) => brand.slug === slug);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((product) => product.brandSlug === brandSlug);
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featured = products.filter((product) => product.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameBrand = products.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.brandSlug === product.brandSlug,
  );
  const sharedFamily = products.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.brandSlug !== product.brandSlug &&
      candidate.families.some((family) => product.families.includes(family)),
  );
  const priceProximity = [...products]
    .filter(
      (candidate) =>
        candidate.slug !== product.slug &&
        candidate.brandSlug !== product.brandSlug &&
        !candidate.families.some((family) => product.families.includes(family)),
    )
    .sort(
      (a, b) =>
        Math.abs(a.price - product.price) - Math.abs(b.price - product.price),
    );

  return [...sameBrand, ...sharedFamily, ...priceProximity].slice(0, limit);
}

/** Lowest and highest prices in the catalogue — used to seed the price filter. */
export function getPriceBounds(): { min: number; max: number } {
  const prices = products.map((product) => product.price);
  return {
    min: Math.floor(Math.min(...prices) / 1000) * 1000,
    max: Math.ceil(Math.max(...prices) / 1000) * 1000,
  };
}

export function countProductsByBrand(brandSlug: string): number {
  return products.filter((product) => product.brandSlug === brandSlug).length;
}

export function getBrandPriceRange(brandSlug: string): string {
  const prices = getProductsByBrand(brandSlug).map((product) => product.price);
  if (prices.length === 0) return "—";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? formatPriceCompact(min)
    : `${formatPriceCompact(min)} – ${formatPriceCompact(max)}`;
}

export function formatNotes(notes: string[]): string {
  if (notes.length === 0) return "";
  if (notes.length === 1) return notes[0];
  return `${notes.slice(0, -1).join(", ")} and ${notes[notes.length - 1]}`;
}
