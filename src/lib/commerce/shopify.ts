import { cacheLife, cacheTag } from "next/cache";
import type { Cart, Money, PriceMap } from "./types";

/**
 * Shopify Storefront API client (server only). Enabled when SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN are set; until then the cart is kept in the browser and
 * orders go through /checkout as order requests.
 * Products are matched by handle = product slug. See docs/SHOPIFY.md.
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? "2025-07";
/** Market whose prices and currency the site shows (ISO country code). */
const country = (process.env.SHOPIFY_COUNTRY ?? "IN").toUpperCase();

export const shopifyEnabled = Boolean(domain && token);

/** Customer accounts (order history, addresses). Shopify redirects /account to its account pages. */
export const shopifyAccountUrl = shopifyEnabled
  ? (process.env.SHOPIFY_ACCOUNT_URL ?? `https://${domain}/account`)
  : undefined;

/** Cache tags, revalidated by the Shopify webhook route (app/api/shopify/webhook). */
export const TAGS = { prices: "shopify-prices", policies: "shopify-policies" } as const;

export class ShopifyError extends Error {}

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!shopifyEnabled) throw new ShopifyError("Shopify is not configured.");
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Public Storefront tokens use the first header; private (shpat_) tokens the second.
      ...(token!.startsWith("shpat_")
        ? { "Shopify-Storefront-Private-Token": token! }
        : { "X-Shopify-Storefront-Access-Token": token! }),
    },
    // Queries that declare $country get the site's market (via @inContext).
    body: JSON.stringify({ query, variables: query.includes("$country") ? { country, ...variables } : variables }),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { data?: T; errors?: { message: string }[] };
  if (!res.ok || body.errors?.length) {
    throw new ShopifyError(body.errors?.map((e) => e.message).join("; ") ?? `Shopify responded ${res.status}`);
  }
  return body.data as T;
}

const cartFields = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    note
    cost {
      subtotalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              price { amount currencyCode }
              product { handle title featuredImage { url } }
            }
          }
        }
      }
    }
  }
