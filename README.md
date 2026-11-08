# Print Macaw — Next.js storefront

Next.js 15 (App Router, TypeScript) front end for the Print Macaw WordPress/WooCommerce store.
The design is the `print-macaw` theme's own CSS (copied unchanged), so class names and layout match the WordPress theme.

## 1. Extract and install
```bash
unzip printmacaw-nextjs-final.zip && cd printmacaw-nextjs
npm install
```
Requires Node 18.18+ (Node 20/22 recommended).

## 2. Add your product images (important)
Copy these folders from `wp-content/uploads` into `public/uploads/`, keeping the names:
`2025/08`, `2025/09`, `2025/11`, `2026/03`, `2026/04`  (`2026/11` is already included).
`docs/MISSING_IMAGES.txt` lists every file the catalogue expects. Until they are added, product cards show a text fallback.

## 3. Environment variables
```bash
cp .env.example .env.local
```
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site (canonical URLs, sitemap, structured data) |
| `NEXT_PUBLIC_PUBLIC_EMAIL`, `_BUSINESS_PHONE`, `_WHATSAPP_NUMBER` | Shown in footer/CTAs; WhatsApp buttons appear only if a number is set |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `_FACEBOOK_URL`, `_LINKEDIN_URL` | Footer social links (optional) |

This is a design demo: no WordPress backend is needed. Cart works in the browser; checkout, contact and account are demo-only (no payment, no orders, no emails).

## 4. Run
```bash
npm run dev          # http://localhost:3000
npm run typecheck
npm run build && npm start
```

## 5. Deploy to Vercel
1. Push the folder to GitHub/GitLab and import it in Vercel (framework: Next.js, defaults are fine).
2. Add the environment variables above in Project Settings → Environment Variables.
3. Deploy. Point your domain at Vercel, and keep WordPress on its own sub-domain.

## Content updates
Dummy catalogue data (products, categories, pages, testimonials) lives in `data/*.json`, exported from your SQL file. Edit these files to change content.
