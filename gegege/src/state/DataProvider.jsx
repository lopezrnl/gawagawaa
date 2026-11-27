import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataContext } from './contexts.js'
import { downloadText } from '../lib/download.js'
import {
  clearArchive,
  DEFAULT_PREFS,
  loadFragments,
  loadGallery,
  loadLetters,
  loadPrefs,
  saveFragments,
  saveGallery,
  saveLetters,
  savePrefs,
  SEED_FRAGMENTS,
  SEED_LETTERS,
  STORAGE_KEYS,
  storageBytes,
} from '../lib/storage.js'

const MAX_UPLOADS = 12

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`

export default function DataProvider({ children }) {
  const [letters, setLetters] = useState(loadLetters)
  const [fragments, setFragments] = useState(loadFragments)
  const [gallery, setGallery] = useState(loadGallery)
  const [prefs, setPrefs] = useState(loadPrefs)

  useEffect(() => {
    saveLetters(letters)
  }, [letters])

  useEffect(() => {
    saveFragments(fragments)
  }, [fragments])

  useEffect(() => {
    saveGallery(gallery)
  }, [gallery])

  useEffect(() => {
    savePrefs(prefs)
    document.documentElement.classList.toggle('reduce-motion', prefs.reduceMotion)
    document.documentElement.classList.toggle('no-glow', !prefs.glow)
  }, [prefs])

  const addLetter = useCallback(({ title, body }) => {
    const letter = {
      id: uid(),
      title: String(title).trim(),
      body: String(body).trim(),
      createdAt: new Date().toISOString(),
    }
    setLetters((previous) => [letter, ...previous])
    return letter
  }, [])

  const deleteLetter = useCallback((id) => {
    setLetters((previous) => previous.filter((letter) => letter.id !== id))
  }, [])

  const addFragment = useCallback((text) => {
    const fragment = {
      id: uid(),
      text: String(text).trim(),
      createdAt: new Date().toISOString(),
    }
    setFragments((previous) => [fragment, ...previous])
    return fragment
  }, [])

  const deleteFragment = useCallback((id) => {
    setFragments((previous) => previous.filter((fragment) => fragment.id !== id))
  }, [])

  const addGalleryItems = useCallback(
    (items) => {
      const next = [...items, ...gallery].slice(0, MAX_UPLOADS)
      if (!saveGallery(next)) return false
      setGallery(next)
      return true
    },
    [gallery],
  )

  const removeGalleryItem = useCallback(
    (id) => {
      const next = gallery.filter((item) => item.id !== id)
      saveGallery(next)
      setGallery(next)
    },
    [gallery],
  )

  const setPreference = useCallback((key, value) => {
    setPrefs((previous) => ({ ...previous, [key]: value }))
  }, [])

  const exportArchive = useCallback(() => {
    let name
    try {
      name = localStorage.getItem(STORAGE_KEYS.name) ?? ''
    } catch {
      name = ''
    }

    downloadText(
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          name: name || 'Blank',
          letters,
          fragments,
          gallery,
          prefs,
        },
        null,
        2,
      ),
      'blank-archive.json',
      'application/json',
    )
  }, [letters, fragments, gallery, prefs])

  const resetArchive = useCallback(() => {
    clearArchive()
    setLetters(SEED_LETTERS)
    setFragments(SEED_FRAGMENTS)
    setGallery([])
    setPrefs(DEFAULT_PREFS)
  }, [])

  const value = useMemo(
    () => ({
      letters,
      fragments,
      gallery,
      prefs,
      addLetter,
      deleteLetter,
      addFragment,
      deleteFragment,
      addGalleryItems,
      removeGalleryItem,
      setPreference,
      exportArchive,
      resetArchive,
      storageBytes: storageBytes(),
      maxUploads: MAX_UPLOADS,
    }),
    [
      letters,
      fragments,
      gallery,
      prefs,
      addLetter,
      deleteLetter,
      addFragment,
      deleteFragment,
      addGalleryItems,
      removeGalleryItem,
      setPreference,
      exportArchive,
      resetArchive,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
