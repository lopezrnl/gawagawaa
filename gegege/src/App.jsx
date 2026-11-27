import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CommandPalette from './components/CommandPalette.jsx'
import FragmentComposer from './components/FragmentComposer.jsx'
import LetterComposer from './components/LetterComposer.jsx'
import UploadModal from './components/UploadModal.jsx'
import WorkspaceLayout from './components/WorkspaceLayout.jsx'
import Archive from './pages/Archive.jsx'
import Deploy from './pages/Deploy.jsx'
import Dossier from './pages/Dossier.jsx'
import Gallery from './components/Gallery.jsx'
import Story from './pages/Home.jsx'
import Welcome from './pages/Welcome.jsx'
import './App.css'

const ACCESS_KEY = 'blank:private-space:unlocked'

const TITLES = {
  '/': 'A quiet place, kept for you — Blank',
  '/app/story': 'The Story — Blank',
  '/app/dossier': 'The Dossier — Blank',
  '/app/gallery': 'Studies in Blue — Blank',
  '/app/archive': 'The Archive — Blank',
  '/app/deploy': 'About this Space — Blank',
}

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1))
        if (!target) return
        const reduce =
          document.documentElement.classList.contains('reduce-motion') ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      }, 90)
      return () => window.clearTimeout(timer)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return undefined
  }, [pathname, hash])

  return null
}

export default function App() {
  const location = useLocation()
  const glowRef = useRef(null)
  const [hasAccess, setHasAccess] = useState(() => {
    try {
      return sessionStorage.getItem(ACCESS_KEY) === 'yes'
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.title = TITLES[location.pathname] ?? 'Blank'
  }, [location.pathname])

  useEffect(() => {
    const glow = glowRef.current
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return undefined

    const onMove = (event) => {
      glow.style.transform = `translate3d(${event.clientX - 280}px, ${event.clientY - 280}px, 0)`
      glow.classList.add('is-on')
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const unlock = () => {
    try {
      sessionStorage.setItem(ACCESS_KEY, 'yes')
    } catch {
      /* session storage may be unavailable */
    }
    setHasAccess(true)
  }

  const logout = () => {
    try {
      sessionStorage.removeItem(ACCESS_KEY)
    } catch {
      /* session storage may be unavailable */
    }
    setHasAccess(false)
  }

  return (
    <div className="page">
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />

      <Routes>
        <Route path="/" element={hasAccess ? <Navigate to="/app/story" replace /> : <Welcome onUnlock={unlock} />} />
        <Route path="/app" element={hasAccess ? <WorkspaceLayout onLogout={logout} /> : <Navigate to="/" replace />}>
          <Route index element={<Navigate to="story" replace />} />
          <Route path="story" element={<Story />} />
          <Route path="dossier" element={<Dossier />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="archive" element={<Archive />} />
          <Route path="deploy" element={<Deploy />} />
        </Route>
        <Route path="*" element={<Navigate to={hasAccess ? '/app/story' : '/'} replace />} />
      </Routes>

      {hasAccess && (
        <>
          <CommandPalette />
          <LetterComposer />
          <FragmentComposer />
          <UploadModal />
        </>
      )}
    </div>
  )
}
