import type { Product, ProductCategory } from "@/data/products";

/*
 * Catalog structure and filtering, without the product list itself, so client components can use it
 * without shipping every product to the browser. Product lookups live in ./catalog.ts.
 */

export type Family = {
  slug: string;
  label: string;
  categories: ProductCategory[];
  /** Professional machines (inquiry only) or products sold online. */
  ordering: "inquiry" | "online";
};

/** Can be added to the cart and bought online (otherwise: inquiry only). */
export const sellsOnline = (product: Pick<Product, "ordering">) => product.ordering === "online";

const single = (label: ProductCategory): Family => ({
  slug: slugify(label),
  label,
  categories: [label],
  ordering: "online",
});

/** The catalog's top-level ranges, in display order: professional machines, then the online shop. */
export const families: Family[] = [
  {
    slug: "laser-light",
    label: "Laser & Light",
    categories: ["Diode Laser", "Picosecond Laser", "ND YAG Laser", "Q Switch Laser", "CO2 Laser", "IPL Machine"],
    ordering: "inquiry",
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
    ordering: "inquiry",
  },
  single("Facial & Skin Machines"),
  single("Microneedling Pens & Rollers"),
  single("Microneedling Cartridges & Needles"),
  single("Skin-care Consumables"),
  single("PMU & Microblading"),
  single("Salon Furniture"),
  single("Massagers"),
  single("Physiotherapy & Home Health"),
  single("Pain-relief Oils"),
];

/** Friendlier filter labels where the raw category reads oddly on its own. */
const categoryLabels: Partial<Record<ProductCategory, string>> = {
  "Q Switch Laser": "Q-Switch Laser",
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const categoryLabel = (category: ProductCategory) => categoryLabels[category] ?? category;

export const categorySlug = (category: ProductCategory) => slugify(category);

export function familyOf(category: ProductCategory): Family {
  const family = families.find((f) => f.categories.includes(category));
  if (!family) throw new Error(`No family for category "${category}"`);
  return family;
}

/** Wavelength specs read as numbers in nm; the rest describe the technology. */
export const specLabel = (spec: string) => (/\d\s*nm/i.test(spec) ? "Wavelength" : "Technology");

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

export function matchesFilter(product: Pick<Product, "category">, filter: CatalogFilter) {
  if (filter.kind === "all") return true;
  if (filter.kind === "family") return filter.family.categories.includes(product.category);
  return product.category === filter.category;
}

export function matchesQuery(product: Pick<Product, "name" | "model" | "category" | "spec" | "features">, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = [product.name, product.model, product.category, product.spec, ...product.features]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => haystack.includes(t));
}
