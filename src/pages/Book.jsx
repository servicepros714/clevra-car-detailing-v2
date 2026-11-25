import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, addMonths, subMonths, parseISO,
} from 'date-fns'
import { Check, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PACKAGES, ADDON, BOOKING_WINDOW_DAYS } from '../config'
import { nowInCalifornia, slotsFor, dayHasOpenSlot } from '../lib/time'
import { fetchBookedTimes, pending } from '../lib/bookingDb'

const STEPS = ['Package', 'Add-on', 'Date', 'Time', 'Details']

const FIELDS = [
  { key: 'name', label: 'Full Name', type: 'text', auto: 'name', placeholder: 'Jane Doe' },
  { key: 'phone', label: 'Phone', type: 'tel', auto: 'tel', placeholder: '(949) 555-0123' },
  { key: 'email', label: 'Email', type: 'email', auto: 'email', placeholder: 'you@email.com' },
  { key: 'vehicle', label: 'Vehicle', type: 'text', auto: 'off', placeholder: 'Year Make Model — e.g. 2021 Toyota Camry' },
  { key: 'address', label: 'Service Address', type: 'text', auto: 'street-address', placeholder: 'Street, City, ZIP' },
]

export default function Book() {
  const nav = useNavigate()
  const saved = pending.get()
  const [step, setStep] = useState(saved?.step ?? 0)
  // Landing pages link to /book?service=basic|premium to preselect a package.
  const preset = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('service') : null
  const [serviceId, setServiceId] = useState(PACKAGES.some((p) => p.id === preset) ? preset : saved?.serviceId ?? null)
  const [addon, setAddon] = useState(saved?.addon ?? false)
  const [date, setDate] = useState(saved?.date ?? null)
  const [time, setTime] = useState(saved?.time ?? null)
  const [info, setInfo] = useState(saved?.info ?? { name: '', phone: '', email: '', vehicle: '', address: '' })
  const [errors, setErrors] = useState({})
  const [booked, setBooked] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [month, setMonth] = useState(() => startOfMonth(date ? parseISO(date) : parseISO(nowInCalifornia().dateKey)))
  const inputRefs = useRef({})
  const topRef = useRef(null)

  const pkg = PACKAGES.find((p) => p.id === serviceId)
  const total = (pkg?.price || 0) + (addon ? ADDON.price : 0)

  useEffect(() => { pending.set({ step, serviceId, addon, date, time, info }) }, [step, serviceId, addon, date, time, info])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  useEffect(() => {
    if (!date) return
    let live = true
    setLoadingSlots(true)
    fetchBookedTimes(date).then((b) => { if (live) { setBooked(b); setLoadingSlots(false) } })
    return () => { live = false }
  }, [date])

  const today = parseISO(nowInCalifornia().dateKey)
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS)
  const days = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)),
  }), [month])
  const slots = date ? slotsFor(date) : []

  function validateInfo() {
    const e = {}
    for (const f of FIELDS) if (!info[f.key].trim()) e[f.key] = `${f.label} is required`
    if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())) e.email = 'Enter a valid email address'
    if (!e.phone && info.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit phone number'
    setErrors(e)
    const first = FIELDS.find((f) => e[f.key])
    if (first) {
      toast.error(e[first.key])
      const el = inputRefs.current[first.key]
      if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
      return false
    }
    return true
  }

  function next() {
    if (step === 0 && !serviceId) return toast.error('Choose a package to continue')
    if (step === 2 && !date) return toast.error('Pick a date to continue')
    if (step === 3 && !time) return toast.error('Pick an arrival time to continue')
    if (step === 4) {
      if (!validateInfo()) return
      pending.set({ step, serviceId, addon, date, time, info })
      return nav('/checkout')
    }
    setStep((s) => s + 1)
  }
  function back() {
    if (step === 0) return nav('/')
    setStep((s) => s - 1)
  }

  function formatPhone(v) {
    const d = v.replace(/\D/g, '').slice(0, 10)
    if (d.length < 4) return d
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  }

  return (
    <section className="book" ref={topRef}>
      <div className="container book__wrap">
        <header className="book__head">
          <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to site</Link>
          <p className="eyebrow mono">Step {step + 1} of {STEPS.length}</p>
          <h1>{['Choose your package', 'Add the exterior?', 'Pick a date', 'Pick an arrival time', 'Your details'][step]}</h1>
          <ol className="progress" aria-label="Booking progress">
            {STEPS.map((s, i) => (
              <li key={s} className={i < step ? 'done' : i === step ? 'current' : ''}>
                <span className="progress__bar" />
                <span className="progress__label mono">{s}</span>
              </li>
            ))}
          </ol>
        </header>

        <div className="book__body">
          {step === 0 && (
            <div className="choice-grid">
              {PACKAGES.map((p) => {
                const on = serviceId === p.id
                return (
                  <button key={p.id} type="button" className={`choice ${on ? 'is-on' : ''}`} onClick={() => setServiceId(p.id)} aria-pressed={on}>
                    <span className="choice__check" aria-hidden="true">{on && <Check size={15} strokeWidth={3.5} />}</span>
                    <span className="choice__top">
                      <span>
                        <span className="choice__tag mono">{p.tag}</span>
                        <span className="choice__name">{p.name}</span>
                      </span>
                      <span className="choice__price">${p.price}</span>
                    </span>
                    <ul className="choice__list">
                      {p.features.map((f) => <li key={f}><Check size={13} strokeWidth={3} />{f}</li>)}
                    </ul>
                  </button>
                )
              })}
            </div>
          )}

          {step === 1 && (
            <div className="addon-step">
              <button type="button" className={`choice choice--addon ${addon ? 'is-on' : ''}`} onClick={() => setAddon((a) => !a)} aria-pressed={addon}>
                <span className="choice__check" aria-hidden="true">{addon && <Check size={15} strokeWidth={3.5} />}</span>
                <span className="choice__top">
                  <span>
                    <span className="choice__tag mono">{addon ? 'Added to your detail' : 'Tap to add'}</span>
                    <span className="choice__name">{ADDON.name}</span>
                  </span>
                  <span className="choice__price">+${ADDON.price}</span>
                </span>
                <ul className="choice__list choice__list--2">
                  {ADDON.features.map((f) => <li key={f}><Check size={13} strokeWidth={3} />{f}</li>)}
                </ul>
                {!addon && <span className="choice__hint"><Plus size={14} /> Add for the full inside-and-out turnaround</span>}
              </button>
              <p className="book__hint">Optional — tap Continue to skip.</p>
            </div>
          )}

          {step === 2 && (
            <div className="cal">
              <div className="cal__head">
                <button type="button" onClick={() => setMonth((m) => subMonths(m, 1))} disabled={isSameMonth(month, today)} aria-label="Previous month"><ChevronLeft size={18} /></button>
                <strong>{format(month, 'MMMM yyyy')}</strong>
                <button type="button" onClick={() => setMonth((m) => addMonths(m, 1))} disabled={addMonths(month, 1) > lastDay} aria-label="Next month"><ChevronRight size={18} /></button>
              </div>
              <div className="cal__dow mono">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d}>{d}</span>)}</div>
              <div className="cal__grid">
                {days.map((d) => {
                  const key = format(d, 'yyyy-MM-dd')
                  const out = !isSameMonth(d, month)
                  const disabled = out || d < today || d > lastDay || !dayHasOpenSlot(key)
                  const on = date === key
                  return (
                    <button
                      type="button" key={key} disabled={disabled}
                      className={`cal__day ${on ? 'is-on' : ''} ${out ? 'is-out' : ''} ${key === format(today, 'yyyy-MM-dd') ? 'is-today' : ''}`}
                      onClick={() => { setDate(key); setTime(null) }}
                    >{format(d, 'd')}</button>
                  )
                })}
              </div>
              {date && <p className="cal__picked mono">Selected: {format(parseISO(date), 'EEEE, MMMM d')}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="times">
              <p className="times__date mono">{date && format(parseISO(date), 'EEEE, MMMM d, yyyy')}</p>
              {loadingSlots ? (
                <p className="times__loading"><Loader2 className="spin" size={18} /> Checking availability…</p>
              ) : (
                <div className="times__grid">
                  {slots.map((s) => {
                    const taken = booked.includes(s.label)
                    const disabled = s.past || taken
                    return (
                      <button type="button" key={s.min} disabled={disabled} className={`slot ${time === s.label ? 'is-on' : ''}`} onClick={() => setTime(s.label)}>
                        {s.label}{taken && <small>Booked</small>}
                      </button>
                    )
                  })}
                </div>
              )}
              {!loadingSlots && slots.every((s) => s.past || booked.includes(s.label)) && (
                <p className="book__hint">No open times on this day — go back and pick another date.</p>
              )}
            </div>
          )}

          {step === 4 && (
            <form className="info" onSubmit={(e) => { e.preventDefault(); next() }} noValidate>
              {FIELDS.map((f) => (
                <label key={f.key} className={`field ${errors[f.key] ? 'has-error' : ''} ${f.key === 'address' || f.key === 'vehicle' ? 'field--wide' : ''}`}>
                  <span className="field__label mono">{f.label}</span>
                  <input
                    ref={(el) => { inputRefs.current[f.key] = el }}
                    type={f.type} autoComplete={f.auto} placeholder={f.placeholder}
                    inputMode={f.type === 'tel' ? 'tel' : undefined}
                    value={info[f.key]}
                    onChange={(e) => {
                      const v = f.key === 'phone' ? formatPhone(e.target.value) : e.target.value
                      setInfo((s) => ({ ...s, [f.key]: v }))
                      if (errors[f.key]) setErrors((er) => ({ ...er, [f.key]: undefined }))
                    }}
                    aria-invalid={!!errors[f.key]}
                  />
                  {errors[f.key] && <span className="field__err">{errors[f.key]}</span>}
                </label>
              ))}
              <div className="info__recap">
                <span className="mono">Your detail</span>
                <p>{pkg?.name}{addon ? ` + ${ADDON.name}` : ''} · {date && format(parseISO(date), 'EEE, MMM d')} · {time}</p>
                <strong>${total}</strong>
              </div>
              <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
            </form>
          )}
        </div>

        <div className="book__bar">
          <div className="book__bar-inner">
            <button type="button" className="btn btn-ghost" onClick={back}><ArrowLeft size={17} /> Back</button>
            {serviceId && <span className="book__total mono">${total}</span>}
            <button type="button" className="btn btn-blade" onClick={next}>
              {step === 4 ? 'Checkout' : 'Continue'} <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
