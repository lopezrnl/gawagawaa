import { Link } from 'react-router-dom'
import { PortraitArt } from '../art.jsx'
import { ArrowUpRightIcon } from '../components/icons.jsx'
import { useReveal } from '../lib/useReveal.js'

const CHAPTERS = [
  {
    n: '01',
    title: 'The White Room',
    date: 'the beginning',
    text: 'She woke on a page with no ink on it. The room was white, the window was white, and the only blue in the world was the vein at her wrist. She counted it until someone finally wrote her name in the corner — and then crossed it out.',
  },
  {
    n: '02',
    title: 'The First Tide',
    date: 'what came back',
    text: 'The sea found her before anyone else did. It climbed the stairs, filled the hallway, and left a small silver fish in her palm. She has kept it in a glass of water ever since, and it has never once needed to breathe.',
  },
  {
    n: '03',
    title: 'The Unwritten',
    date: 'still unfolding',
    text: 'Now she lives at the edge of the page, where the ink runs out. She is not waiting to be finished. She is deciding, slowly, what she would like to become — and the blue is patient with her.',
  },
]

export default function Home() {
  useReveal()

  return (
    <div className="story-page">
      <section className="story-hero">
        <div className="story-hero-copy" data-reveal>
          <p className="kicker"><span>01</span> A story in blue</p>
          <h1>She is still<br /><em>becoming.</em></h1>
          <p className="lead">
            Blank was found on an empty page — a name-shaped absence the tide
            kept returning. This is the story so far.
          </p>
          <div className="story-hero-actions">
            <a className="btn btn-primary" href="#chapters">Read the chapters</a>
            <Link className="btn btn-ghost" to="/app/dossier">Meet Blank <ArrowUpRightIcon /></Link>
          </div>
          <div className="story-meta mono">
            <span><i /> SUBJECT 000</span>
            <span>STATUS · UNWRITTEN</span>
          </div>
        </div>
        <div className="story-hero-art" data-reveal>
          <div className="story-art-orbit" aria-hidden="true" />
          <div className="story-art-frame" data-art-id="story-portrait">
            <PortraitArt />
            <span className="story-art-label mono">fig. 01 · the girl in the margin</span>
          </div>
          <span className="story-art-note mono">SALT / PAPER / TIDE</span>
        </div>
      </section>

      <section className="story-intro">
        <p className="story-intro-mark" aria-hidden="true">“</p>
        <p>I am not empty.<br /><em>I am waiting.</em></p>
        <span className="mono">— a note found in the margin</span>
      </section>

      <section className="chapter-page" id="chapters" aria-labelledby="chapters-title">
        <header className="page-heading" data-reveal>
          <p className="kicker"><span>02</span> Three chapters, so far</p>
          <h2 id="chapters-title">The story keeps<br /><em>its own time.</em></h2>
          <p className="lead">Nothing here is finished. The tide is still deciding what to leave behind.</p>
        </header>

        <ol className="chapter-list">
          {CHAPTERS.map((chapter) => (
            <li className="story-chapter" key={chapter.n} data-reveal>
              <span className="story-chapter-num">{chapter.n}</span>
              <div className="story-chapter-copy">
                <p className="mono">{chapter.date}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
              </div>
              <span className="chapter-spark" aria-hidden="true">✦</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="story-next" data-reveal>
        <div>
          <p className="kicker"><span>03</span> Between the lines</p>
          <h2>There is more<br />than the story.</h2>
          <p className="lead">A dossier, little studies in blue, and the things collected along the way.</p>
        </div>
        <div className="story-next-links">
          <Link to="/app/dossier"><span className="mono">01</span> The file on Blank <ArrowUpRightIcon /></Link>
          <Link to="/app/gallery"><span className="mono">02</span> Studies in blue <ArrowUpRightIcon /></Link>
          <Link to="/app/archive"><span className="mono">03</span> The open archive <ArrowUpRightIcon /></Link>
        </div>
      </section>
    </div>
  )
}
