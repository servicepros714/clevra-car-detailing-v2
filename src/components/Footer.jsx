import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { BUSINESS, REVIEWS } from '../config'
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <img src="/images/logo.webp" alt="Clevra Car Detailing Costa Mesa" className="footer__logo" loading="lazy" />
          <div className="footer__cols">
            <div>
              <h4 className="mono">Services</h4>
              {SERVICE_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.nav}</Link>)}
            </div>
            <div>
              <h4 className="mono">Areas</h4>
              <Link to="/">{HOME_CITY}</Link>
              {CITY_PAGES.map((p) => <Link key={p.path} to={p.path}>{p.city}</Link>)}
            </div>
            <div>
              <h4 className="mono">Explore</h4>
              <Link to="/#process">How it works</Link>
              <Link to="/#showroom">Showroom</Link>
              <Link to="/#area">Service area</Link>
              {REVIEWS.length > 0 && <Link to="/#reviews">Reviews</Link>}
              <Link to="/#faq">FAQ</Link>
            </div>
            <div>
              <h4 className="mono">Reach us</h4>
              <a href={BUSINESS.phoneHref}><Phone size={14} /> {BUSINESS.phoneDisplay}</a>
              <span><MapPin size={14} /> {BUSINESS.city}, {BUSINESS.region} — we come to you</span>
              <span><Clock size={14} /> {BUSINESS.hours}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__word" aria-hidden="true">CLEVRA</div>
      <div className="footer__base">
        <div className="container footer__base-inner">
          <span>© {year} {BUSINESS.name}. All rights reserved.</span>
          <Link to="/book" className="footer__book">Book your detail →</Link>
        </div>
      </div>
    </footer>
  )
}