`;

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  note: string | null;
  cost: { subtotalAmount: Money };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: { totalAmount: Money };
        merchandise: { price: Money; product: { handle: string; title: string; featuredImage: { url: string } | null } };
      };
    }[];
  };
};

type CartPayload = { cart: ShopifyCart | null; userErrors: { message: string }[] };

function normalize(cart: ShopifyCart): Cart {
  return {
    mode: "shopify",
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    note: cart.note ?? undefined,
    lines: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      slug: node.merchandise.product.handle,
      quantity: node.quantity,
      title: node.merchandise.product.title,
      image: node.merchandise.product.featuredImage?.url,
      price: node.merchandise.price,
      total: node.cost.totalAmount,
    })),
  };
}

function check(payload: CartPayload) {
  if (payload.userErrors.length) throw new ShopifyError(payload.userErrors.map((e) => e.message).join("; "));
  if (!payload.cart) throw new ShopifyError("Shopify returned no cart.");
  return normalize(payload.cart);
}

/** Returns null for carts that expired or were checked out (Shopify stops returning them). */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(
    `query getCart($cartId: ID!, $country: CountryCode) @inContext(country: $country) {
      cart(id: $cartId) { ...CartFields }
    } ${cartFields}`,
    { cartId },
  );
  return data.cart ? normalize(data.cart) : null;
}

/**
 * The first variant of the product with this handle (the catalog has one variant per
 * product). Unpriced (₹0) products are refused, so nothing can be checked out for free.
 */
async function variantFor(handle: string) {
  const data = await shopifyFetch<{
    product: {
      variants: { edges: { node: { id: string; availableForSale: boolean; price: Money } }[] };
    } | null;
  }>(
    `query variant($handle: String!, $country: CountryCode) @inContext(country: $country) {
      product(handle: $handle) { variants(first: 1) { edges { node { id availableForSale price { amount currencyCode } } } } }
    }`,
    { handle },
  );
  const variant = data.product?.variants.edges[0]?.node;
  if (!variant) throw new ShopifyError("This product isn't available to order online yet. Please send an inquiry.");
  if (Number(variant.price.amount) <= 0) throw new ShopifyError("Price on request: please send an inquiry for this product.");
  if (!variant.availableForSale) throw new ShopifyError("This product is currently unavailable. Please send an inquiry.");
  return variant.id;
}

const cartMutation = (name: string, signature: string, call: string) => /* GraphQL */ `
  mutation ${name}(${signature}, $country: CountryCode) @inContext(country: $country) {
    ${call} { cart { ...CartFields } userErrors { message } }
  } ${cartFields}`;

export async function addToCart(cartId: string | null, handle: string, quantity: number): Promise<Cart> {
  const lines = [{ merchandiseId: await variantFor(handle), quantity }];
  if (cartId) {
    const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>(
      cartMutation("add", "$cartId: ID!, $lines: [CartLineInput!]!", "cartLinesAdd(cartId: $cartId, lines: $lines)"),
      { cartId, lines },
    );
    return check(data.cartLinesAdd);
  }
  // New carts carry the market, so checkout opens in the right currency and country.
  const data = await shopifyFetch<{ cartCreate: CartPayload }>(
    cartMutation(
      "create",
      "$lines: [CartLineInput!], $buyer: CartBuyerIdentityInput",
      "cartCreate(input: { lines: $lines, buyerIdentity: $buyer, attributes: [{ key: \"source\", value: \"website\" }] })",
    ),
    { lines, buyer: { countryCode: country } },
  );
  return check(data.cartCreate);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  if (quantity <= 0) return removeCartLine(cartId, lineId);
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>(
    cartMutation("update", "$cartId: ID!, $lines: [CartLineUpdateInput!]!", "cartLinesUpdate(cartId: $cartId, lines: $lines)"),
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  return check(data.cartLinesUpdate);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>(
    cartMutation("remove", "$cartId: ID!, $lineIds: [ID!]!", "cartLinesRemove(cartId: $cartId, lineIds: $lineIds)"),
    { cartId, lineIds: [lineId] },
  );
  return check(data.cartLinesRemove);
}

/** Order note shown to staff on the order (voltage, plug type, delivery details…). */
export async function setCartNote(cartId: string, note: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartNoteUpdate: CartPayload }>(
    cartMutation("note", "$cartId: ID!, $note: String!", "cartNoteUpdate(cartId: $cartId, note: $note)"),
    { cartId, note },
  );
  return check(data.cartNoteUpdate);
}

/**
 * Prices and availability for every product, keyed by handle. Cached for an hour and
 * refreshed immediately by the product webhooks. Empty without Shopify or on failure.
 */
export async function getPriceMap(): Promise<PriceMap> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.prices);
  if (!shopifyEnabled) return {};
  try {
    const map: PriceMap = {};
    let after: string | null = null;
    do {
      const data: {
        products: {
          pageInfo: { hasNextPage: boolean; endCursor: string };
          edges: { node: { handle: string; availableForSale: boolean; priceRange: { minVariantPrice: Money } } }[];
        };
      } = await shopifyFetch(
        `query prices($after: String, $country: CountryCode) @inContext(country: $country) {
          products(first: 250, after: $after) {
            pageInfo { hasNextPage endCursor }
            edges { node { handle availableForSale priceRange { minVariantPrice { amount currencyCode } } } }
          }
        }`,
        { after },
      );
      for (const { node } of data.products.edges) {
        const price = node.priceRange.minVariantPrice;
        map[node.handle] = {
          price,
          available: node.availableForSale,
          purchasable: node.availableForSale && Number(price.amount) > 0,
        };
      }
      after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
    } while (after);
    return map;
  } catch (error) {
    console.error("[shopify] price lookup failed:", error);
    return {};
  }
}

export type Policy = { handle: string; title: string; body: string };

/** The store's legal policies, as written in Shopify admin → Settings → Policies. */
export async function getPolicies(): Promise<Policy[]> {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.policies);
  if (!shopifyEnabled) return [];
  try {
    type P = Policy | null;
    const { shop } = await shopifyFetch<{
      shop: { privacyPolicy: P; refundPolicy: P; shippingPolicy: P; termsOfService: P };
    }>(
      `query policies {
        shop {
          privacyPolicy { handle title body }
          refundPolicy { handle title body }
          shippingPolicy { handle title body }
          termsOfService { handle title body }
        }
      }`,
    );
    return [shop.privacyPolicy, shop.refundPolicy, shop.shippingPolicy, shop.termsOfService].filter(
      (p): p is Policy => Boolean(p?.body?.trim()),
    );
  } catch (error) {
    console.error("[shopify] policy lookup failed:", error);
    return [];
  }
}
