/**
 * Clevra Car Detailing — Cloudflare Worker (paste into the dashboard editor)
 * Worker name:  clevra-detailing-worker
 * Bindings:     D1 database → variable name DB
 * Secrets:      STRIPE_SECRET_KEY   (required for online payment)
 *               ADMIN_KEY           (optional — if set, GET/PATCH /api/bookings require header x-admin-key)
 *               ALLOWED_ORIGIN      (optional — defaults to *)
 */

const SOURCE = 'clevra'
const ID_PREFIX = 'CLV-'

const PRICES = { basic: 150, premium: 200 }
const NAMES = { basic: 'Basic Detail', premium: 'Premium Detail' }
const ADDON_PRICE = 50
const PREPAY_DISCOUNT = 15

const PATCHABLE = ['status', 'payment_status', 'reschedule_date', 'reschedule_time', 'original_date', 'original_time', 'notes2', 'date', 'time']

const SCHEMA = `CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  service TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  vehicle TEXT,
  address TEXT,
  notes TEXT,
  source TEXT,
  created_at TEXT,
  status TEXT,
  reschedule_date TEXT,
  reschedule_time TEXT,
  notes2 TEXT,
  original_date TEXT,
  original_time TEXT,
  payment_status TEXT
)`.replace(/\s+/g, ' ').trim()

let schemaReady = false
async function ensureSchema(db) {
  if (schemaReady) return
  await db.exec(SCHEMA)
  schemaReady = true
}

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-admin-key',
  }
}
const json = (env, data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors(env) } })

function computeTotal({ serviceId, addon, prepay }) {
  const base = PRICES[serviceId]
  if (!base) return null
  let total = base + (addon ? ADDON_PRICE : 0)
  if (prepay) total -= PREPAY_DISCOUNT
  return total
}

async function stripe(env, path, params, method = 'POST') {
  const r = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params ? new URLSearchParams(params).toString() : undefined,
  })
  return r.json()
}

function isAdmin(request, env) {
  return !env.ADMIN_KEY || request.headers.get('x-admin-key') === env.ADMIN_KEY
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(env) })

    try {
      // ── Payment route FIRST — never blocked by D1 schema init ──
      if (pathname === '/api/create-payment-intent' && request.method === 'POST') {
        if (!env.STRIPE_SECRET_KEY) return json(env, { error: 'Stripe is not configured.' }, 500)
        const body = await request.json()
        const total = computeTotal({ serviceId: body.serviceId, addon: !!body.addon, prepay: !!body.prepay })
        if (!total) return json(env, { error: 'Unknown service.' }, 400)
        const params = {
          amount: String(total * 100),
          currency: 'usd',
          'automatic_payment_methods[enabled]': 'true',
          description: `Clevra — ${NAMES[body.serviceId]}${body.addon ? ' + Exterior Wash' : ''}`,
          'metadata[source]': SOURCE,
        }
        if (body.email) params.receipt_email = String(body.email).slice(0, 200)
        const pi = await stripe(env, 'payment_intents', params)
        if (pi.error) return json(env, { error: pi.error.message }, 400)
        return json(env, { clientSecret: pi.client_secret, id: pi.id, amount: total })
      }

      if (!pathname.startsWith('/api/')) return json(env, { ok: true, service: 'clevra-detailing-worker' })

      await ensureSchema(env.DB)

      // ── Availability (source-scoped) ──
      if (pathname === '/api/availability' && request.method === 'GET') {
        const date = url.searchParams.get('date')
        if (!date) return json(env, { error: 'date required' }, 400)
        const { results } = await env.DB.prepare(
          "SELECT time FROM bookings WHERE date = ? AND source = ? AND (status IS NULL OR status != 'Cancelled')"
        ).bind(date, SOURCE).all()
        return json(env, { booked: results.map((r) => r.time) })
      }

      // ── Create booking ──
      if (pathname === '/api/bookings' && request.method === 'POST') {
        const b = await request.json()
        const required = ['date', 'time', 'serviceId', 'name', 'phone', 'email', 'vehicle', 'address']
        const missing = required.filter((k) => !b[k] || !String(b[k]).trim())
        if (missing.length) return json(env, { error: `Missing: ${missing.join(', ')}` }, 400)
        if (!NAMES[b.serviceId]) return json(env, { error: 'Unknown service.' }, 400)

        const clash = await env.DB.prepare(
          "SELECT id FROM bookings WHERE date = ? AND time = ? AND source = ? AND (status IS NULL OR status != 'Cancelled') LIMIT 1"
        ).bind(b.date, b.time, SOURCE).first()
        if (clash) return json(env, { error: 'That time was just taken — please pick another slot.' }, 409)

        let paymentStatus = 'Pay Later'
        if (b.paymentIntentId) {
          if (!env.STRIPE_SECRET_KEY) return json(env, { error: 'Stripe is not configured.' }, 500)
          const pi = await stripe(env, `payment_intents/${encodeURIComponent(b.paymentIntentId)}`, null, 'GET')
          if (pi.status !== 'succeeded' && pi.status !== 'processing') {
            return json(env, { error: 'Payment was not completed.' }, 402)
          }
          paymentStatus = 'Paid'
        }

        const prepay = paymentStatus === 'Paid' && !!b.prepay
        const total = computeTotal({ serviceId: b.serviceId, addon: !!b.addon, prepay })
        const service = NAMES[b.serviceId] + (b.addon ? ' + Exterior Wash' : '')
        const notes = `Total $${total}${prepay ? ' (PREPAY -$15)' : ''} · ${paymentStatus === 'Paid' ? 'Paid online' : 'Collect on site'}`
        const id = ID_PREFIX + crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
        const clip = (v, n = 300) => String(v || '').trim().slice(0, n)

        await env.DB.prepare(
          `INSERT INTO bookings (id, date, time, service, name, phone, email, vehicle, address, notes, source, created_at, status, payment_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          id, clip(b.date, 20), clip(b.time, 20), service, clip(b.name, 120), clip(b.phone, 40), clip(b.email, 200),
          clip(b.vehicle, 120), clip(b.address), notes, SOURCE, new Date().toISOString(), 'Confirmed', paymentStatus
        ).run()

        return json(env, { ok: true, booking: { id, date: b.date, time: b.time, service, total, payment_status: paymentStatus } })
      }

      // ── Admin: list ──
      if (pathname === '/api/bookings' && request.method === 'GET') {
        if (!isAdmin(request, env)) return json(env, { error: 'Unauthorized' }, 401)
        const { results } = await env.DB.prepare(
          'SELECT * FROM bookings WHERE source = ? ORDER BY date DESC, time DESC LIMIT 500'
        ).bind(SOURCE).all()
        return json(env, { bookings: results })
      }

      // ── Admin: patch ──
      const m = pathname.match(/^\/api\/bookings\/([^/]+)$/)
      if (m && request.method === 'PATCH') {
        if (!isAdmin(request, env)) return json(env, { error: 'Unauthorized' }, 401)
        const body = await request.json()
        const keys = Object.keys(body).filter((k) => PATCHABLE.includes(k))
        if (!keys.length) return json(env, { error: 'No patchable fields' }, 400)
        const sets = keys.map((k) => `${k} = ?`).join(', ')
        await env.DB.prepare(`UPDATE bookings SET ${sets} WHERE id = ? AND source = ?`)
          .bind(...keys.map((k) => body[k]), decodeURIComponent(m[1]), SOURCE).run()
        return json(env, { ok: true })
      }

      return json(env, { error: 'Not found' }, 404)
    } catch (err) {
      return json(env, { error: err.message || 'Server error' }, 500)
    }
  },
}
