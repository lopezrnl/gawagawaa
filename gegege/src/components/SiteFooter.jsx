import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark brand-mark-small">B</span>
          <p>
            Blank — a character study in blue.
            <span className="mono footer-sub">Still being written.</span>
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/archive">Archive</Link>
          <Link to="/#gallery">Gallery</Link>
          <Link to="/#deploy">Deploy</Link>
        </nav>

        <div className="footer-meta">
          <span className="mono">React · Vite · Vercel-ready</span>
          <button
            type="button"
            className="footer-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
