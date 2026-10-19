// Checks the website's link to Shopify: the token works, the store's market and currency,
// and every catalog product exists in Shopify (same handle), is priced and is for sale.
//
// Usage: node --env-file=.env.local scripts/check-shopify.mts
// (needs SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN; Node 23.6+)
import { products } from "../src/data/products.ts";

const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? "2025-07";
const country = (process.env.SHOPIFY_COUNTRY ?? "IN").toUpperCase();

if (!domain || !token) {
  console.error("Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN (e.g. in .env.local).");
  process.exit(1);
}

async function query<T>(q: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token!.startsWith("shpat_")
        ? { "Shopify-Storefront-Private-Token": token! }
        : { "X-Shopify-Storefront-Access-Token": token! }),
    },
    body: JSON.stringify({ query: q, variables }),
  });
  const body = (await res.json().catch(() => ({}))) as { data?: T; errors?: { message: string }[] };
  if (!res.ok || body.errors?.length) {
    throw new Error(body.errors?.map((e) => e.message).join("; ") ?? `HTTP ${res.status}`);
  }
  return body.data as T;
}

type Node = { handle: string; title: string; availableForSale: boolean; priceRange: { minVariantPrice: { amount: string; currencyCode: string } } };

try {
  const { shop, localization } = await query<{
    shop: { name: string; primaryDomain: { url: string } };
    localization: { country: { name: string; currency: { isoCode: string } } };
  }>(
    `query info($country: CountryCode) @inContext(country: $country) {
      shop { name primaryDomain { url } }
      localization { country { name currency { isoCode } } }
    }`,
    { country },
  );
  console.log(`✓ Connected to "${shop.name}" (${shop.primaryDomain.url})`);
  console.log(`  Market: ${localization.country.name}, prices in ${localization.country.currency.isoCode}`);

  const found = new Map<string, Node>();
  let after: string | null = null;
  do {
    const data: { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: Node[] } } = await query(
      `query list($after: String, $country: CountryCode) @inContext(country: $country) {
        products(first: 250, after: $after) {
          pageInfo { hasNextPage endCursor }
          nodes { handle title availableForSale priceRange { minVariantPrice { amount currencyCode } } }
        }
      }`,
      { after, country },
    );
    for (const node of data.products.nodes) found.set(node.handle, node);
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);

  const missing: string[] = [];
  const unpriced: string[] = [];
  const unavailable: string[] = [];
  let ready = 0;
  for (const p of products) {
    const node = found.get(p.slug);
    if (!node) missing.push(`${p.slug}  (${p.name})`);
    else if (Number(node.priceRange.minVariantPrice.amount) <= 0) unpriced.push(`${p.slug}  (${node.title})`);
    else if (!node.availableForSale) unavailable.push(`${p.slug}  (${node.title})`);
    else ready++;
  }

  console.log(`\n${ready}/${products.length} catalog products are priced and purchasable online.`);
  const report = (label: string, list: string[], hint: string) => {
    if (!list.length) return;
    console.log(`\n✗ ${label} (${list.length}): ${hint}`);
    for (const item of list) console.log(`  - ${item}`);
  };
  report(
    "Not visible to the website",
    missing,
    "import them (docs/shopify-products.csv), keep the handle, set Active and publish to the Headless channel",
  );
  report("Priced at 0", unpriced, "set a price; until then the site shows ₹ N.A and offers an inquiry instead");
  report("Not for sale", unavailable, "check inventory (or 'Continue selling when out of stock') and channel availability");

  const extra = [...found.keys()].filter((h) => !products.some((p) => p.slug === h));
  if (extra.length) {
    console.log(`\nℹ In Shopify but not on the website (${extra.length}): add them to src/data/products.ts to show them.`);
    for (const h of extra) console.log(`  - ${h}`);
  }
} catch (error) {
  console.error(`✗ Shopify request failed: ${(error as Error).message}`);
  console.error("  Check the store domain, the token, and that the token's Storefront API permissions include products and carts.");
  process.exit(1);
}
