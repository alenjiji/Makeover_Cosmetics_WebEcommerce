# Shopify (Basic plan) setup

The website on Netlify stays the storefront. Shopify runs everything behind it: prices,
stock, cart, checkout, payments, orders, customer accounts and policies, through the
**Storefront API**.

Each product is matched by **handle = the product's URL slug** on the site. For example,
`/products/7d-hifu-machine` is the Shopify product with handle `7d-hifu-machine`.

## What the site does with Shopify

| Area | Behaviour |
|---|---|
| Prices | Shown on product cards, product pages and in the cart, in ₹ for the India market. Unpriced products show **₹ N.A**. |
| Price on request | Products priced ₹0 (or not for sale) can't be added to the cart; the button becomes **Ask for Price** and opens the inquiry form. **Inquire** stays on every card and product page. |
| Cart | The navbar bag icon opens a slide-out cart; `/cart` is the full page. Visitors can change quantities, remove items and add an **order note** (voltage, plug type, delivery details) that appears on the order. |
| Checkout | Shopify's hosted checkout, which handles payment, shipping, GST and discount codes. The cart opens checkout in India/INR. |
| Accounts | A person icon in the navbar links to Shopify customer accounts (orders, addresses). |
| Policies | Privacy, refund, shipping and terms are pulled from Shopify into `/policies/...`, linked in the footer. |
| Freshness | Prices refresh hourly, and instantly when Shopify sends webhooks. |
| SEO | Product pages include price and stock in their search data once priced. |

Until the env vars are set, the cart is kept in the browser and **Place Order** opens the
site's own `/checkout` page. It collects contact and delivery details (GSTIN optional), emails the order to
your inbox with an order number such as `MO-261019-7KQ2`, and sends the customer a
confirmation. Your team then confirms price, payment and delivery. Once Shopify is connected,
**Place Order** goes to Shopify checkout instead.

## One-time setup in Shopify admin

### 1. Store basics
- **Settings → General:** store currency **Indian rupee (INR)**, and time zone.
- **Settings → Markets:** India as the primary market. The site requests prices for `SHOPIFY_COUNTRY=IN`.
- **Settings → Taxes and duties → India:** add your GSTIN and choose whether prices include GST.
- **Settings → Shipping and delivery:** set rates for equipment (flat freight, free shipping, or local delivery). Checkout can't complete without a rate for the customer's address.
- **Settings → Payments:** Shopify Payments isn't available in India, so add a provider such as Razorpay, PayU or Cashfree. Also add a manual method (bank transfer) for large orders. Use the provider's test mode for the first order.

### 2. Products
1. Generate the import file: `npm run shopify:export`. This writes `docs/shopify-products.csv`: all products as drafts, without prices, with images from the live site.
2. **Products → Import**, and upload the CSV. **Don't change the handles.**
3. For each product, set the **price** (anything left at ₹0 stays "₹ N.A / Ask for Price" on the site), set status **Active**, and tick the **Headless** sales channel. The import already allows ordering when out of stock (made-to-order equipment).

### 3. Headless channel and token
1. Install the **Headless** channel from the Shopify App Store (included on Basic), then **Create storefront**.
2. **Storefront API → Manage permissions:** allow product listings, product inventory, and cart / checkout read and write.
3. Copy the **public access token**.

### 4. Policies
**Settings → Policies:** write or generate the Refund, Privacy, Terms of service and Shipping policies. They appear on the site automatically and in the footer.

### 5. Checkout look
**Settings → Checkout → Customize:**
- Logo: `public/brand/logo-landscape.png` (or `logo.png`)
- Colours: accent / buttons **#122B49**, background **#FFFFFF**, secondary **#F5F6F5**, error/emphasis **#8C5D54**
- Fonts: headings **Playfair Display**, body **Montserrat** (both are in Shopify's font list)

### 6. Checkout domain (recommended)
Checkout opens on the store's primary domain. To keep it on your own domain:
1. **Settings → Domains → Connect existing domain:** add `shop.makeoveroverseas.com`. **Don't** add `makeoveroverseas.com` itself; that stays on Netlify.
2. At Hostinger, add: `CNAME  shop  →  shops.myshopify.com`
3. Once it's verified, set `shop.makeoveroverseas.com` as the **primary domain**.

### 7. Send visitors of the Shopify theme to the website
Shopify's own theme pages would otherwise duplicate the site. In **Online Store → Themes → Edit code → `layout/theme.liquid`**, paste this right after `<head>`:

```liquid
{% unless request.design_mode %}
<script>window.location.replace("https://makeoveroverseas.com" + window.location.pathname + window.location.search);</script>
{% endunless %}
```

Checkout and customer accounts don't use the theme, so they keep working. "Continue shopping" after an order returns visitors to the website.

### 8. Webhooks (instant price updates)
**Settings → Notifications → Webhooks → Create webhook** (format JSON, latest API version), URL `https://makeoveroverseas.com/api/shopify/webhook`, for each topic:

- `Product creation`, `Product update`, `Product deletion`
- `Inventory level update`
- `Shop update` (policies)

Copy the signing key shown at the bottom of that page ("Your webhooks will be signed with …") into `SHOPIFY_WEBHOOK_SECRET`.

## Connect the website

On Netlify (Site configuration → Environment variables), add the following, then **redeploy**:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxx
SHOPIFY_COUNTRY=IN
SHOPIFY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxx
```

To check the link locally, put the same values in `.env.local`, then run:

```bash
npm run shopify:check
```

It confirms the connection and the market currency, and lists any catalog product that is missing from Shopify, unpriced or not for sale.

## Go-live test
1. Add a priced product, change its quantity, add an order note, then **Checkout**.
2. Pay with the payment provider's test mode, or a manual method, and check the order (and its note) in Shopify admin.
3. Back on the site, the cart is empty again: Shopify retires carts once they're checked out.
4. Change a price in Shopify; within seconds (webhooks) or an hour, the new price shows on the site.

## Code map
- `src/lib/commerce/shopify.ts`: Storefront API calls (cart, prices, policies), market context, ₹0 guard.
- `src/app/(site)/cart/actions.ts`: server actions the browser calls. The token never reaches the browser.
- `src/app/api/shopify/webhook/route.ts`: verifies webhook signatures and refreshes cached prices and policies.
- `src/app/(site)/policies/[handle]`: policy pages.
- `src/components/cart/*`: cart provider, drawer, lines, note, checkout block, buttons.
- Product copy and photos still come from `src/data/products.ts`. Add new products there and in Shopify with the same handle.
