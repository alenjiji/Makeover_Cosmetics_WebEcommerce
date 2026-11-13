# Shopify (Basic plan): complete setup and running guide

The **website on Netlify is the shop window**. Shopify is the **back office** behind it: prices,
stock, cart, checkout, payments, orders, customers and policies, connected through the
**Storefront API** (Headless channel).

Store: `ytgk3g-w3.myshopify.com` · Website: `https://makeoveroverseas.com`

## How the two fit together (read this first)

| Lives on the website (code, `src/data/products.ts`) | Lives in Shopify (admin) |
|---|---|
| Product names, descriptions, specs, features, photos, categories, "New" badges | **Price**, **for sale or not**, stock |
| Page design, menus, SEO text | Cart, checkout, payment, shipping rates, GST |
| | Orders, customers, refunds, invoices |
| | Policies (privacy, refund, shipping, terms) |

- Each Shopify product is matched to a website product by its **handle**, which equals the website
  URL slug. `/products/7d-hifu-machine` ↔ Shopify handle `7d-hifu-machine`. **Never change a handle.**
- Editing a product's title, description or photo **in Shopify does not change the website**. It only
  changes what appears in checkout and on order emails. Change website text in `src/data/products.ts`.
- Each product uses **one variant only** (the first). Don't add options like 2-hole / 4-hole as
  variants: the site always adds the first one. Make separate products instead.
- Price rules on the website:
  - price **above ₹0** and for sale → price shown, **Add to Cart** works
  - price **₹0**, or product not on the Headless channel → **₹ N.A** and **Ask for Price** (inquiry form)
- Prices update on the site within seconds (webhooks), or within an hour at most.

## Domains: the one rule

**`makeoveroverseas.com` and `www` belong to Netlify. Never connect them to Shopify.**
Not in Shopify → Settings → Domains, and never with Hostinger's DNS "Quick setup → Shopify" button.
Doing so replaces the whole website with Shopify's password page (this happened on 13 Nov 2026).

Correct DNS at Hostinger:

| Type | Name | Points to |
|---|---|---|
| A | @ | `75.2.60.5` |
| CNAME | www | `makeoveroverseas.netlify.app` |
| CNAME | shop | `shops.myshopify.com` (optional, for checkout on your domain; see step 9) |

In Shopify → Settings → Domains, the primary domain must be `ytgk3g-w3.myshopify.com`, or
`shop.makeoveroverseas.com` once step 9 is done.

---

## Part A: One-time setup

### 1. Store details
**Settings → Store details**
- Store name **Makeover Overseas**, the store contact email and phone.
- **Billing address** = the registered business address. It prints on invoices.
- **Store currency: Indian rupee (INR)**. Set it before the first order; it's locked afterwards.
- Time zone **(GMT+05:30) India**, unit system **Metric**, default weight unit **kg**.
- Order ID format: prefix such as `MO-`, so orders read `MO-1001`.

### 2. Markets
**Settings → Markets**
- **India** is the primary market. That's the market the website shows prices for (`SHOPIFY_COUNTRY=IN`).
- Leave international markets off for now. UAE and export orders keep going through inquiry and quote.

### 3. Taxes (GST)
**Settings → Taxes and duties → India**
- Add your **GSTIN**.
- Choose how you list prices. The usual choice for B2B equipment is to list prices **excluding GST**,
  so GST is added at checkout: turn **"All prices include tax"** off. If you'd rather show the final
  price, turn it on and enter prices including GST.
- Set the default rate your products fall under (confirm the HSN and GST rate with your accountant).
  If some products need a different rate, add a **tax override** for a collection of them.
- Customers can enter their own GSTIN at checkout for B2B invoices. To collect it, use **Settings →
  Checkout → "Company name" = optional**. The order note on the website also mentions GSTIN.

### 4. Shipping
**Settings → Shipping and delivery → General shipping rates → India**
- **Checkout can't complete without a shipping rate** for the customer's address.
- Simplest setup for equipment: one rate, "**Freight (quoted separately)**" at ₹0, or "Free
  delivery", plus your note that freight is confirmed after the order. Or a flat rate per order.
- Set every product's **weight** (in Products) if you later want weight-based rates.
- **Local pickup**: enable it for your Trivandrum address if customers can collect.

### 5. Payments
**Settings → Payments**
- Shopify Payments isn't available in India. Click **Add payment method**, search for the provider and
  connect your merchant account with **Razorpay** (recommended: UPI, cards, netbanking, EMI),
  **PayU** or **Cashfree**. You'll need your KYC-approved account with that provider.
- Add **Manual payment methods → Bank deposit** with your account details. Big-ticket machines are
  often paid by bank transfer, and the order still comes in as "Payment pending".
- Leave the provider in **test mode** until your test order (Part B) works.
- **Payment capture: Automatically at checkout.**

