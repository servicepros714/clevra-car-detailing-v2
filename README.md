# Clevra Car Detailing Costa Mesa

Mobile car detailing site for Clevra Car Detailing (Costa Mesa, CA), live at
https://clevracardetailingcostamesa.site (no www; www redirects to it).
Vite + React 18, React Router, Stripe (Payment Element + Express Checkout), Cloudflare Pages,
and a Cloudflare Worker that stores bookings in the shared D1 database on the Remoticojobs account.

- Booking IDs start with `CLV-`, bookings are stored with `source = 'clevra-costa-mesa'`.
- Services: Basic Detail $150 (about 2–3 hours), Premium Detail $200 (about 4–6 hours),
  Exterior Wash +$50 (add-on only, the Worker rejects it on its own). Same price for any vehicle.
  Eco-friendly products (confirmed by the owner).
  Coupon `PREPAY` = $15 off when paying online.
- Slots: start times 8:00 AM to 5:00 PM, every 30 minutes, 7 days a week, Pacific time,
  4-hour lead time, up to 90 days ahead. Keep `src/config.js` and `worker/worker.js` in sync.

## Build

```bash
npm install
npm run build   # vite build + SSR build + scripts/prerender.js
```

`scripts/prerender.js` writes one static HTML file per route (`dist/<slug>.html`) with its own
title, description, canonical, Open Graph tags and JSON-LD, writes `dist/sitemap.xml`, and fails the
build if a title is over 60 or a description over 160 characters. Booking, checkout and
confirmation ship head tags only (they render in the browser). There is no `_redirects` file:
Cloudflare Pages serves `dist/404.html` for unknown URLs, and `public/_headers` keeps
`*.pages.dev` out of search results.

## Where things live

- Business facts, prices, hours, home FAQ, reviews, Google profile link: `src/config.js`
  (confirmed facts are listed at the top)
- Head tags and schema: `src/lib/seo.js`
- Service and city landing pages (data): `src/lib/pages.js`, rendered by `src/pages/Landing.jsx`
- Sections shared by home and landing pages: `src/components/Sections.jsx`
- Reviews: `REVIEWS` in `src/config.js` (real Google reviews only; the section and its menu
  link stay hidden while the list is empty)
- Photos: `public/images/`, share image `public/images/og.jpg`

## Booking flow

1. `/book` keeps the choices in sessionStorage; `/checkout` shows the total (Stripe deferred mode).
2. Card / Link / Apple Pay / Google Pay: on Pay, `/checkout` calls `POST /api/create-payment-intent`
   (the Worker prices it), confirms with Stripe, then `POST /api/bookings` with the `paymentIntentId`
   (`/confirmation` does this for redirect-based methods). `src/lib/bookingDb.js` translates the
   booking state into the Worker's API. The Worker re-reads the PaymentIntent from Stripe and checks status, site,
   amount, services, date and time before saving it as Paid. If the slot was taken meanwhile, it
   refunds the payment automatically.
3. "I'll pay later": `/checkout` calls `POST /api/bookings` with `payLater: true`.
4. Each new booking sends one `booking_confirmed` event to the GHL webhook
   (`booking_notifications` makes sure it is sent only once). Pricing and the PaymentIntent are
   stored in `booking_payments`, like the other Remoticojobs sites.

## Worker

`worker/worker.js`, config in `worker/wrangler.jsonc` (account Remoticojobs, D1
`detailing-bookings-remoticojobs`, shared with Alera, Apex, Aventa, Aurum, Blacktop, Bonnie and Bright Coat; every query is
scoped by `source`). The Worker never creates or alters tables. Deploy from `worker/`:

```bash
npx wrangler deploy
```

Secrets (dashboard → Workers → clevra-car-detailing-v2 → Settings → Variables and Secrets):

| Name | Required | What |
|---|---|---|
| `STRIPE_SECRET_KEY` | yes | Same Stripe account as `VITE_STRIPE_PUBLISHABLE_KEY` |
| `GHL_WEBHOOK_URL` | yes | GoHighLevel inbound webhook for the booking email |
| `ADMIN_TOKEN` | no | `Authorization: Bearer <token>` for `GET/PATCH /api/bookings` (closed without it) |

## Site deploy

Cloudflare Pages project `clevra-car-detailing-v2` on Remoticojobs (direct upload, no Git connection):

```bash
npm run build
npx wrangler pages deploy dist --project-name clevra-car-detailing-v2 --branch main
```

`.env.local` holds only public values (Stripe publishable key, `VITE_WORKER_URL`) and is committed on purpose.
