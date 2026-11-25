import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileActionBar from './components/MobileActionBar'
import Home from './pages/Home'
import Book from './pages/Book'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Seo from './components/Seo'
import { LANDING_PAGES } from './lib/pages'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60); return }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const flow = ['/book', '/checkout', '/confirmation'].includes(pathname)
  return (
    <>
      <ScrollToTop />
      <Seo />
      <Navbar minimal={flow} />
      <main className={flow ? 'flow-main' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          {LANDING_PAGES.map((page) => (
            <Route key={page.path} path={page.path} element={<Landing page={page} />} />
          ))}
          <Route path="/book" element={<Book />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!flow && <Footer />}
      {!flow && <MobileActionBar />}
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: '#1e2126', color: '#e6e8eb', border: '1px solid #3a3f47', fontFamily: 'Manrope, sans-serif' } }}
      />
    </>
  )
}
