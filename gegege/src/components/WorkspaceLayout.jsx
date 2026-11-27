import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowUpRightIcon,
  FragmentIcon,
  GalleryIcon,
  LetterIcon,
  SearchIcon,
} from './icons.jsx'
import { useUI } from '../state/contexts.js'

const LINKS = [
  { to: '/app/story', label: 'The story', icon: <FragmentIcon /> },
  { to: '/app/dossier', label: 'Dossier', icon: <LetterIcon /> },
  { to: '/app/gallery', label: 'Gallery', icon: <GalleryIcon /> },
  { to: '/app/archive', label: 'Archive', icon: <ArrowUpRightIcon /> },
  { to: '/app/deploy', label: 'About', icon: <LetterIcon /> },
]

export default function WorkspaceLayout({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { openCommand } = useUI()

  useEffect(() => {
    // Dismiss the mobile drawer after route navigation (including history).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const logout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="workspace">
      <header className="workspace-mobilebar">
        <NavLink className="workspace-brand" to="/app/story">
          <span className="brand-mark">B</span>
          <span>blank</span>
        </NavLink>
        <button
          type="button"
          className={`workspace-menu-button ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="workspace-sidebar"
        >
          <span /><span />
        </button>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="workspace-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        id="workspace-sidebar"
        className={`workspace-sidebar ${menuOpen ? 'is-open' : ''}`}
      >
        <div className="workspace-brand-block">
          <NavLink className="workspace-brand" to="/app/story">
            <span className="brand-mark">B</span>
            <span>blank</span>
          </NavLink>
          <p className="mono">a private character study</p>
        </div>

        <div className="workspace-side-label mono">your space</div>
        <nav className="workspace-nav" aria-label="Main pages">
          {LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `workspace-nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              <span className="workspace-nav-dot" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <div className="workspace-sidebar-spacer" />

        <button className="workspace-search" type="button" onClick={() => {
          setMenuOpen(false)
          openCommand()
        }}>
          <SearchIcon />
          <span>Quick search</span>
          <kbd>⌘K</kbd>
        </button>

        <div className="workspace-sidebar-note">
          <span className="mono">a note to self</span>
          <p>Not every quiet thing is empty.</p>
        </div>

        <button type="button" className="workspace-logout" onClick={logout}>
          <span className="logout-glyph" aria-hidden="true">↗</span>
          Leave this space
        </button>
      </aside>

      <div className="workspace-main-wrap">
        <div className="workspace-topline">
          <span className="mono">THE BLUE HOUR ARCHIVE</span>
          <div className="workspace-top-actions">
            <button type="button" className="workspace-top-search" onClick={openCommand}>
              <SearchIcon /> <span>Search</span> <kbd>⌘K</kbd>
            </button>
            <span className="workspace-presence"><i /> saved in this browser</span>
          </div>
        </div>
        <main className="workspace-main" id="main">
          <Outlet />
          <footer className="workspace-footer">
            <span>Still being written.</span>
            <NavLink to="/app/deploy">About this little space ↗</NavLink>
          </footer>
        </main>
      </div>
    </div>
  )
}
