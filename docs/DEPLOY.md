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
| `EMAIL_PROVIDER` | `gmail` for now, `resend` once domain email exists |
| `GMAIL_USER` | The Gmail address that sends (and, by default, receives) inquiries |
| `GMAIL_APP_PASSWORD` | A Google App Password (needs 2-Step Verification), not the account password |
| `RESEND_API_KEY` | From resend.com, when `EMAIL_PROVIDER=resend` |
| `CONTACT_TO_EMAIL` | Inbox for inquiries; optional with Gmail |
| `CONTACT_FROM_EMAIL` | Resend only: e.g. `Makeover Overseas <website@makeoveroverseas.com>` |

The contact form fails in production without credentials for the chosen provider.
**Switching from Gmail to Resend** later is only an env change: set `EMAIL_PROVIDER=resend`
plus the Resend variables, then redeploy.

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

- Submit a contact-form test and confirm the email arrives.
- Check `https://makeoveroverseas.com/products/2-in-1-diode-nd-yag-laser` loads, and the WhatsApp/call chooser opens.
- In Resend, verify the sending domain (SPF/DKIM DNS records) before going live.
