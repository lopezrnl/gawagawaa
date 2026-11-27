import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUI } from '../state/contexts.js'
import { LetterIcon, SearchIcon } from './icons.jsx'

const SECTION_LINKS = [
  { to: '/#story', label: 'Story' },
  { to: '/#dossier', label: 'Dossier' },
  { to: '/#traits', label: 'Traits' },
  { to: '/#gallery', label: 'Gallery' },
]

export default function SiteNav() {
  const { openCommand, openLetter } = useUI()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    // Close the mobile menu whenever navigation changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`
      }
      if (navRef.current) {
        navRef.current.classList.toggle('is-scrolled', window.scrollY > 24)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const isArchive = location.pathname === '/archive'

  const closeThen = (action) => {
    setMenuOpen(false)
    action()
  }

  return (
    <header className="nav" ref={navRef}>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />

      <div className="container nav-inner">
        <Link className="brand" to="/" aria-label="Blank, back home">
          <span className="brand-mark">B</span>
          <span className="brand-word">blank</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {SECTION_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          <Link
            className={`nav-page-link ${isArchive ? 'is-active' : ''}`}
            to="/archive"
            aria-current={isArchive ? 'page' : undefined}
          >
            Archive
            <span className="nav-new mono" aria-hidden="true">
              new
            </span>
          </Link>
        </nav>

        <div className="nav-tools">
          <button
            type="button"
            className="nav-search"
            onClick={openCommand}
            aria-label="Open command palette"
          >
            <SearchIcon />
            <span className="nav-search-label">Search</span>
            <kbd>⌘K</kbd>
          </button>

          <button
            type="button"
            className="btn btn-small btn-primary nav-write"
            onClick={openLetter}
          >
            <LetterIcon />
            <span>Write</span>
          </button>

          <button
            type="button"
            className={`nav-burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-sheet" id="mobile-menu">
          <nav className="nav-sheet-links" aria-label="Mobile">
            {SECTION_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to="/archive" onClick={() => setMenuOpen(false)}>
              Archive <span className="mono">new</span>
            </Link>
          </nav>

          <div className="nav-sheet-actions">
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={() => closeThen(openLetter)}
            >
              <LetterIcon /> Write a letter
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => closeThen(openCommand)}
            >
              <SearchIcon /> Commands
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
