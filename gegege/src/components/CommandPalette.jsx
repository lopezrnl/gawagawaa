import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal.jsx'
import { SearchIcon } from './icons.jsx'
import { downloadSvgAsPng } from '../lib/download.js'
import { useData, useToast, useUI } from '../state/contexts.js'

export default function CommandPalette() {
  const { commandOpen, closeCommand, openLetter, openFragment, openUpload } = useUI()
  const { exportArchive, prefs, setPreference } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!commandOpen) return
    // Clear the previous search whenever the palette is reopened.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery('')
    setActive(0)
  }, [commandOpen])

  const downloadPortrait = useCallback(async () => {
    const svg =
      document.querySelector('[data-art-id="story-portrait"] svg') ||
      document.querySelector('[data-art-id="dossier-portrait"] svg') ||
      document.querySelector('[data-art-id="study-portrait"] svg')

    if (!svg) {
      toast('Open the story or dossier to download the portrait', 'error')
      return
    }

    try {
      await downloadSvgAsPng(svg, 'blank-portrait.png')
      toast('Portrait downloaded', 'success')
    } catch {
      toast('Could not download the portrait', 'error')
    }
  }, [toast])

  const actions = useMemo(() => {
    const go = (to) => {
      closeCommand()
      navigate(to)
    }

    return [
      {
        id: 'story',
        group: 'Navigate',
        label: 'The story',
        hint: 'chapters',
        keywords: 'start hero beginning white room tide',
        run: () => go('/app/story'),
      },
      {
        id: 'archive',
        group: 'Navigate',
        label: 'The Archive',
        hint: 'margins & leftovers',
        keywords: 'page letters fragments timeline data',
        run: () => go('/app/archive'),
      },
      {
        id: 'dossier',
        group: 'Navigate',
        label: 'Dossier',
        hint: 'file 000',
        keywords: 'id profile stats subject',
        run: () => go('/app/dossier'),
      },
      {
        id: 'story',
        group: 'Navigate',
        label: 'Story',
        hint: 'three chapters',
        keywords: 'chapters white room tide unwritten',
        run: () => go('/app/story#chapters'),
      },
      {
        id: 'gallery',
        group: 'Navigate',
        label: 'Gallery',
        hint: 'studies in blue',
        keywords: 'pinterest images download upload',
        run: () => go('/app/gallery'),
      },
      {
        id: 'deploy',
        group: 'Navigate',
        label: 'Deploy',
        hint: 'vercel slot',
        keywords: 'ship publish production',
        run: () => go('/app/deploy'),
      },
      {
        id: 'letter',
        group: 'Create',
        label: 'Write a letter',
        hint: 'to the archive',
        keywords: 'new compose write',
        run: () => {
          closeCommand()
          openLetter()
        },
      },
      {
        id: 'fragment',
        group: 'Create',
        label: 'Add a fragment',
        hint: 'a loose line',
        keywords: 'quote note new',
        run: () => {
          closeCommand()
          openFragment()
        },
      },
      {
        id: 'upload',
        group: 'Create',
        label: 'Upload a study',
        hint: 'to the gallery',
        keywords: 'image photo add pin',
        run: () => {
          closeCommand()
          openUpload()
        },
      },
      {
        id: 'download-portrait',
        group: 'Tools',
        label: 'Download the portrait',
        hint: 'png',
        keywords: 'save image art export',
        run: () => {
          closeCommand()
          downloadPortrait()
        },
      },
      {
        id: 'export',
        group: 'Tools',
        label: 'Export the archive',
        hint: '.json',
        keywords: 'backup download data save',
        run: () => {
          closeCommand()
          exportArchive()
          toast('Archive exported as JSON', 'success')
        },
      },
      {
        id: 'motion',
        group: 'Tools',
        label: prefs.reduceMotion ? 'Turn motion back on' : 'Reduce motion',
        hint: 'preference',
        keywords: 'animation accessibility calm',
        run: () => {
          closeCommand()
          setPreference('reduceMotion', !prefs.reduceMotion)
          toast(prefs.reduceMotion ? 'Motion restored' : 'Motion reduced')
        },
      },
      {
        id: 'glow',
        group: 'Tools',
        label: prefs.glow ? 'Turn off ambient glow' : 'Turn on ambient glow',
        hint: 'preference',
        keywords: 'cursor effect light',
        run: () => {
          closeCommand()
          setPreference('glow', !prefs.glow)
        },
      },
    ]
  }, [closeCommand, downloadPortrait, exportArchive, navigate, openFragment, openLetter, openUpload, prefs, setPreference, toast])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return actions
    return actions.filter((action) =>
      `${action.label} ${action.keywords}`.toLowerCase().includes(needle),
    )
  }, [actions, query])

  useEffect(() => {
    // Keep keyboard selection aligned with the current result list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0)
  }, [query])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((index) => (filtered.length ? (index + 1) % filtered.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => (filtered.length ? (index - 1 + filtered.length) % filtered.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      filtered[active]?.run()
    }
  }

  let lastGroup = ''

  return (
    <Modal open={commandOpen} onClose={closeCommand} bare ariaLabel="Command palette">
      <div className="command">
        <div className="command-search">
          <SearchIcon />
          <input
            data-autofocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page, write a letter, upload a study…"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd>esc</kbd>
        </div>

        <div className="command-list" role="listbox" aria-label="Commands">
          {filtered.length === 0 && (
            <p className="command-empty">No commands match “{query}”.</p>
          )}

          {filtered.map((action, index) => {
            const showGroup = action.group !== lastGroup
            lastGroup = action.group

            return (
              <Fragment key={action.id}>
                {showGroup && <p className="command-group mono">{action.group}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={`command-item ${index === active ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={action.run}
                >
                  <span className="command-label">{action.label}</span>
                  <span className="command-hint mono">{action.hint}</span>
                </button>
              </Fragment>
            )
          })}
        </div>

        <div className="command-foot mono">
          <span>↑↓ move</span>
          <span>↵ run</span>
          <span>esc close</span>
        </div>
      </div>
    </Modal>
  )
}
