import { Link } from 'react-router-dom'
import { ServiceChips } from '../components/Sections'

// Prerendered as dist/404.html, which Cloudflare Pages serves (with a 404 status) for unknown URLs.
export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container">
        <p className="eyebrow mono">Error 404</p>
        <h1>This lane is closed.</h1>
        <p>The page you are looking for does not exist. See our detailing services or book online.</p>
        <ServiceChips home />
        <Link to="/book" className="btn btn-blade">Book online</Link>
      </div>
    </section>
  )
}
