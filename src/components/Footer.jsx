import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { BUSINESS, PACKAGES, ADDON } from '../config'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <img src="/images/logo.webp" alt="Clevra Car Detailing Costa Mesa" className="footer__logo" loading="lazy" />
          <div className="footer__cols">
            <div>
              <h4 className="mono">Menu</h4>
              {PACKAGES.map((p) => <Link key={p.id} to="/#packages">{p.name} — ${p.price}</Link>)}
              <Link to="/#packages">{ADDON.name} — +${ADDON.price}</Link>
            </div>
            <div>
              <h4 className="mono">Explore</h4>
              <Link to="/#process">How it works</Link>
              <Link to="/#showroom">Showroom</Link>
              <Link to="/#area">Service area</Link>
              <Link to="/#faq">FAQ</Link>
            </div>
            <div>
              <h4 className="mono">Reach us</h4>
              <a href={BUSINESS.phoneHref}><Phone size={14} /> {BUSINESS.phoneDisplay}</a>
              <span><MapPin size={14} /> {BUSINESS.city}, {BUSINESS.region}</span>
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
