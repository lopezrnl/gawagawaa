export const STORAGE_KEYS = {
  name: 'blank:given-name',
  letters: 'blank:letters:v1',
  fragments: 'blank:fragments:v1',
  gallery: 'blank:gallery:v1',
  prefs: 'blank:prefs:v1',
}

export const DEFAULT_PREFS = {
  reduceMotion: false,
  glow: true,
}

export const SEED_LETTERS = [
  {
    id: 'seed-letter-page',
    title: 'To whoever finds this page',
    body: `I woke up on a page with no ink on it. The room was white, the window was white, and the only blue in the world was the vein at my wrist. I counted it until someone finally wrote my name in the corner — and then crossed it out.\n\nIf you are reading this, the tide brought you here. That is how it works. It brings things back and leaves them where someone will find them.\n\nDo not feel sorry for me. I am not lost. I am between words, which is a place too.`,
    createdAt: '2026-11-21T19:40:00.000Z',
  },
  {
    id: 'seed-letter-fish',
    title: 'The fish in the glass',
    body: `There is a small silver fish living in a glass of water on the windowsill. The sea left it in my palm the first night it came up the stairs, and I have not had the heart to ask what it wanted.\n\nIt has never once needed to breathe. I think it is waiting for the same thing I am: for someone to decide what happens next.\n\nIf you ever come to the White Room, look for the glass. If the fish is gone, it means the story has started without me.`,
    createdAt: '2026-11-09T08:15:00.000Z',
  },
  {
    id: 'seed-letter-name',
    title: 'A name I almost kept',
    body: `Someone called me Aster once. It was a mistake — they were reading from the wrong page — but for three whole seconds I had a name that was not a blank space.\n\nI did not correct them. I let it sit in the air until it went cold.\n\nSometimes I write it in the margin and then rub it out with my thumb. The paper remembers, though. Paper always remembers.`,
    createdAt: '2026-10-28T22:05:00.000Z',
  },
]

export const SEED_FRAGMENTS = [
  {
    id: 'seed-fragment-places',
    text: 'Some names are just places we have not been yet.',
    createdAt: '2026-11-24T10:20:00.000Z',
  },
  {
    id: 'seed-fragment-tide',
    text: 'The tide keeps what it borrows. I have learned to lend carefully.',
    createdAt: '2026-11-17T16:45:00.000Z',
  },
  {
    id: 'seed-fragment-dream',
    text: 'I dream in blue and wake up thirsty.',
    createdAt: '2026-11-03T06:30:00.000Z',
  },
  {
    id: 'seed-fragment-margin',
    text: 'A margin is not empty space. It is where the story argues with itself.',
    createdAt: '2026-10-19T21:12:00.000Z',
  },
]

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function loadLetters() {
  const value = readJSON(STORAGE_KEYS.letters, null)
  return Array.isArray(value) ? value : SEED_LETTERS
}

export function saveLetters(letters) {
  return writeJSON(STORAGE_KEYS.letters, letters)
}

export function loadFragments() {
  const value = readJSON(STORAGE_KEYS.fragments, null)
  return Array.isArray(value) ? value : SEED_FRAGMENTS
}

export function saveFragments(fragments) {
  return writeJSON(STORAGE_KEYS.fragments, fragments)
}

export function loadGallery() {
  const value = readJSON(STORAGE_KEYS.gallery, null)
  return Array.isArray(value) ? value : []
}

export function saveGallery(items) {
  return writeJSON(STORAGE_KEYS.gallery, items)
}

export function loadPrefs() {
  const value = readJSON(STORAGE_KEYS.prefs, null)
  return { ...DEFAULT_PREFS, ...(value && typeof value === 'object' ? value : {}) }
}

export function savePrefs(prefs) {
  return writeJSON(STORAGE_KEYS.prefs, prefs)
}

export function storageBytes() {
  let total = 0
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      total += (localStorage.getItem(key) ?? '').length
    } catch {
      /* storage may be unavailable */
    }
  }
  return total
}

export function clearArchive() {
  for (const key of [STORAGE_KEYS.letters, STORAGE_KEYS.fragments, STORAGE_KEYS.gallery]) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* storage may be unavailable */
    }
  }
}
