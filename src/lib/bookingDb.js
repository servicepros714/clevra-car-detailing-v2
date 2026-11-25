import { WORKER_URL } from '../config'

// Booking data layer: the Cloudflare Worker (worker/worker.js) + the shared D1 database.
// The Worker prices everything from the service ids and checks card payments with Stripe,
// so nothing the browser sends about price or payment status is trusted.

const PENDING_KEY = 'clevra_pending_booking'
const CONFIRMED_KEY = 'clevra_last_confirmation'

const hasWorker = () => Boolean(WORKER_URL) && !WORKER_URL.includes('YOUR-SUBDOMAIN')
export const workerConnected = hasWorker

const serviceIds = ({ serviceId, addon }) => [serviceId, ...(addon ? ['exterior'] : [])]

async function request(path, options = {}) {
  if (!hasWorker()) throw new Error('Online booking is not connected yet. Please call us to book.')
  let r
  try {
    r = await fetch(`${WORKER_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json' } })
  } catch {
    throw new Error('Could not reach the booking server. Check your connection and try again.')
  }
  const data = await r.json().catch(() => ({}))
  if (!r.ok) {
    const err = new Error(data.error || 'Something went wrong. Please call us.')
    err.status = r.status
    throw err
  }
  return data
}

export async function fetchBookedTimes(dateKey) {
  if (!hasWorker()) return []
  try {
    const d = encodeURIComponent(dateKey)
    const data = await request(`/api/availability?start=${d}&end=${d}`)
    return (data.booked && data.booked[dateKey]) || []
  } catch {
    return []
  }
}

// { serviceId, addon, prepay, date, time, name, email } -> { clientSecret, paymentIntentId, amount }
export function createPaymentIntent(p) {
  return request('/api/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ services: serviceIds(p), coupon: p.prepay ? 'PREPAY' : '', date: p.date, time: p.time, name: p.name, email: p.email }),
  })
}

// Booking fields + optional paymentIntentId. Without it the booking is "Pay Later"; with it the
// Worker verifies the PaymentIntent with Stripe before saving the booking as Paid.
export async function createBooking(p) {
  const data = await request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      services: serviceIds(p),
      date: p.date, time: p.time,
      name: p.name, phone: p.phone, email: p.email, vehicle: p.vehicle, address: p.address,
      payLater: !p.paymentIntentId,
      paymentIntentId: p.paymentIntentId || undefined,
    }),
  })
  return { ...p, id: data.id, payment_status: data.payment_status, status: data.payment_status, total: data.total }
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
