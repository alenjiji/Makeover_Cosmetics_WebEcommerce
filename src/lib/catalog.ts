import { products, type Product, type ProductCategory } from "@/data/products";

// Slugs back the /products/[slug] routes, so fail the build on a duplicate.
const duplicate = products.find((p, i) => products.findIndex((q) => q.slug === p.slug) !== i);
if (duplicate) throw new Error(`Duplicate product slug "${duplicate.slug}"`);

export type Family = {
  slug: string;
  label: string;
  categories: ProductCategory[];
};

/** Groups the 16 legacy categories into three browsable ranges. */
export const families: Family[] = [
  {
    slug: "laser-light",
    label: "Laser & Light",
    categories: [
      "Diode Laser",
      "Picosecond Laser",
      "ND YAG Laser",
      "Q Switch Laser",
      "CO2 Laser",
      "IPL Machine",
    ],
  },
  {
    slug: "body-skin",
    label: "Body & Skin",
    categories: [
      "HIFU Machine",
      "RF Microneedling",
      "Cold Plasma",
      "EMS Machine",
      "Slimming Machine",
      "LED Machine",
      "Cooling System",
      "Hydra Facial",
    ],
  },
  {
    slug: "dental",
    label: "Dental",
    categories: ["Dental Chair", "High Speed", "Low Speed", "Surgical"],
  },
];

/** Friendlier filter labels where the raw category reads oddly on its own. */
const categoryLabels: Partial<Record<ProductCategory, string>> = {
  "High Speed": "High-Speed Handpieces",
  "Low Speed": "Low-Speed Handpieces",
  Surgical: "Surgical Handpieces",
  "Q Switch Laser": "Q-Switch Laser",
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const categoryLabel = (category: ProductCategory) =>
  categoryLabels[category] ?? category;

export const categorySlug = (category: ProductCategory) => slugify(category);

export function familyOf(category: ProductCategory): Family {
  const family = families.find((f) => f.categories.includes(category));
  if (!family) throw new Error(`No family for category "${category}"`);
  return family;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Same category first, then the rest of the family, then anything else. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  const family = familyOf(product.category);
  const rank = (p: Product) =>
    p.category === product.category ? 0 : family.categories.includes(p.category) ? 1 : 2;
  return products
    .filter((p) => p.slug !== product.slug)
    .map((p, index) => ({ p, index }))
    .sort((a, b) => rank(a.p) - rank(b.p) || a.index - b.index)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function adjacentProducts(product: Product) {
  const index = products.findIndex((p) => p.slug === product.slug);
  return {
    previous: index > 0 ? products[index - 1] : undefined,
    next: index < products.length - 1 ? products[index + 1] : undefined,
  };
}

/** Wavelength specs read as numbers in nm; the rest describe the technology. */
export const specLabel = (spec: string) => (/\d\s*nm/i.test(spec) ? "Wavelength" : "Technology");

export const productTitle = (product: Product) =>
  product.model ? `${product.name} (${product.model})` : product.name;

export function productDescription(product: Product) {
  return `${productTitle(product)}: ${product.category} equipment, ${product.spec}. ${product.features.join(". ")}. ISO certified and CE approved.`;
}

export type CatalogFilter =
  | { kind: "all" }
  | { kind: "family"; family: Family }
  | { kind: "category"; family: Family; category: ProductCategory };

/** Resolves a `?category=` value, which may name a family or a single category. */
export function resolveFilter(value: string | null): CatalogFilter {
  if (!value) return { kind: "all" };
  const family = families.find((f) => f.slug === value);
  if (family) return { kind: "family", family };
  for (const f of families) {
    const category = f.categories.find((c) => categorySlug(c) === value);
    if (category) return { kind: "category", family: f, category };
  }
  return { kind: "all" };
}

export function matchesFilter(product: Product, filter: CatalogFilter) {
  if (filter.kind === "all") return true;
  if (filter.kind === "family") return filter.family.categories.includes(product.category);
  return product.category === filter.category;
}

export function matchesQuery(product: Product, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = [product.name, product.model, product.category, product.spec, ...product.features]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => haystack.includes(t));
}
