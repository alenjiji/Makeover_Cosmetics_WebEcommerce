import type { Cart, CartLine } from "./types";

/**
 * Cart used until Shopify is connected: lines are kept in the browser as slug + quantity, with the
 * title and photo captured when the item was added (so the whole catalog never ships to the browser).
 * Orders go through /checkout as order requests, where the server re-checks every slug.
 */
export type StoredLine = { slug: string; quantity: number; title?: string; image?: string };

export function localCart(stored: StoredLine[]): Cart {
  const lines: CartLine[] = stored
    .filter((l) => l.quantity > 0)
    .map(({ slug, quantity, title, image }) => ({ id: slug, slug, quantity, title: title ?? slug, image }));
  return { mode: "local", lines, totalQuantity: lines.reduce((n, l) => n + l.quantity, 0) };
}
