import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Phone, Menu, X, Clock, MapPin, ArrowUpRight } from 'lucide-react'
import { BUSINESS, REVIEWS } from '../config'

const LINKS = [
  { to: '/#packages', label: 'Packages' },
  { to: '/#process', label: 'Process' },
  { to: '/#showroom', label: 'Showroom' },
  { to: '/#area', label: 'Service Area' },
  ...(REVIEWS.length ? [{ to: '/#reviews', label: 'Reviews' }] : []),
  { to: '/#faq', label: 'FAQ' },
]

export default function Navbar({ minimal }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false) }, [loc.pathname, loc.hash])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  if (minimal) {
    return (
      <header className="nav nav--flow">
        <div className="container nav__flow-inner">
          <Link to="/" className="nav__logo" aria-label="Clevra home"><img src="/images/logo.webp" alt="Clevra Car Detailing Costa Mesa" /></Link>
          <a href={BUSINESS.phoneHref} className="nav__flow-phone"><Phone size={15} /> <span>{BUSINESS.phoneDisplay}</span></a>
        </div>
      </header>
    )
  }

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__strip">
        <div className="container nav__strip-inner">
          <span><MapPin size={13} /> Mobile · {BUSINESS.city}, {BUSINESS.region}</span>
          <span><Clock size={13} /> {BUSINESS.hours}</span>
          <a href={BUSINESS.phoneHref}><Phone size={13} /> {BUSINESS.phoneDisplay}</a>
        </div>
      </div>
      <div className="container nav__bar">
        <Link to="/" className="nav__logo" aria-label="Clevra home">
          <img src="/images/logo.webp" alt="Clevra Car Detailing Costa Mesa" />
        </Link>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
        </nav>
        <Link to="/book" className="btn btn-blade nav__cta">Book Online <ArrowUpRight size={16} /></Link>
        <button className="nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
        <nav className="drawer__links">
          {LINKS.map((l, i) => (
            <Link key={l.to} to={l.to} style={{ '--i': i }}><span className="mono">0{i + 1}</span>{l.label}</Link>
          ))}
        </nav>
        <div className="drawer__meta">
          <span><Clock size={14} /> {BUSINESS.hours}</span>
          <span><MapPin size={14} /> Serving {BUSINESS.city} & nearby</span>
        </div>
        <div className="drawer__actions">
          <a href={BUSINESS.phoneHref} className="btn btn-steel"><Phone size={17} /> Call Now</a>
          <Link to="/book" className="btn btn-blade">Book Online</Link>
        </div>
      </div>
    </header>
  )
}
