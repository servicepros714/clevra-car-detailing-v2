import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, Phone, Loader2, AlertTriangle } from 'lucide-react'
import { BUSINESS, PACKAGES, ADDON } from '../config'
import { confirmation, pending, createBooking } from '../lib/bookingDb'

export default function Confirmation() {
  const [params] = useSearchParams()
  const [data, setData] = useState(() => confirmation.get())
  const [state, setState] = useState(params.get('payment_intent') ? 'finishing' : 'ready')
  const ran = useRef(false)

  // Handles payment methods that redirect off-site and come back here.
  useEffect(() => {
    const piId = params.get('payment_intent')
    if (!piId || ran.current) return
    ran.current = true
    const p = pending.get()
    if (!p || params.get('redirect_status') !== 'succeeded') { setState(p ? 'failed' : 'ready'); return }
    createBooking({ date: p.date, time: p.time, serviceId: p.serviceId, addon: !!p.addon, ...p.info, paymentIntentId: piId, prepay: !!p.prepay })
      .then((b) => {
        const rec = { ...b, status: 'Paid', info: p.info, date: p.date, time: p.time, serviceId: p.serviceId, addon: p.addon }
        confirmation.set(rec); pending.clear(); setData(rec); setState('ready')
      })
      .catch(() => setState('failed'))
  }, [params])

  if (state === 'finishing') {
    return <section className="confirm"><div className="container confirm__card"><Loader2 className="spin" size={28} /><h1>Finalizing your booking…</h1></div></section>
  }
  if (state === 'failed') {
    return (
      <section className="confirm"><div className="container confirm__card">
        <AlertTriangle size={34} className="confirm__warn" />
        <h1>We couldn’t finish your booking</h1>
        <p>If you were charged, don’t worry — call us and we’ll lock in your slot right away.</p>
        <a href={BUSINESS.phoneHref} className="btn btn-blade"><Phone size={16} /> {BUSINESS.phoneDisplay}</a>
      </div></section>
    )
  }
  if (!data) {
    return (
      <section className="confirm"><div className="container confirm__card">
        <h1>No booking to show</h1>
        <Link to="/book" className="btn btn-blade">Book a detail</Link>
      </div></section>
    )
  }

  const pkg = PACKAGES.find((p) => p.id === data.serviceId)
  const paid = data.status === 'Paid' || data.payment_status === 'Paid'
  return (
    <section className="confirm">
      <div className="container confirm__card">
        <CheckCircle2 size={44} className="confirm__ok" />
        <p className="eyebrow mono">Booking confirmed</p>
        <h1>You’re on the schedule{data.info?.name ? `, ${data.info.name.split(' ')[0]}` : ''}.</h1>
        <dl className="confirm__list">
          <div><dt className="mono">Reference</dt><dd className="mono">{data.id}</dd></div>
          <div><dt className="mono">Service</dt><dd>{pkg?.name}{data.addon ? ` + ${ADDON.name}` : ''}</dd></div>
          <div><dt className="mono">When</dt><dd>{data.date && format(parseISO(data.date), 'EEEE, MMM d')} · {data.time}</dd></div>
          <div><dt className="mono">Where</dt><dd>{data.info?.address}</dd></div>
          <div><dt className="mono">Payment</dt><dd>{paid ? `Paid online${data.total ? ` — $${data.total}` : ''}` : `Pay after service${data.total ? ` — $${data.total}` : ''}`}</dd></div>
        </dl>
        <p className="confirm__note">Need to change something? Call or text <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>.</p>
        <Link to="/" className="btn btn-steel">Back to home</Link>
      </div>
    </section>
  )
}
