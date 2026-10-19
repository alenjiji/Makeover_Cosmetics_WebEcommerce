import { products } from "@/data/products";
import { productTitle } from "@/lib/catalog";
import type { Cart, CartLine } from "./types";

/**
 * Cart used until Shopify is connected: lines are kept in the browser as slug + quantity
 * and described from the local catalog. Orders go through /checkout as order requests.
 */
export type StoredLine = { slug: string; quantity: number };

export function localCart(stored: StoredLine[]): Cart {
  const lines: CartLine[] = stored.flatMap(({ slug, quantity }) => {
    const product = products.find((p) => p.slug === slug);
    return product && quantity > 0
      ? [{ id: slug, slug, quantity, title: productTitle(product), image: product.image }]
      : [];
  });
  return { mode: "local", lines, totalQuantity: lines.reduce((n, l) => n + l.quantity, 0) };
}
