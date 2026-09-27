import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone, ArrowRight, Check, Plus, CalendarDays, Truck, Sparkles, KeyRound,
  ShieldCheck, Droplets, Clock3, BadgeDollarSign, MapPin, ChevronDown, X, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { BUSINESS, PACKAGES, ADDON } from '../config'
import useReveal from '../components/useReveal'

const TICKER = ['Triple-Stage Vacuuming', 'Cloth & Carpet Extraction', 'Full Interior Shampooing', 'UV-Protectant Coating', 'Hand-Washed Exterior', 'Spot-Free Hand Drying', 'Detailed Rim Cleaning', 'Premium Tire Shine']

const STEPS = [
  { icon: CalendarDays, title: 'Pick your slot', text: 'Choose a package and a 30-minute arrival window online — any day of the week.' },
  { icon: Truck, title: 'We roll up', text: 'We arrive at your home or office in Costa Mesa with everything we need.' },
  { icon: Sparkles, title: 'We detail', text: 'Vacuum, extract, shampoo, protect — package by package, panel by panel.' },
  { icon: KeyRound, title: 'Keys back', text: 'Walk out to a car that looks and smells like it just left the showroom.' },
]

const GALLERY = [
  { src: 'black-sedan', alt: 'Black sedan with a deep gloss finish', cap: 'Mirror-gloss finish', cls: 'g-tall' },
  { src: 'interior-brush', alt: 'Detailer brushing foam into a center console', cap: 'Console foam & brush' },
  { src: 'seat-extraction', alt: 'Upholstery extraction tool on a cloth seat', cap: 'Seat extraction' },
  { src: 'headlight-restoration', alt: 'Headlight before and after cleaning', cap: 'Before / after', cls: 'g-tall' },
  { src: 'foam-wash', alt: 'Yellow car covered in snow foam', cap: 'Snow-foam hand wash', cls: 'g-wide' },
  { src: 'blue-gloss', alt: 'Blue car with reflective paint under studio lights', cap: 'Studio reflection' },
]

const PROMISES = [
  { icon: ShieldCheck, title: 'Walk-around check', text: 'We go over the car with you before we pack up. Missed spot? We fix it on the spot.' },
  { icon: BadgeDollarSign, title: 'Flat, posted prices', text: '$150 or $200 — plus $50 if you add the exterior. No surprise upcharges at the curb.' },
  { icon: Droplets, title: 'Self-sufficient setup', text: 'We bring the tools and supplies. You just need a spot where we can park and work.' },
  { icon: Clock3, title: 'Seven days a week', text: 'Weekday lunch break or Sunday morning — book whatever slot suits your schedule.' },
]

const FAQ = [
  { q: 'Do you come to me?', a: `Yes — Clevra is fully mobile. We detail at your home, office or apartment across ${BUSINESS.city} and the surrounding cities listed above.` },
  { q: 'What is the difference between Basic and Premium?', a: 'Basic is an interior refresh: triple-stage vacuum, full surface wipe-down and floor mat restoration. Premium adds dust elimination, interior glass, deep carpet cleaning, cloth & carpet extraction, full shampoo and a UV-protectant coating.' },
  { q: 'Is the exterior included?', a: `Both packages focus on the interior. Add the ${ADDON.name} for +$${ADDON.price} during booking for a hand wash, rims, tires, door jambs and a spot-free hand dry.` },
  { q: 'Do I have to pay online?', a: 'No. You can prepay online and save $15 with code PREPAY, or choose “pay later” and settle up when the job is done.' },
  { q: 'How do I reschedule?', a: `Just call or text ${BUSINESS.phoneDisplay} and we will move your appointment to a new slot.` },
]

function Lightbox({ index, onClose, onMove }) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onMove(1); if (e.key === 'ArrowLeft') onMove(-1) }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose, onMove])
  const g = GALLERY[index]
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={g.cap} onClick={onClose}>
      <button className="lightbox__close" aria-label="Close" onClick={onClose}><X /></button>
      <button className="lightbox__nav lightbox__nav--l" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onMove(-1) }}><ChevronLeft /></button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={`/images/${g.src}.webp`} alt={g.alt} />
        <figcaption className="mono">{String(index + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')} — {g.cap}</figcaption>
      </figure>
      <button className="lightbox__nav lightbox__nav--r" aria-label="Next" onClick={(e) => { e.stopPropagation(); onMove(1) }}><ChevronRight /></button>
    </div>
  )
}

