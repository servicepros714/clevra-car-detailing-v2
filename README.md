# Clevra Car Detailing — Costa Mesa, CA

Vite + React 18 booking site · Cloudflare Pages (GitHub Actions) · Cloudflare Worker + D1 · Stripe PaymentIntents

| Item | Value |
|---|---|
| Source tag | `clevra` |
| Booking ID prefix | `CLV-` |
| Worker name | `clevra-detailing-worker` |
| Pages project | `clevra-car-detailing` |
| Phone | (949) 787-6062 |

## 1. Worker (Cloudflare dashboard)
1. Workers & Pages → Create Worker → name `clevra-detailing-worker` → paste `worker/worker.js` → Deploy.
2. Settings → Bindings → add D1 database, variable name **`DB`** (use the account's shared `detailing-bookings…` DB — table is created with `IF NOT EXISTS`).
3. Settings → Variables → add secret **`STRIPE_SECRET_KEY`**. Optional: `ADMIN_KEY` (locks GET/PATCH `/api/bookings` behind header `x-admin-key`), `ALLOWED_ORIGIN`.

## 2. Frontend env
Edit `.env.local` (committed on purpose — publishable key only):
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_WORKER_URL=https://clevra-detailing-worker.<subdomain>.workers.dev
```
Until `VITE_WORKER_URL` is filled in, bookings save to the browser (localStorage) so the flow can be tested.

## 3. GitHub → Cloudflare Pages
Repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (plus `VITE_STRIPE_PUBLISHABLE_KEY` if you use it elsewhere). Push to `main` → `.github/workflows/deploy.yml` builds `dist` and deploys. SPA routing via `public/_redirects`.

## Local
```
npm install
npm run dev
```

## Booking rules
- Steps: Package → Exterior Wash add-on (tap to add, optional) → Date → Time → Details → Checkout
- Slots 8:00 AM–4:30 PM, 30 min, Mon–Sun; earliest slot = now (California) + 2 h; 60-day window
- Availability and double-booking checks are scoped `AND source = 'clevra'`
- Price is computed in the Worker from the service id (client amount never trusted); `PREPAY` = $15 off online payment only
- `payment_status`: `Paid` (verified against Stripe) or `Pay Later`
