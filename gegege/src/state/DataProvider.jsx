import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataContext } from './contexts.js'
import { downloadText } from '../lib/download.js'
import {
  clearArchive,
  clearGalleryLocal,
  DEFAULT_PROFILE,
  DEFAULT_PREFS,
  loadFragments,
  loadGalleryLocal,
  loadProfileLocal,
  loadLetters,
  loadPrefs,
  saveFragments,
  saveGalleryLocal,
  saveProfileLocal,
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
  const [gallery, setGallery] = useState([])
  const [galleryReady, setGalleryReady] = useState(false)
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [prefs, setPrefs] = useState(loadPrefs)

  useEffect(() => {
    saveLetters(letters)
  }, [letters])

  useEffect(() => {
    saveFragments(fragments)
  }, [fragments])

  useEffect(() => {
    let active = true
    loadGalleryLocal().then(async (items) => {
      if (!active) return
      setGallery(items)
      setGalleryReady(true)
      // Persist migrated data to IndexedDB.
      if (items.length) await saveGalleryLocal(items)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    loadProfileLocal().then((value) => {
      if (active) setProfile(value)
    })
    return () => { active = false }
  }, [])

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
    async (items) => {
      const next = [...items, ...gallery].slice(0, MAX_UPLOADS)
      if (!(await saveGalleryLocal(next))) return false
      setGallery(next)
      return true
    },
    [gallery],
  )

  const removeGalleryItem = useCallback(
    async (id) => {
      const next = gallery.filter((item) => item.id !== id)
      await saveGalleryLocal(next)
      setGallery(next)
    },
    [gallery],
  )

  const setPreference = useCallback((key, value) => {
    setPrefs((previous) => ({ ...previous, [key]: value }))
  }, [])

  const updateProfile = useCallback((patch) => {
    setProfile((previous) => {
      const next = { ...previous, ...patch }
      saveProfileLocal(next)
      return next
    })
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
          profile,
          prefs,
        },
        null,
        2,
      ),
      'blank-archive.json',
      'application/json',
    )
  }, [letters, fragments, gallery, profile, prefs])

  const resetArchive = useCallback(async () => {
    await clearGalleryLocal()
    clearArchive()
    setLetters(SEED_LETTERS)
    setFragments(SEED_FRAGMENTS)
    setGallery([])
    setProfile(DEFAULT_PROFILE)
    await saveProfileLocal(DEFAULT_PROFILE)
    setPrefs(DEFAULT_PREFS)
  }, [])

  const value = useMemo(
    () => ({
      letters,
      fragments,
      gallery,
      galleryReady,
      profile,
      prefs,
      addLetter,
      deleteLetter,
      addFragment,
      deleteFragment,
      addGalleryItems,
      removeGalleryItem,
      updateProfile,
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
      galleryReady,
      profile,
      prefs,
      addLetter,
      deleteLetter,
      addFragment,
      deleteFragment,
      addGalleryItems,
      removeGalleryItem,
      updateProfile,
      setPreference,
      exportArchive,
      resetArchive,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
