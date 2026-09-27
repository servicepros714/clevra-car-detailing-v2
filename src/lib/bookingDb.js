import { WORKER_URL, BUSINESS } from '../config'

// Local fallback so the site still works in dev before the Worker URL is wired.
const LS_KEY = 'clevra_bookings'
const PENDING_KEY = 'clevra_pending_booking'
const CONFIRMED_KEY = 'clevra_last_confirmation'

const hasWorker = () => WORKER_URL && !WORKER_URL.includes('YOUR-SUBDOMAIN')

function readLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function writeLocal(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

export async function fetchBookedTimes(dateKey) {
  if (!hasWorker()) {
    return readLocal().filter((b) => b.date === dateKey).map((b) => b.time)
  }
  try {
    const r = await fetch(`${WORKER_URL}/api/availability?date=${encodeURIComponent(dateKey)}`)
    if (!r.ok) return []
    const data = await r.json()
    return Array.isArray(data.booked) ? data.booked : []
  } catch {
    return []
  }
}

export async function createBooking(payload) {
  const body = { ...payload, source: BUSINESS.source }
  if (!hasWorker()) {
    const id = BUSINESS.idPrefix + Math.random().toString(36).slice(2, 8).toUpperCase()
    const rec = { id, ...body, created_at: new Date().toISOString() }
    writeLocal([...readLocal(), rec])
    return rec
  }
  const r = await fetch(`${WORKER_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || 'Could not save your booking. Please call us.')
  return data.booking || { ...body, id: data.id }
}

export const workerConnected = hasWorker

// Amount is computed server-side from serviceId/addon/prepay — never trusted from the client.
export async function createPaymentIntent({ serviceId, addon, prepay, email }) {
  if (!hasWorker()) throw new Error('Online payment is not connected yet. Choose “pay later” or call us.')
  const r = await fetch(`${WORKER_URL}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId, addon, prepay, email }),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok || !data.clientSecret) throw new Error(data.error || 'Payment could not be started.')
  return data
}

export const pending = {
  get() { try { return JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null') } catch { return null } },
  set(v) { try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(v)) } catch { /* ignore */ } },
  clear() { try { sessionStorage.removeItem(PENDING_KEY) } catch { /* ignore */ } },
}

export const confirmation = {
  get() { try { return JSON.parse(sessionStorage.getItem(CONFIRMED_KEY) || 'null') } catch { return null } },
  set(v) { try { sessionStorage.setItem(CONFIRMED_KEY, JSON.stringify(v)) } catch { /* ignore */ } },
}