export default function Home() {
  useReveal()
  const [faqOpen, setFaqOpen] = useState(0)
  const [lb, setLb] = useState(null)

  return (
    <>
      {/* ── HERO: split with shield-cut photo ── */}
      <section id="hero" className="hero">
        <div className="hero__brush" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow mono">// Mobile car detailing · {BUSINESS.city}, CA</p>
            <h1 className="hero__title">
              Showroom shine,<br /><span className="gold-text">delivered</span> to your driveway.
            </h1>
            <p className="hero__lede">
              Clevra brings deep interior detailing and hand-wash exteriors to your home or office — booked online in under a minute.
            </p>
            <div className="hero__actions">
              <Link to="/book" className="btn btn-blade btn-lg">Book Online <ArrowRight size={18} /></Link>
              <a href={BUSINESS.phoneHref} className="btn btn-steel btn-lg"><Phone size={18} /> {BUSINESS.phoneDisplay}</a>
            </div>
            <dl className="hero__specs">
              <div><dt className="mono">From</dt><dd>$150</dd></div>
              <div><dt className="mono">Open</dt><dd>7 days</dd></div>
              <div><dt className="mono">Setup</dt><dd>We come to you</dd></div>
            </dl>
          </div>
          <div className="hero__visual">
            <div className="shield">
              <img src="/images/black-sedan.webp" alt="Freshly detailed black sedan with a mirror finish" loading="eager" />
            </div>
            <div className="hero__chip hero__chip--a mono"><Check size={14} /> Hand finished</div>
            <div className="hero__chip hero__chip--b mono"><MapPin size={14} /> Costa Mesa</div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...TICKER, ...TICKER].map((t, i) => <span key={i} className="mono">{t}<i>◆</i></span>)}
        </div>
      </div>

      {/* ── PACKAGES (light platinum section) ── */}
      <section id="packages" className="packages">
        <div className="container">
          <header className="sec-head reveal">
            <p className="eyebrow mono">01 — The menu</p>
            <h2>Two packages. <span className="muted">One standard.</span></h2>
            <p className="sec-head__sub">Pick the interior depth you need, then add the exterior if you want the full turnaround.</p>
          </header>

          <div className="pk-grid">
            {PACKAGES.map((p, i) => (
              <article key={p.id} className={`pk reveal ${p.featured ? 'pk--featured' : ''}`} style={{ '--d': `${i * 90}ms` }}>
                <div className="pk__head">
                  <span className="pk__tag mono">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                </div>
                <div className="pk__price"><sup>$</sup>{p.price}</div>
                <ul className="pk__list">
                  {p.features.map((f) => <li key={f}><Check size={16} strokeWidth={3} />{f}</li>)}
                </ul>
                <div className="pk__foot mono">{p.features.length} steps · interior</div>
              </article>
            ))}
          </div>

          <article className="addon reveal">
            <div className="addon__label">
              <span className="addon__plus"><Plus size={20} strokeWidth={3} /></span>
              <div>
                <span className="mono addon__kicker">Optional add-on</span>
                <h3>{ADDON.name} <em>+${ADDON.price}</em></h3>
              </div>
            </div>
            <ul className="addon__list">
              {ADDON.features.map((f) => <li key={f}><Check size={15} strokeWidth={3} />{f}</li>)}
            </ul>
          </article>

          <div className="packages__cta reveal">
            <Link to="/book" className="btn btn-dark btn-lg">Book now <ArrowRight size={18} /></Link>
            <span className="mono">Prepay online & save $15</span>
          </div>
        </div>
      </section>

      {/* ── PROCESS: horizontal rail ── */}
      <section id="process" className="process">
        <div className="container">
          <header className="sec-head sec-head--row reveal">
            <div>
              <p className="eyebrow mono">02 — How it works</p>
              <h2>From booking<br />to keys back.</h2>
            </div>
            <img src="/images/interior-brush.webp" alt="Detailer working foam into a console with a brush" className="process__img" loading="lazy" />
          </header>
          <ol className="rail">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rail__item reveal" style={{ '--d': `${i * 110}ms` }}>
                <span className="rail__num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="rail__icon"><s.icon size={22} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── SHOWROOM (bento gallery + lightbox) ── */}
      <section id="showroom" className="showroom">
        <div className="container">
          <header className="sec-head reveal">
            <p className="eyebrow mono">03 — Showroom</p>
            <h2>The finish speaks.</h2>
          </header>
          <div className="bento">
            {GALLERY.map((g, i) => (
              <button key={g.src} className={`bento__cell reveal ${g.cls || ''}`} style={{ '--d': `${(i % 3) * 80}ms` }} onClick={() => setLb(i)} aria-label={`Open photo: ${g.cap}`}>
                <img src={`/images/${g.src}.webp`} alt={g.alt} loading="lazy" />
                <span className="bento__cap mono">{String(i + 1).padStart(2, '0')} · {g.cap}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {lb !== null && (
        <Lightbox index={lb} onClose={() => setLb(null)} onMove={(d) => setLb((v) => (v + d + GALLERY.length) % GALLERY.length)} />
      )}

      {/* ── PROMISE ── */}
      <section className="promise">
        <div className="container promise__grid">
          <div className="promise__intro reveal">
            <p className="eyebrow mono">04 — The Clevra standard</p>
            <h2>Detailing you can <span className="gold-text">hold us to.</span></h2>
            <img src="/images/seat-extraction.webp" alt="Extraction tool lifting dirt from a cloth seat" loading="lazy" />
          </div>
          <div className="promise__tiles">
            {PROMISES.map((p, i) => (
              <div key={p.title} className="tile reveal" style={{ '--d': `${i * 80}ms` }}>
                <p.icon size={24} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA + MAP ── */}
      <section id="area" className="area">
        <div className="container area__grid">
          <div className="area__copy reveal">
            <p className="eyebrow mono">05 — Service area</p>
            <h2>Based in {BUSINESS.city}.<br />Detailing all around it.</h2>
            <ul className="area__list">
              {BUSINESS.serviceArea.map((c) => <li key={c}><MapPin size={14} />{c}</li>)}
            </ul>
            <p className="area__note">Not on the list? Call {BUSINESS.phoneDisplay} — we can usually make it work.</p>
          </div>
          <div className="area__map reveal">
            <iframe
              title="Clevra Car Detailing service area map"
              src={`https://www.google.com/maps?q=${BUSINESS.mapQuery}&z=12&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="faq">
        <div className="container faq__grid">
          <header className="sec-head reveal">
            <p className="eyebrow mono">06 — Questions</p>
            <h2>Good to know.</h2>
          </header>
          <div className="faq__list">
            {FAQ.map((f, i) => {
              const open = faqOpen === i
              return (
                <div key={f.q} className={`faq__item reveal ${open ? 'is-open' : ''}`}>
                  <button className="faq__q" aria-expanded={open} onClick={() => setFaqOpen(open ? -1 : i)}>
                    <span>{f.q}</span><ChevronDown size={20} />
                  </button>
                  <div className="faq__a"><div><p>{f.a}</p></div></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="cta-band">
        <div className="cta-band__bg" style={{ backgroundImage: 'url(/images/foam-wash.webp)' }} aria-hidden="true" />
        <div className="container cta-band__inner reveal">
          <h2>Your car. Your driveway.<br /><span className="gold-text">Our detail.</span></h2>
          <div className="cta-band__actions">
            <Link to="/book" className="btn btn-blade btn-lg">Book Online <ArrowRight size={18} /></Link>
            <a href={BUSINESS.phoneHref} className="btn btn-steel btn-lg"><Phone size={18} /> Call Now</a>
          </div>
        </div>
      </section>
    </>
  )
}