### 6. Checkout and customer accounts
**Settings → Checkout**
- Contact method: **Phone number or email**.
- Full name: **Require first and last name**. Company name: **Optional**. Address line 2: **Optional**.
- Shipping address phone number: **Required** (needed for freight).
- Tipping: off. Order notes are already sent from the website cart.
- **Customize** (the checkout editor):
  - Logo `public/brand/logo-landscape.png`
  - Main colour / buttons **#122B49**; background **#FFFFFF**; secondary background **#F5F6F5**; error **#8C5D54**
  - Headings font **Playfair Display**; body font **Montserrat**

**Settings → Customer accounts**
- Choose **Customer accounts** (the new style, sign in with a one-time code; no passwords to manage).
- "Show login links in the header of online store and at checkout": **on**.
- The person icon in the website navbar links to these accounts (order history, addresses).

### 7. Policies
**Settings → Policies**
- Fill in **Refund**, **Privacy**, **Terms of service** and **Shipping** (use "Create from template",
  then edit to match your warranty and delivery terms: 1–2 year warranty, 7–15 business-day delivery).
- **Contact information** policy: fill it in too. Indian payment providers check for it.
- They appear on the website automatically at `/policies/...` and in the footer.

### 8. Notifications
**Settings → Notifications**
- **Staff notifications → Add recipient**: the inbox (and phone, via the Shopify app) that should hear
  about every new order.
- **Customer notifications**: the defaults are fine. Order confirmation, shipping confirmation and so
  on use your logo and colours from **Customize email templates**.
- Sender email: **Settings → Notifications → Sender email**. Use an address on your domain once domain
  email exists.

### 9. Online Store: keep it out of the way
Shopify's own theme would duplicate the website, so it only forwards visitors there.
- **Online Store → Preferences → Password protection: off.** Checkout redirects to the password page
  while it's on, so orders can't be placed.
- **Online Store → Themes → … → Edit code → `layout/theme.liquid`**: paste this right after `<head>`:
  ```liquid
  {% unless request.design_mode %}
  <script>window.location.replace("https://makeoveroverseas.com" + window.location.pathname + window.location.search);</script>
  {% endunless %}
  ```
  Checkout and customer accounts don't use the theme, so they keep working. Anyone opening the
  myshopify address lands on the website.
- **Optional, checkout on your own domain:** at Hostinger add `CNAME shop → shops.myshopify.com` by
  hand. In **Settings → Domains → Connect existing domain**, enter `shop.makeoveroverseas.com`, then
  set it as **primary**. Checkout then shows `shop.makeoveroverseas.com`.

### 10. Products: first import
1. In the project folder, run (photos are fetched from this address):
   ```bash
   npm run shopify:export -- https://makeoveroverseas.netlify.app
   ```
   It writes `docs/shopify-products.csv`: all 29 website products as **drafts**, without prices,
   "continue selling when out of stock" (made-to-order equipment), with photos.
2. **Products → Import → Add file** → that CSV → **Upload and preview** → **Import products**.
3. For each product (open it from the list):
   - **Price**: the selling price. Leave ₹0 for "Ask for Price" items. Optional "Compare-at price".
   - **Cost per item**: your cost, for profit reports. Never shown.
   - **Inventory**: leave "Track quantity" off for made-to-order, or turn it on and enter stock. If
     tracked, tick **"Continue selling when out of stock"** unless you truly can't supply more.
   - **Shipping**: "This is a physical product" on; enter the **weight**.
   - **Status: Active**.
   - **Publishing / Sales channels**: tick **Website** (the Headless storefront from step 11). Without
     it the product shows "Ask for Price" on the site.
4. Faster for many products: in the **Products** list, tick several, then **Bulk edit** to type prices
   in a spreadsheet view, or **More actions → Include in sales channels** to publish them in one go.

### 11. Headless channel (the link to the website)
1. **Shopify App Store → Headless** → **Add sales channel** (free on Basic).
2. **Create storefront** → name it **Website**.
3. Open **Storefront API** and check **permissions** include product listings, product inventory,
   checkouts (read and write), and content. Save if you changed anything.
4. Copy the **Public access token**. It's safe on the website server; it can't read orders or customers.

### 12. Webhooks (instant price updates)
**Settings → Notifications → Webhooks → Create webhook**, once per topic:
- Format **JSON**, URL `https://makeoveroverseas.com/api/shopify/webhook`, API version **2026-10**
- Topics: **Product creation**, **Product update**, **Product deletion**, **Inventory level update**,
  **Collection update**, **Shop update** (policies)

Copy the **signing key** shown at the bottom of the webhooks list ("Your webhooks will be signed with …").

### 13. Connect the website
**Netlify → Site configuration → Environment variables → Add a variable** (all scopes):

```
SHOPIFY_STORE_DOMAIN=ytgk3g-w3.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<public token from step 11>
SHOPIFY_COUNTRY=IN
SHOPIFY_WEBHOOK_SECRET=<signing key from step 12>
```

Then **Deploys → Trigger deploy → Deploy site**. Environment changes only apply after a deploy.

To check from your computer first, put the same lines in `.env.local` in the project, then run:

```bash
npm run shopify:check
```

It confirms the connection and the ₹ currency, and lists every website product that is **missing**
from Shopify, **unpriced** (₹ N.A) or **not for sale** (not Active or not on the Website channel).

---

## Part B: Go-live test

1. On the website, a priced product shows its ₹ price. Add it to the cart, change the quantity, and
   type an order note.
2. **Checkout** opens Shopify checkout with the same item, price and note.
3. Pay with **Bank deposit**, or the payment provider in test mode.
4. In **Shopify → Orders**: the order is there, the note shows under **Notes**, and the attribute
   `source: website` shows under **Additional details**.
5. Back on the website, the cart is empty (Shopify retires a cart once it's checked out).
6. Change that product's price in Shopify; refresh the product page after a few seconds.
7. Cancel and delete the test order: **More actions → Cancel order**, then **Archive**.
8. Switch the payment provider out of test mode.

---

## Part C: Day-to-day

### Set or change a price
**Products → the product → Price → Save.** The website updates within seconds.

### Take a product off sale (keep it on the website as "Ask for Price")
Set price to ₹0, **or** untick the **Website** sales channel. Don't delete it, or the history and handle are lost.

### Add a new product
This needs both sides, with **the same handle**:
1. **Website** (developer): add an entry to `src/data/products.ts`, and put its photo in `public/images/products/`:
   ```ts
   {
     slug: "new-machine-name",          // becomes /products/new-machine-name and the Shopify handle
     name: "New Machine Name",
     category: "HIFU Machine",           // one of productCategories at the top of the file
     spec: "Headline spec line",
     image: "/images/products/new-machine.webp",
     alt: "Describe the photo",
     features: ["Feature one", "Feature two", "Feature three"],
     isNew: true,                        // optional "New" badge
   },
   ```
   Deploy, and the product appears with "Ask for Price".
2. **Shopify**: **Products → Add product**. Same title and photo. Under **Search engine listing → Edit**,
   set **URL handle** to exactly the slug (`new-machine-name`). Set the price, Status **Active**, and tick
   the **Website** channel. The price appears on the site within seconds.
   For several products at once, run `npm run shopify:export` again, delete the rows of products
   already in Shopify from the CSV, and import the rest. Leave "Overwrite products with matching
   handles" unticked so existing prices aren't touched.

### Remove a product
Remove it from `src/data/products.ts` (website) and **archive** it in Shopify. The site has 308 redirects
in `next.config.ts` if an old URL needs to point somewhere.

### Handle an order
1. New-order email or app notification → **Orders → the order**.
2. Read the **Notes** (voltage, plug type, delivery details) and confirm with the customer if needed.
3. Bank transfer: when the money arrives, click **Collect payment → Mark as paid**.
4. When it ships: **Fulfill item** → enter the courier and tracking number → **Fulfill**. The customer
   gets the shipping email with tracking.
5. Refunds: **Refund** on the order. Returns money through the original payment method; manual
   payments must be returned by bank transfer, then marked refunded.

### Discount codes
**Discounts → Create discount → Amount off products / order**. Customers type the code at checkout.

### Reports
**Analytics → Reports**: sales by product, payments, taxes (GST summary for filing).

---

## Troubleshooting

| You see | Cause | Fix |
|---|---|---|
| Whole website shows Shopify "password" page or Cloudflare error 1001 | Domain was connected to Shopify | DNS back to the table in "Domains", remove the domain in Shopify |
| A product shows ₹ N.A | Price ₹0, not Active, or not on the Website channel | Fix in Shopify; `npm run shopify:check` lists which |
| "This product isn't available to order online yet" | Handle in Shopify differs from the website slug | Set Shopify URL handle to the slug |
| Checkout shows the password page | Online Store password protection on | Step 9 |
| Checkout says no shipping available | No rate covers that address | Step 4 |
| Price changed in Shopify but not on the site | Webhooks missing or wrong signing key | Step 12; it still updates within an hour |
| Policies page or footer links missing | Policy empty in Shopify | Step 7 |

## Code map (for developers)
- `src/lib/commerce/shopify.ts`: Storefront API calls (cart, prices, policies), market context, ₹0 guard. API version via `SHOPIFY_API_VERSION` (default `2026-10`; Shopify retires each version after a year).
- `src/app/(site)/cart/actions.ts`: server actions the browser calls. The token never reaches the browser.
- `src/app/api/shopify/webhook/route.ts`: verifies webhook signatures and refreshes cached prices and policies.
- `src/app/(site)/policies/[handle]`: policy pages.
- `src/components/cart/*`: cart provider, drawer, lines, note, checkout block, buttons.
- `scripts/export-shopify-products.mts`, `scripts/check-shopify.mts`: CSV export and connection check.
- Without the Shopify env vars, the site runs in **order-request mode**: the cart is kept in the browser and
  **Place Order** opens `/checkout`, which emails the order (number like `MO-261019-7KQ2`) to the team.
