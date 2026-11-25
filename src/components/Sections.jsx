import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, ArrowRight, Check, Plus, MapPin, ChevronDown, Star } from 'lucide-react'
import { BUSINESS, PACKAGES, ADDON, FAQS, REVIEWS, GOOGLE_RATING, GOOGLE_PROFILE_URL } from '../config'
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages'

// Sections shared by the home page and the SEO landing pages.

/* ─── Link chips to the landing pages ─── */
export function ServiceChips({ exclude, home = false }) {
  return (
    <ul className="area__list link-list">
      {home && <li className="is-home"><Link to="/">Mobile car detailing in {HOME_CITY}</Link></li>}
      {SERVICE_PAGES.filter((p) => p.path !== exclude).map((p) => (
        <li key={p.path}><Link to={p.path}>{p.nav}</Link></li>
      ))}
    </ul>
  )
}

export function AreaChips({ exclude, home = false }) {
  return (
    <ul className="area__list link-list">
      {home && <li className="is-home"><Link to="/#area"><MapPin size={14} />{HOME_CITY}</Link></li>}
      {CITY_PAGES.filter((p) => p.path !== exclude).map((p) => (
        <li key={p.path}><Link to={p.path}><MapPin size={14} />{p.city}</Link></li>
      ))}
    </ul>
  )
}

/* ─── Packages (light platinum section) ─── */
export function Packages({ eyebrow = '01 — The menu', title, showLinks = true }) {
  return (
    <section id="packages" className="packages">
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow mono">{eyebrow}</p>
          <h2>{title || <>Two packages. <span className="muted">One standard.</span></>}</h2>
          <p className="sec-head__sub">
            Pick the interior depth you need, then add the exterior if you want the full turnaround. Same price for
            any car, SUV, truck or minivan.
          </p>
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
              <div className="pk__foot mono">{p.features.length} steps · usually {p.duration}</div>
            </article>
          ))}
        </div>

        <article className="addon reveal">
          <div className="addon__label">
            <span className="addon__plus"><Plus size={20} strokeWidth={3} /></span>
            <div>
              <span className="mono addon__kicker">Add-on to either package</span>
              <h3>{ADDON.name} <em>+${ADDON.price}</em></h3>
            </div>
          </div>
          <ul className="addon__list">
            {ADDON.features.map((f) => <li key={f}><Check size={15} strokeWidth={3} />{f}</li>)}
          </ul>
        </article>

        {showLinks && (
          <div className="pk-links reveal">
            <span className="mono">Compare in detail</span>
            <ServiceChips />
          </div>
        )}

        <div className="packages__cta reveal">
          <Link to="/book" className="btn btn-dark btn-lg">Book now <ArrowRight size={18} /></Link>
          <span className="mono">Prepay online & save $15</span>
        </div>
      </div>
    </section>
  )
}

/* ─── Reviews (hidden while REVIEWS is empty) ─── */
export function Reviews() {
  if (!REVIEWS.length) return null
  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow mono">Reviews</p>
          <h2>What customers say.</h2>
          {GOOGLE_RATING && (
            <p className="sec-head__sub rev-rating">
              Rated {GOOGLE_RATING.value} out of 5 from {GOOGLE_RATING.count} reviews on{' '}
              <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">Google</a>.
            </p>
          )}
        </header>
        <div className="rev-grid">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rev reveal">
              <div className="rev__stars" aria-label="5 stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} />)}</div>
              <blockquote>{r.text}</blockquote>
              <figcaption className="mono">{r.name} · Google review</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─── */
export function Faq({ faqs = FAQS, eyebrow = '06 — Questions', title = 'Good to know.' }) {
  const [faqOpen, setFaqOpen] = useState(0)
  return (
    <section id="faq" className="faq">
      <div className="container faq__grid">
        <header className="sec-head reveal">
          <p className="eyebrow mono">{eyebrow}</p>
          <h2>{title}</h2>
        </header>
        <div className="faq__list">
          {faqs.map((f, i) => {
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
  )
}

/* ─── CTA band ─── */
export function CtaBand({ place }) {
  return (
    <section className="cta-band">
      <div className="cta-band__bg" style={{ backgroundImage: 'url(/images/foam-wash.webp)' }} aria-hidden="true" />
      <div className="container cta-band__inner reveal">
        <h2>Your car. {place ? `${place}.` : 'Your driveway.'}<br /><span className="gold-text">Our detail.</span></h2>
        <div className="cta-band__actions">
          <Link to="/book" className="btn btn-blade btn-lg">Book Online <ArrowRight size={18} /></Link>
          <a href={BUSINESS.phoneHref} className="btn btn-steel btn-lg"><Phone size={18} /> Call Now</a>
        </div>
      </div>
    </section>
  )
}
