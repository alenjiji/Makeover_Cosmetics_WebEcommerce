# Deploying makeoveroverseas.com

The site needs a **Node.js server**, not static hosting. The contact form is a Server
Action, images go through Next.js optimisation, and pages use partial prerendering. A
static export (`output: "export"`) would break all three, so Hostinger's plain shared web
hosting (`public_html`) won't work. Use a Netlify site, a Hostinger **Node.js Web App**
(Business or Cloud plans) or a Hostinger **VPS**.

Requirements everywhere: Node 22 (`.nvmrc`, minimum 20.9), `npm ci`, `npm run build`, `npm start`.

## Environment variables

Set these in the host's dashboard (see `.env.example`). `NEXT_PUBLIC_SITE_URL` is read at
**build** time, so redeploy after changing it.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://makeoveroverseas.com` |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` (see `docs/SHOPIFY.md`) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | The Headless channel's public Storefront API token |
| `SHOPIFY_COUNTRY` | `IN` (prices and checkout in ₹) |
| `SHOPIFY_WEBHOOK_SECRET` | Webhook signing key (Shopify → Settings → Notifications → Webhooks) |

Without the Shopify variables, "Place Order" sends the order to the team as a form
submission (the team confirms price, payment and delivery); add them and redeploy to switch
on Shopify checkout.

## Forms (contact, inquiry, order requests)

Forms are delivered by **Netlify Forms**: no email keys or passwords. The forms are registered
from `public/__forms.html` at deploy time and submitted by `src/lib/forms.ts`.

1. **Netlify → Forms → Enable form detection** (once), then redeploy.
2. **Forms → Form notifications → Add notification → Email notification**: choose
   **Any form**, and enter the inbox that should receive inquiries and order requests.
3. Every submission is also listed under **Netlify → Forms**, with a spam filter.

## Netlify

Everything is in `netlify.toml`; Netlify's Next.js adapter is applied automatically.

1. **Add new site → Import an existing project**, and pick the repository (base directory: the repo root, where `package.json` is).
2. Leave the build settings from `netlify.toml`: `npm run build`, publish `.next`, Node 22.
3. Add the environment variables above, then deploy.
4. **Domain management**: add `makeoveroverseas.com` and `www.makeoveroverseas.com`, and set the apex as primary (www redirects to it). If DNS stays at Hostinger, point the records as Netlify shows: an `A`/`ALIAS` record for the apex and a `CNAME` for www. HTTPS is issued automatically.

## Hostinger: Node.js Web App (hPanel)

1. **Websites → Add website → Node.js app**. Connect the GitHub repository, or upload a zip of the project without `node_modules` and `.next`.
2. Build settings (hPanel's field names may differ slightly):
   - Framework: **Next.js**
   - Node version: **22.x**
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Root directory: the folder with `package.json`
3. Add the environment variables above in the app's settings, then deploy. The app listens on the `PORT` Hostinger provides; `next start` reads it automatically.
4. Attach the domain `makeoveroverseas.com` to the app and enable the free SSL.

## Hostinger: VPS (Ubuntu)

```bash
# once: Node 22, PM2, nginx, certbot
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
sudo npm i -g pm2

# app
git clone <repo-url> /var/www/makeoveroverseas && cd /var/www/makeoveroverseas
cp .env.example .env.production   # fill in the values
npm ci && npm run build
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup

# nginx + HTTPS
sudo cp deploy/nginx-makeoveroverseas.conf /etc/nginx/sites-available/makeoveroverseas
sudo ln -s /etc/nginx/sites-available/makeoveroverseas /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d makeoveroverseas.com -d www.makeoveroverseas.com
```

DNS: point the apex `A` record and `www` at the VPS IP.

**Updating:** `git pull && npm ci && npm run build && pm2 reload makeover-overseas`.

Keep **one** instance (`ecosystem.config.cjs`): the contact form's rate limiter and the page
cache are per process. Running several instances needs `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`
and a shared cache; see Next.js's self-hosting guide.

## After the first deploy

- Submit a contact-form test: it appears under Netlify → Forms and arrives by email.
- Check `https://makeoveroverseas.com/products/2-in-1-diode-nd-yag-laser` loads, and the WhatsApp/call chooser opens.
