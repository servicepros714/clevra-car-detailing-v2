import { Link } from 'react-router-dom'
import { Phone, ArrowRight, Check, MapPin } from 'lucide-react'
import { BUSINESS, PACKAGES, ADDON } from '../config'
import { Packages, Faq, CtaBand, ServiceChips, AreaChips } from '../components/Sections'
import useReveal from '../components/useReveal'

// One template for every SEO landing page in src/lib/pages.js.

const basic = PACKAGES.find((p) => p.id === 'basic')
const premium = PACKAGES.find((p) => p.id === 'premium')

// Hero price card: the Premium Detail, or 'combo' = Premium + Exterior Wash.
// The Exterior Wash is never shown as a product on its own.
function PriceCard({ page }) {
  const combo = page.card === 'combo'
  const name = combo ? `${premium.name} + ${ADDON.name}` : premium.name
  const price = combo ? premium.price + ADDON.price : premium.price
  const items = combo
    ? ['Everything in the Premium Detail', 'Full Interior Shampooing', 'Cloth & Carpet Extraction', 'Hand-Washed Exterior', 'Detailed Rim Cleaning', 'Spot-Free Hand Drying']
    : premium.features
  return (
    <aside className="pk pk--featured lp-card" aria-label={name}>
      <div className="pk__head">
        <span className="pk__tag mono">{combo ? 'Inside & out' : 'Most complete'}</span>
        <h2 className="lp-card__name">{name}</h2>
        <p>Same price for any vehicle.</p>
      </div>
      <div className="pk__price"><sup>$</sup>{price}</div>
      <ul className="pk__list">
        {items.map((f) => <li key={f}><Check size={16} strokeWidth={3} />{f}</li>)}
      </ul>
      <Link className="btn btn-blade btn-block btn-lg lp-card__btn" to="/book?service=premium">
        Book this detail <ArrowRight size={18} />
      </Link>
      <p className="lp-card__note mono">
        {combo
          ? `Or the ${basic.name} + wash for $${basic.price + ADDON.price}, or a detail alone from $${basic.price}.`
          : `Or the ${basic.name} for $${basic.price}. Prepay with code PREPAY to save $15.`}
      </p>
    </aside>
  )
}

// City / neighborhood pages: local areas + map.
function Local({ page }) {
  return (
    <section className="area">
      <div className="container area__grid">
        <div className="area__copy reveal">
          <p className="eyebrow mono">Service area</p>
          <h2>Where we work<br />in {page.city}.</h2>
          <p className="area__intro">
            We come to homes and workplaces across {page.city}. Not sure about your address? Call{' '}
            <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>.
          </p>
          <ul className="area__list">
            {page.areas.map((a) => <li key={a}><MapPin size={14} />{a.replace(/^the /, '')}</li>)}
          </ul>
        </div>
        <div className="area__map reveal">
          <iframe
            title={`Map of ${page.mapQuery}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(page.mapQuery)}&z=13&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default function Landing({ page }) {
  useReveal([page.path])
  const { intro } = page
  return (
    <>
      <section className="hero lp-hero">
        <div className="hero__brush" aria-hidden="true" />
        <div className="container lp-grid">
          <div className="hero__copy">
            <nav className="lp-crumbs mono" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.nav}</span>
            </nav>
            <p className="eyebrow mono">// {page.eyebrow}</p>
            <h1 className="hero__title lp-title">
              {page.h1[0]}<br /><span className="gold-text">{page.h1[1]}</span>
            </h1>
            <p className="hero__lede">{page.lede}</p>
            <div className="hero__actions">
              <Link to={`/book?service=${page.pkg}`} className="btn btn-blade btn-lg">Book Online <ArrowRight size={18} /></Link>
              <a href={BUSINESS.phoneHref} className="btn btn-steel btn-lg"><Phone size={18} /> {BUSINESS.phoneDisplay}</a>
            </div>
            <ul className="lp-facts mono">
              {page.facts.map((f) => <li key={f}><Check size={14} /> {f}</li>)}
            </ul>
          </div>
          <PriceCard page={page} />
        </div>
      </section>

      <section className="lp-intro">
        <div className="container lp-intro__grid">
          <div className="reveal">
            <h2>{intro.h2}</h2>
            {intro.paras.map((p) => <p key={p} className="lp-p">{p}</p>)}
          </div>
          <figure className="lp-photo reveal">
            <img src={page.photo.src} alt={page.photo.alt} loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="promise lp-points">
        <div className="container">
          <header className="sec-head reveal">
            <h2>{page.pointsTitle}</h2>
          </header>
          <div className="lp-points__grid">
            {page.points.map((pt, i) => (
              <div key={pt.title} className="tile reveal" style={{ '--d': `${i * 80}ms` }}>
                <h3>{pt.title}</h3>
                <p>{pt.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Packages eyebrow="The menu" title={<>Prices for <span className="muted">every visit.</span></>} showLinks={false} />

      {page.isCity && <Local page={page} />}

      <Faq faqs={page.faqs} eyebrow="Questions" title={page.isCity ? `${page.city} questions.` : `${page.nav} questions.`} />

      <section className="lp-related" aria-label="More from Clevra Car Detailing">
        <div className="container">
          <h2 className="lp-related__title">More detailing services</h2>
          <ServiceChips exclude={page.path} home />
          <h2 className="lp-related__title">Areas we serve</h2>
          <AreaChips exclude={page.path} home />
        </div>
      </section>

      <CtaBand place={page.city} />
    </>
  )
}
