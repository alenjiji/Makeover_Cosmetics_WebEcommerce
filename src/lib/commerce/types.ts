/** Shared between the server (Shopify) and the client cart. */

export type Money = { amount: string; currencyCode: string };

export type CartLine = {
  /** Shopify cart line id, or the product slug for the local cart. */
  id: string;
  /** Product slug, which is also its Shopify handle. */
  slug: string;
  quantity: number;
  title: string;
  image?: string;
  /** Unit price (Shopify mode only). */
  price?: Money;
  /** Line total (Shopify mode only). */
  total?: Money;
};

export type Cart = {
  /** "shopify": Shopify cart with hosted checkout. "local": browser cart, ordered via /checkout. */
  mode: "shopify" | "local";
  id?: string;
  checkoutUrl?: string;
  lines: CartLine[];
  totalQuantity: number;
  subtotal?: Money;
  /** Order note passed to Shopify checkout (Shopify mode only). */
  note?: string;
};

export type CartResult = { ok: true; cart: Cart } | { ok: false; error: string; cart?: Cart };

export type PriceInfo = {
  price: Money;
  available: boolean;
  /** Priced above zero and for sale: can go through checkout. Otherwise it's "Ask for Price". */
  purchasable: boolean;
};

export type PriceMap = Record<string, PriceInfo>;

/** Shown wherever a price belongs until the product is priced in Shopify. */
export const PRICE_PLACEHOLDER = "₹ N.A";

export function formatMoney(money: Money) {
  const amount = Number(money.amount);
  return new Intl.NumberFormat(money.currencyCode === "INR" ? "en-IN" : "en", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** The product's price, or the placeholder when it isn't priced (or can't be bought) yet. */
export function priceLabel(info?: PriceInfo) {
  return info?.purchasable ? formatMoney(info.price) : PRICE_PLACEHOLDER;
}
