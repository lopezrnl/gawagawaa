import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal.jsx'
import {
  CopyIcon,
  DownloadIcon,
  FragmentIcon,
  LetterIcon,
  PlusIcon,
  TrashIcon,
} from '../components/icons.jsx'
import { CHAPTER_EVENTS } from '../lib/studies.js'
import { downloadText, slugify } from '../lib/download.js'
import { useData, useToast, useUI } from '../state/contexts.js'
import { useReveal } from '../lib/useReveal.js'

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'undated' : DATE_FORMAT.format(date)
}

const countWords = (text) =>
  text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0

function Empty({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty-title">{title}</p>
      <p className="empty-text">{text}</p>
      {action}
    </div>
  )
}

export default function Archive() {
  const {
    letters,
    fragments,
    deleteLetter,
    deleteFragment,
  } = useData()
  const { openLetter, openFragment } = useUI()
  const toast = useToast()
  const [reading, setReading] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useReveal([letters.length, fragments.length])

  const timeline = useMemo(() => {
    const items = [
      ...CHAPTER_EVENTS.map((event) => ({ ...event, type: 'chapter' })),
      ...letters.map((letter) => ({
        id: letter.id,
        type: 'letter',
        title: letter.title,
        excerpt: letter.body.replace(/\s+/g, ' ').slice(0, 150),
        date: letter.createdAt,
      })),
      ...fragments.map((fragment) => ({
        id: fragment.id,
        type: 'fragment',
        title: fragment.text,
        excerpt: 'a loose line kept in the margin',
        date: fragment.createdAt,
      })),
    ]

    return items.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [letters, fragments])

  const totalWords = letters.reduce((sum, letter) => sum + countWords(letter.body), 0)

  const downloadLetters = () => {
    const text = [
      '# The Blank Archive — letters',
      '',
      ...letters.map((letter) => `## ${letter.title}\n\n${letter.body}\n\n_${formatDate(letter.createdAt)}_`),
    ].join('\n\n---\n\n')

    downloadText(text, 'blank-letters.md', 'text/markdown;charset=utf-8')
    toast('Letters downloaded as Markdown', 'success')
  }

  const downloadLetter = (letter) => {
    downloadText(
      `# ${letter.title}\n\n${letter.body}\n\n— Blank\n${formatDate(letter.createdAt)}`,
      `${slugify(letter.title)}.md`,
      'text/markdown;charset=utf-8',
    )
    toast('Letter downloaded', 'success')
  }

  const copyFragment = async (fragment) => {
    try {
      await navigator.clipboard.writeText(fragment.text)
      toast('Fragment copied', 'success')
    } catch {
      toast('Could not access the clipboard', 'error')
    }
  }

  const handleConfirm = () => {
    if (!confirm) return

    if (confirm.kind === 'letter') {
      deleteLetter(confirm.id)
      if (reading?.id === confirm.id) setReading(null)
      toast('Letter deleted')
    } else if (confirm.kind === 'fragment') {
      deleteFragment(confirm.id)
      toast('Fragment deleted')
    }

    setConfirm(null)
  }

  const confirmCopy =
    confirm?.kind === 'letter'
        ? `“${confirm.title}” will be removed from the archive. This cannot be undone.`
        : 'This fragment will be removed from the archive. This cannot be undone.'

  return (
    <div className="archive-page">
      <div className="container archive-shell archive-shell-single">
        <main className="archive-main">
          <header className="archive-hero" id="overview">
            <p className="kicker">
              <span>01</span> Overview
            </p>
            <h1>
              The margins
              <br />
              <em>of the story.</em>
            </h1>
            <p className="lead">
              A working archive for a girl who is still being written. Letters
              never sent, fragments that did not fit, and every date the tide
              bothered to return.
            </p>

            <div className="archive-actions">
              <button type="button" className="btn btn-primary" onClick={openLetter}>
                <LetterIcon /> Write a letter
              </button>
              <button type="button" className="btn btn-ghost" onClick={openFragment}>
                <FragmentIcon /> Add a fragment
              </button>
            </div>

            <div className="archive-stats">
              <div className="archive-stat">
                <span className="archive-stat-num">{String(letters.length).padStart(2, '0')}</span>
                <span className="mono">letters</span>
              </div>
              <div className="archive-stat">
                <span className="archive-stat-num">{String(fragments.length).padStart(2, '0')}</span>
                <span className="mono">fragments</span>
              </div>
              <div className="archive-stat">
                <span className="archive-stat-num">{String(totalWords).padStart(3, '0')}</span>
                <span className="mono">words kept</span>
              </div>
            </div>
          </header>

          <section id="timeline" className="archive-section" aria-labelledby="timeline-title">
            <header className="archive-section-head">
              <div>
                <p className="kicker">
                  <span>02</span> Timeline
                </p>
                <h2 id="timeline-title">Everything the tide returned</h2>
              </div>
              <span className="archive-meta mono">{timeline.length} entries</span>
            </header>

            <ol className="timeline">
              {timeline.map((item) => (
                <li className="timeline-item" key={`${item.type}-${item.id}`} data-reveal>
                  <span className="timeline-date mono">{formatDate(item.date)}</span>
                  <span className={`timeline-badge badge-${item.type} mono`}>
                    {item.type === 'chapter' ? 'story' : item.type}
                  </span>
                  <div className="timeline-body">
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="letters" className="archive-section" aria-labelledby="letters-title">
            <header className="archive-section-head">
              <div>
                <p className="kicker">
                  <span>03</span> Letters
                </p>
                <h2 id="letters-title">Letters never sent</h2>
              </div>
              <div className="archive-head-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={downloadLetters}
                  disabled={letters.length === 0}
                >
                  <DownloadIcon /> .md
                </button>
                <button type="button" className="btn btn-primary btn-small" onClick={openLetter}>
                  <PlusIcon /> New letter
                </button>
              </div>
            </header>

            {letters.length === 0 ? (
              <Empty
                icon={<LetterIcon />}
                title="No letters yet."
                text="She has never received one that was actually sent. Yours could be the first."
                action={
                  <button type="button" className="btn btn-primary btn-small" onClick={openLetter}>
                    <PlusIcon /> Write a letter
                  </button>
                }
              />
            ) : (
              <div className="letter-grid">
                {letters.map((letter) => (
                  <article className="letter-card" key={letter.id} data-reveal>
                    <button
                      type="button"
                      className="letter-open"
                      onClick={() => setReading(letter)}
                    >
                      <span className="letter-date mono">{formatDate(letter.createdAt)}</span>
                      <h3>{letter.title}</h3>
                      <span className="letter-excerpt">{letter.body}</span>
                      <span className="letter-more mono">read letter →</span>
                    </button>

                    <button
                      type="button"
                      className="icon-btn letter-del"
                      onClick={() =>
                        setConfirm({ kind: 'letter', id: letter.id, title: letter.title })
                      }
                      aria-label={`Delete ${letter.title}`}
                      title="Delete letter"
                    >
                      <TrashIcon />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section id="fragments" className="archive-section" aria-labelledby="fragments-title">
            <header className="archive-section-head">
              <div>
                <p className="kicker">
                  <span>04</span> Fragments
                </p>
                <h2 id="fragments-title">Lines from the margin</h2>
              </div>
              <button type="button" className="btn btn-ghost btn-small" onClick={openFragment}>
                <PlusIcon /> Add
              </button>
            </header>

            {fragments.length === 0 ? (
              <Empty
                icon={<FragmentIcon />}
                title="The margin is blank."
                text="A fragment is a line that does not need a paragraph around it."
                action={
                  <button type="button" className="btn btn-primary btn-small" onClick={openFragment}>
                    <PlusIcon /> Add a fragment
                  </button>
                }
              />
            ) : (
              <div className="fragment-grid">
                {fragments.map((fragment) => (
                  <figure className="fragment-card" key={fragment.id} data-reveal>
                    <blockquote>{fragment.text}</blockquote>
                    <figcaption>
                      <span className="mono">{formatDate(fragment.createdAt)}</span>
                      <span className="fragment-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => copyFragment(fragment)}
                          aria-label="Copy fragment"
                          title="Copy"
                        >
                          <CopyIcon />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn-danger"
                          onClick={() =>
                            setConfirm({ kind: 'fragment', id: fragment.id, title: 'fragment' })
                          }
                          aria-label="Delete fragment"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>

          <p className="archive-foot-note mono">
            Want to keep it? <Link to="/app/deploy">About her</Link> and the archive goes with it.
          </p>
        </main>
      </div>

      <Modal
        open={Boolean(reading)}
        onClose={() => setReading(null)}
        title={reading?.title}
        subtitle={reading ? formatDate(reading.createdAt) : ''}
        size="md"
        footer={
          reading ? (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => downloadLetter(reading)}
              >
                <DownloadIcon /> Download .md
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setConfirm({ kind: 'letter', id: reading.id, title: reading.title })}
              >
                <TrashIcon /> Delete
              </button>
            </>
          ) : null
        }
      >
        {reading && (
          <div className="letter-read">
            {reading.body.split(/\n{2,}/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p className="letter-sign">— Blank</p>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title="Remove this entry?"
        subtitle="this cannot be undone"
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost btn-small" onClick={() => setConfirm(null)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger btn-small" onClick={handleConfirm}>
              Remove
            </button>
          </>
        }
      >
        <p className="confirm-text">{confirmCopy}</p>
      </Modal>
    </div>
  )
}
