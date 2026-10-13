# Frangrant Aura

A curated fragrance house website for Lagos, Nigeria — browse by brand, filter
by price, read full product pages, and check out with **Paystack** or
**WhatsApp**.

Built with **Next.js 15 (App Router)**, **TypeScript** and **Tailwind CSS**.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000
```

## What's in it

| Route | What it does |
| --- | --- |
| `/` | Hero, shop-by-price buckets, featured fragrances, houses, scent families, how-to-order |
| `/shop` | Full collection with a dual-thumb **price range slider**, plus brand / scent family / audience / concentration / size filters, search and sorting |
| `/products/[slug]` | Individual product page — notes pyramid, specs, rating, add-to-cart, buy-now, WhatsApp order |
| `/brands` | Every house, with counts and price ranges |
| `/brands/[slug]` | Brand story + its fragrances + price shortcuts for that house |
| `/cart` | Edit quantities, see delivery and totals |
| `/checkout` | Delivery form → pay by **Paystack** (card / transfer / USSD) or send the order to **WhatsApp** |
| `/checkout/confirmation` | Order receipt with reference and amount |
| `/about`, `/contact` | Story, values, FAQs and contact details |

Every filter state lives in the URL, so any filtered view (e.g.
`/shop?min=50000&max=100000&brand=oud-and-ember&sort=price-asc`) is shareable
and bookmarkable.

---

## Configuration

All settings live in **`.env.local`** (copy from `.env.example`) and are read in
one place — `lib/config.ts`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack **public** key. Starts with `pk_test_` or `pk_live_`. |
| `NEXT_PUBLIC_STORE_CURRENCY` | Charge currency. Defaults to `NGN`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format, digits only (`2348012345678`). |
| `NEXT_PUBLIC_STORE_NAME` | Shop name used across the UI and checkout. |
| `NEXT_PUBLIC_STORE_EMAIL` | Contact email. |
| `NEXT_PUBLIC_SITE_URL` | Deployed URL, used for canonical links and the sitemap. |

> **Never** put your Paystack *secret* key in this repo. It is only needed if
> you later add server-side payment verification.

While `pk_test_…` is in use, the checkout page shows a **Test mode** banner and
Paystack's test card (`4084 0840 8408 4081`, any future expiry, any CVV) runs a
full payment without moving real money. Swap in your `pk_live_` key and the
banner disappears — no code changes.

Delivery is a flat **₦3,500**, and becomes free at **₦150,000**. Both values are
constants at the top of `lib/config.ts`.

---

## Editing the catalogue

Product and brand data is plain TypeScript in **`lib/products.ts`** — no CMS
required. To go live with your real inventory:

1. Open `lib/products.ts`.
2. Replace the `brands` and `products` arrays with your own, keeping the same
   field names (see `lib/types.ts`). Every page, filter, brand count, price
   bucket and sitemap entry updates automatically.
3. Drop your product photos into `public/images/products/` named after each
   product's `slug` (e.g. `lumiere-d-or.jpg`) — or point `image` at any other
   path or remote URL.

Handy helpers already wired up:

- `price` / `compareAtPrice` — setting `compareAtPrice` renders a strikethrough
  and a "Save X%" badge.
- `stock` — values of 8 or less trigger a "Only N left" badge.
- `featured`, `badge` — control what appears on the homepage and which ribbon a
  card shows.
- `families`, `topNotes` / `heartNotes` / `baseNotes` — power the scent-family
  filters, the notes pyramid and the search index.

To add a new house, add an entry to `brands` and set `brandSlug` on its
products. The brand page, filter list, sitemap and footer update on their own.

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Vercel detects
   Next.js and needs no build configuration.
3. Add the same environment variables from `.env.local` under
   **Settings → Environment Variables**.
4. Deploy.

It also runs anywhere that supports Node (`npm run build && npm start`) — no
platform-specific config is required.

---

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Homepage
  shop/               Browse + filter (URL-driven state)
  products/[slug]/    Product detail pages
  brands/             House index and detail pages
  cart/ checkout/     Cart, checkout, confirmation
  about/ contact/     Story, FAQs, contact
components/           UI: header, cart drawer, filters, cards, panels
lib/
  products.ts         ← the catalogue (edit this)
  config.ts           ← store settings, fees, price buckets
  filters.ts          Filtering, sorting, URL param parsing
  cart.tsx            Cart state (React context + localStorage)
  paystack.ts         Paystack inline checkout
  whatsapp.ts         wa.me deep links with formatted orders
  format.ts           Naira formatting
  types.ts            Domain types
public/images/        Product photography
```

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```
