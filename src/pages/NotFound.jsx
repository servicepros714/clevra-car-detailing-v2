import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container">
        <p className="eyebrow mono">Error 404</p>
        <h1>This lane is closed.</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-blade">Back to home</Link>
      </div>
    </section>
  )
}
