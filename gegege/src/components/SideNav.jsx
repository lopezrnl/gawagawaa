import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DownloadIcon, FragmentIcon, LetterIcon } from './icons.jsx'
import { useData, useToast, useUI } from '../state/contexts.js'

export default function SideNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')
  const { openLetter, openFragment } = useUI()
  const { exportArchive } = useData()
  const toast = useToast()

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean)

    if (nodes.length === 0 || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-120px 0px -62% 0px', threshold: 0 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [sections])

  return (
    <aside className="archive-side">
      <div className="side-top">
        <p className="side-label mono">the archive</p>
        <span className="side-count mono">{sections.length} sections</span>
      </div>

      <nav className="side-nav" aria-label="Archive sections">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={active === section.id ? 'is-active' : ''}
            onClick={() => setActive(section.id)}
          >
            <span className="side-num mono">{section.num}</span>
            <span className="side-text">{section.label}</span>
            <span className="side-dot" aria-hidden="true" />
          </a>
        ))}
      </nav>

      <div className="side-actions">
        <p className="side-label mono">actions</p>
        <button type="button" onClick={openLetter}>
          <LetterIcon /> Write a letter
        </button>
        <button type="button" onClick={openFragment}>
          <FragmentIcon /> Add a fragment
        </button>
        <button
          type="button"
          onClick={() => {
            exportArchive()
            toast('Archive exported as JSON', 'success')
          }}
        >
          <DownloadIcon /> Export archive
        </button>
      </div>

      <div className="side-card">
        <p className="mono">local-first</p>
        <p>
          Everything here lives in this browser. Export it before you clear site
          data.
        </p>
      </div>

      <Link className="side-back" to="/">
        ← Back to the study
      </Link>
    </aside>
  )
}
