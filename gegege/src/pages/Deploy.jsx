import { Link } from 'react-router-dom'
import { useReveal } from '../lib/useReveal.js'

const FAVORITES = [
  { symbol: '🐧', label: 'Favorite animal', value: 'Penguins', note: 'A little awkward, very loyal, and always better in a pair.' },
  { symbol: '◉', label: 'Favorite color', value: 'Blue', note: 'The color of the sea, quiet mornings, and thoughts that linger.' },
  { symbol: '☁', label: 'Favorite feeling', value: 'A peaceful kind of quiet', note: 'The sort where nobody has to say anything to feel understood.' },
]
const PENGUINS = ['🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧', '🐧']

export default function Deploy() {
  useReveal()

  return (
    <div className="deploy-page about-her-page">
      <header className="page-heading" data-reveal>
        <p className="kicker"><span>01</span> A little about her</p>
        <h1>Small things<br /><em>that feel like her.</em></h1>
        <p className="lead">
          A few of her favorite things, gathered here like keepsakes. The kind
          of details that make a person feel a little more real.
        </p>
      </header>

      <section className="favorites-grid" aria-label="Her favorite things">
        {FAVORITES.map((favorite, index) => (
          <article className="favorite-card" data-reveal key={favorite.label}>
            <span className="favorite-symbol" aria-hidden="true">{favorite.symbol}</span>
            <p className="mono favorite-label">0{index + 1} / {favorite.label}</p>
            <h2>{favorite.value}</h2>
            <p>{favorite.note}</p>
          </article>
        ))}
      </section>

      <div className="penguin-parade" aria-label="A little parade of penguins">
        {PENGUINS.map((penguin, index) => (
          <span key={index} aria-hidden="true" style={{ '--penguin-index': index }}>{penguin}</span>
        ))}
      </div>

      <aside className="about-her-note" data-reveal>
        <span className="mono">A LITTLE DETAIL</span>
        <p>
          Maybe it is the penguins, maybe it is the blue — or maybe the best
          parts of someone are the little things you remember without trying.
        </p>
      </aside>

      <Link className="back-to-story" to="/app/story">← Back to the story</Link>
    </div>
  )
}
