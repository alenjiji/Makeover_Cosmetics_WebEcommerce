import { products, type Product } from "@/data/products";
import { familyOf, sellsOnline } from "./catalog-filters";

export * from "./catalog-filters";

// Slugs back the /products/[slug] routes (and Shopify handles), so fail the build on a duplicate.
const duplicate = products.find((p, i) => products.findIndex((q) => q.slug === p.slug) !== i);
if (duplicate) throw new Error(`Duplicate product slug "${duplicate.slug}"`);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Same category first, then the rest of the family, then anything else. */
export function relatedProducts(product: Product, limit = 3, pool: Product[] = products): Product[] {
  const family = familyOf(product.category);
  const rank = (p: Product) =>
    p.category === product.category ? 0 : family.categories.includes(p.category) ? 1 : 2;
  return pool
    .filter((p) => p.slug !== product.slug)
    .map((p, index) => ({ p, index }))
    .sort((a, b) => rank(a.p) - rank(b.p) || a.index - b.index)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function adjacentProducts(product: Product, pool: Product[] = products) {
  const index = pool.findIndex((p) => p.slug === product.slug);
  return {
    previous: index > 0 ? pool[index - 1] : undefined,
    next: index >= 0 && index < pool.length - 1 ? pool[index + 1] : undefined,
  };
}

export const productTitle = (product: Pick<Product, "name" | "model">) =>
  product.model ? `${product.name} (${product.model})` : product.name;

export function productDescription(product: Product) {
  const base = `${productTitle(product)}: ${product.category}, ${product.spec}. ${product.features.join(". ")}.`;
  // Certification claims cover the professional machines only.
  return sellsOnline(product) ? base : `${base} ISO certified and CE approved.`;
}

/** The fields the catalog page needs for its cards, filters and search (kept small for the browser). */
export type CatalogItem = Pick<
  Product,
  "slug" | "name" | "model" | "category" | "spec" | "image" | "alt" | "features" | "isNew" | "ordering"
>;

export const toCatalogItem = ({ slug, name, model, category, spec, image, alt, features, isNew, ordering }: Product): CatalogItem => ({
  slug,
  name,
  model,
  category,
  spec,
  image,
  alt,
  features,
  isNew,
  ordering,
});
