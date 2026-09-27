import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Lock, Tag, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PACKAGES, ADDON, PREPAY, STRIPE_PK } from '../config'
import { pending, createBooking, createPaymentIntent, confirmation } from '../lib/bookingDb'

const stripeReady = /^pk_(live|test)_/.test(STRIPE_PK) && !STRIPE_PK.includes('REPLACE_ME')
const stripePromise = stripeReady ? loadStripe(STRIPE_PK) : null

function bookingPayload(p) {
  return { date: p.date, time: p.time, serviceId: p.serviceId, addon: !!p.addon, ...p.info }
}

function PayForm({ p, amount, prepay, onDone }) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function pay(e) {
    e.preventDefault()
    if (!stripe || !elements || busy) return
    setBusy(true); setMsg('')
    try {
      const { error: subErr } = await elements.submit()
      if (subErr) throw new Error(subErr.message)
      const { clientSecret } = await createPaymentIntent({ serviceId: p.serviceId, addon: !!p.addon, prepay, email: p.info.email })
      pending.set({ ...p, prepay })
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
          receipt_email: p.info.email,
          payment_method_data: { billing_details: { name: p.info.name, email: p.info.email, phone: p.info.phone } },
        },
        redirect: 'if_required',
      })
      if (error) throw new Error(error.message)
      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
        const booking = await createBooking({ ...bookingPayload(p), paymentIntentId: paymentIntent.id, prepay })
        onDone(booking, 'Paid')
      }
    } catch (err) {
      setMsg(err.message || 'Payment failed. Please try again.')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={pay} className="pay-form">
      <PaymentElement options={{ layout: 'tabs', defaultValues: { billingDetails: { name: p.info.name, email: p.info.email, phone: p.info.phone } } }} />
      {msg && <p className="pay-form__err" role="alert">{msg}</p>}
      <button type="submit" className="btn btn-blade btn-block btn-lg" disabled={!stripe || busy}>
        {busy ? <><Loader2 size={18} className="spin" /> Processing…</> : <><Lock size={16} /> Pay ${amount} &amp; confirm</>}
      </button>
    </form>
  )
}

export default function Checkout() {
  const nav = useNavigate()
  const p = pending.get()
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(false)
  const [laterBusy, setLaterBusy] = useState(false)

  const pkg = p && PACKAGES.find((x) => x.id === p.serviceId)
  const subtotal = (pkg?.price || 0) + (p?.addon ? ADDON.price : 0)
  const amount = applied ? subtotal - PREPAY.amount : subtotal

  const options = useMemo(() => ({
    mode: 'payment',
    amount: amount * 100,
    currency: 'usd',
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#d8ad48', colorBackground: '#1b1e22', colorText: '#e6e8eb',
        colorDanger: '#ff7a6b', fontFamily: 'Manrope, system-ui, sans-serif', borderRadius: '4px',
      },
    },
    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap' }],
  }), [amount])

  if (!p || !pkg || !p.date || !p.time || !p.info?.email) return <Navigate to="/book" replace />

  function applyCode(e) {
    e.preventDefault()
    if (code.trim().toUpperCase() === PREPAY.code) { setApplied(true); toast.success(`$${PREPAY.amount} prepay discount applied`) }
    else toast.error('That code is not valid')
  }

  function done(booking, status) {
    confirmation.set({ ...booking, status, info: p.info, date: p.date, time: p.time, serviceId: p.serviceId, addon: p.addon, total: booking.total ?? (status === 'Paid' ? amount : subtotal) })
    pending.clear()
    nav('/confirmation', { replace: true })
  }

  async function payLater() {
    if (laterBusy) return
    setLaterBusy(true)
    try {
      const booking = await createBooking(bookingPayload(p))
      done(booking, 'Pay Later')
    } catch (err) {
      toast.error(err.message)
      setLaterBusy(false)
    }
  }

  return (
    <section className="checkout">
      <div className="container checkout__wrap">
        <Link to="/book" className="back-link"><ArrowLeft size={15} /> Edit booking</Link>
        <p className="eyebrow mono"><Lock size={12} /> Secure checkout</p>

        {!applied && (
          <div className="prepay-banner">
            <Tag size={18} />
            <div><strong>${PREPAY.amount} OFF</strong> when you prepay online — use code <b className="mono">{PREPAY.code}</b></div>
          </div>
        )}

        <div className="summary">
          <div className="summary__row">
            <div>
              <span className="mono summary__k">Service</span>
              <p className="summary__v">{pkg.name}{p.addon ? ` + ${ADDON.name}` : ''}</p>
              <p className="summary__meta">{format(parseISO(p.date), 'EEE, MMM d, yyyy')} · {p.time}</p>
            </div>
          </div>
          <div className="summary__total">
            <span className="mono">Total</span>
            <strong>
              {applied && <s>${subtotal}</s>} ${amount}
            </strong>
          </div>
        </div>

        {applied ? (
          <div className="coupon coupon--applied">
            <span><Tag size={15} /> <b className="mono">{PREPAY.code}</b> applied — −${PREPAY.amount}</span>
            <button type="button" onClick={() => { setApplied(false); setCode('') }} aria-label="Remove code"><X size={16} /></button>
          </div>
        ) : (
          <form className="coupon" onSubmit={applyCode}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" autoCapitalize="characters" />
            <button type="submit" className="btn btn-steel">Apply</button>
          </form>
        )}

        <div className="pay-card">
          {stripePromise ? (
            <Elements stripe={stripePromise} options={options}>
              <PayForm p={p} amount={amount} prepay={applied} onDone={done} />
            </Elements>
          ) : (
            <p className="pay-card__off">Online payment isn’t connected yet. You can still reserve your slot and pay after the job.</p>
          )}
        </div>

        <button type="button" className="pay-later" onClick={payLater} disabled={laterBusy}>
          {laterBusy ? 'Reserving…' : 'I’ll pay later'}
        </button>
      </div>
    </section>
  )
}
