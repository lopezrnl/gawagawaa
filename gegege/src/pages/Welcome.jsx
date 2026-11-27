import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRightIcon } from '../components/icons.jsx'
import { useToast } from '../state/contexts.js'

const ICEBREAKERS = [
  'If the sea could return one thing to you, what would you ask for?',
  'What color does your favorite memory feel like?',
  'Somewhere, a blank page is keeping your place.',
]

export default function Welcome({ onUnlock }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [icebreaker, setIcebreaker] = useState('')

  const enter = (event) => {
    event.preventDefault()
    if (password === 'trish28') {
      onUnlock()
      navigate('/app/story')
      return
    }

    setPassword('')
    setError(true)
    toast('That passphrase did not open the page.', 'error')
  }

  const shareAThought = () => {
    const next = ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)]
    setIcebreaker(next)
  }

  return (
    <main className="welcome-page">
      <div className="welcome-orbit welcome-orbit-one" aria-hidden="true" />
      <div className="welcome-orbit welcome-orbit-two" aria-hidden="true" />
      <span className="welcome-star welcome-star-one" aria-hidden="true">✦</span>
      <span className="welcome-star welcome-star-two" aria-hidden="true">✧</span>

      <div className="welcome-art welcome-art-left" aria-hidden="true">
        <div className="welcome-art-frame">
          <img src="/favicon.svg" alt="" />
        </div>
        <span className="mono">fig. 01 · the margin</span>
      </div>

      <section className={`welcome-card ${error ? 'has-error' : ''}`} aria-labelledby="welcome-title">
        <p className="welcome-eyebrow mono">
          <span /> a quiet place, kept for you
        </p>
        <h1 id="welcome-title">You found <em>Blank.</em></h1>
        <div className="welcome-rule" aria-hidden="true"><span>✦</span></div>
        <p className="welcome-copy">
          A little archive of stories, blue hours, and things worth keeping.
          Take a breath before you step inside.
        </p>

        <form className="welcome-form" onSubmit={enter}>
          <label className="mono" htmlFor="welcome-passcode">The page is waiting</label>
          <input
            id="welcome-passcode"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (error) setError(false)
            }}
            placeholder="Enter passphrase"
            autoComplete="current-password"
            aria-invalid={error}
            aria-describedby={error ? 'welcome-error' : undefined}
            autoFocus
          />
          {error && <p className="welcome-error mono" id="welcome-error">That is not quite the right tide.</p>}
          <button type="submit" className="btn btn-primary welcome-submit">
            <span>Enter the archive</span>
            <ArrowUpRightIcon />
          </button>
        </form>

        <button type="button" className="icebreaker-trigger" onClick={shareAThought}>
          <span aria-hidden="true">✧</span> {icebreaker ? 'Another small thought' : 'A small thought for the road'}
        </button>
        {icebreaker && <p className="icebreaker-note" role="status">“{icebreaker}”</p>}
      </section>

      <div className="welcome-art welcome-art-right" aria-hidden="true">
        <div className="welcome-art-frame welcome-art-frame-tall">
          <div className="welcome-mini-scene">
            <span className="mini-moon" />
            <span className="mini-horizon" />
            <span className="mini-water" />
          </div>
        </div>
        <span className="mono">fig. 02 · blue hour</span>
      </div>

      <p className="welcome-foot mono">PRIVATE STUDY · EST. IN THE BLUE</p>
    </main>
  )
}
