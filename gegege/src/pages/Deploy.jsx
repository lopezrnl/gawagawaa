import { Link } from 'react-router-dom'
import { ArrowUpRightIcon, CheckIcon } from '../components/icons.jsx'
import { useReveal } from '../lib/useReveal.js'

const CHECKS = [
  'Vite production build, ready to ship',
  'Vercel routing already configured',
  'No environment variables required',
  'Archive stays in each visitor’s browser',
]

export default function Deploy() {
  useReveal()

  return (
    <div className="deploy-page">
      <header className="page-heading" data-reveal>
        <p className="kicker"><span>01</span> About this little space</p>
        <h1>A page waiting<br /><em>for a home.</em></h1>
        <p className="lead">
          Blank is a small character study built to feel like a quiet place you
          can return to. Here is what is under the surface.
        </p>
      </header>

      <div className="deploy-page-grid">
        <section className="deploy-manifest" data-reveal>
          <p className="panel-title">The little details</p>
          <ul>
            {CHECKS.map((check) => <li key={check}><CheckIcon />{check}</li>)}
          </ul>
          <div className="deploy-tech">
            <span className="mono">BUILT WITH</span>
            <div><b>React</b><b>Vite</b><b>SVG</b><b>Vercel</b></div>
          </div>
        </section>

        <section className="deploy-card" data-reveal>
          <div className="deploy-card-head">
            <span className="mono">deployment slot</span>
            <span className="profile-status"><i /> READY</span>
          </div>
          <div className="deploy-card-body">
            <span className="vercel-badge"><span className="vercel-mark">▲</span></span>
            <h2>Ready to leave<br />the page.</h2>
            <p>Import this project into Vercel, keep the detected defaults, and let the story find a home.</p>
            <a className="btn btn-primary btn-wide" href="https://vercel.com/new" target="_blank" rel="noreferrer">
              Connect to Vercel <ArrowUpRightIcon />
            </a>
            <p className="mono deploy-config">vercel.json · vite · dist</p>
          </div>
        </section>
      </div>

      <div className="deploy-local-note" data-reveal>
        <span className="mono">A SMALL NOTE ABOUT PRIVACY</span>
        <p>
          The passphrase gate is a front-end welcome screen, not secure
          authentication. The archive is local to this browser and is not
          uploaded or shared.
        </p>
      </div>

      <Link className="back-to-story" to="/app/story">← Back to the story</Link>
    </div>
  )
}
