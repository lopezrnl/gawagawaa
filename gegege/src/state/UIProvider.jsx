import { useCallback, useEffect, useMemo, useState } from 'react'
import { UIContext } from './contexts.js'

export default function UIProvider({ children }) {
  const [commandOpen, setCommandOpen] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const [fragmentOpen, setFragmentOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const openCommand = useCallback(() => setCommandOpen(true), [])
  const closeCommand = useCallback(() => setCommandOpen(false), [])
  const openLetter = useCallback(() => setLetterOpen(true), [])
  const closeLetter = useCallback(() => setLetterOpen(false), [])
  const openFragment = useCallback(() => setFragmentOpen(true), [])
  const closeFragment = useCallback(() => setFragmentOpen(false), [])
  const openUpload = useCallback(() => setUploadOpen(true), [])
  const closeUpload = useCallback(() => setUploadOpen(false), [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(
    () => ({
      commandOpen,
      openCommand,
      closeCommand,
      letterOpen,
      openLetter,
      closeLetter,
      fragmentOpen,
      openFragment,
      closeFragment,
      uploadOpen,
      openUpload,
      closeUpload,
    }),
    [
      commandOpen,
      openCommand,
      closeCommand,
      letterOpen,
      openLetter,
      closeLetter,
      fragmentOpen,
      openFragment,
      closeFragment,
      uploadOpen,
      openUpload,
      closeUpload,
    ],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}
