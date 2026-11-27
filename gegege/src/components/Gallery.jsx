import { useEffect, useMemo, useState } from 'react'
import { DreamscapeArt, PortraitArt, UndertowArt } from '../art.jsx'
import Modal from './Modal.jsx'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExpandIcon,
  PlusIcon,
  TrashIcon,
} from './icons.jsx'
import { downloadDataUrl, downloadSvgAsPng, slugify } from '../lib/download.js'
import { BUILT_IN_STUDIES } from '../lib/studies.js'
import { useReveal } from '../lib/useReveal.js'
import { useData, useToast, useUI } from '../state/contexts.js'

const ART = {
  portrait: PortraitArt,
  dreamscape: DreamscapeArt,
  undertow: UndertowArt,
}

function Artwork({ item }) {
  if (item.kind === 'upload') {
    return <img src={item.src} alt={item.title} loading="lazy" />
  }

  const Component = ART[item.art]
  return Component ? <Component /> : null
}

export default function Gallery() {
  const { gallery, removeGalleryItem } = useData()
  const { openUpload } = useUI()
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [lightboxId, setLightboxId] = useState(null)

  const allItems = useMemo(() => [...BUILT_IN_STUDIES, ...gallery], [gallery])
  const visible = useMemo(() => {
    if (filter === 'studies') return BUILT_IN_STUDIES
    if (filter === 'yours') return gallery
    return allItems
  }, [filter, gallery, allItems])

  useReveal([visible.length, filter])

  const current = visible.find((item) => item.id === lightboxId) || null
  const currentIndex = current ? visible.indexOf(current) : -1

  useEffect(() => {
    if (!current) return undefined

    const onKeyDown = (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      const next = (currentIndex + direction + visible.length) % visible.length
      setLightboxId(visible[next].id)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [current, currentIndex, visible])

  const handleDownload = async (item) => {
    try {
      if (item.kind === 'upload') {
        const extension = item.src.startsWith('data:image/webp')
          ? 'webp'
          : item.src.startsWith('data:image/jpeg')
            ? 'jpg'
            : 'png'
        downloadDataUrl(item.src, `${slugify(item.title)}.${extension}`)
      } else {
        const svg = document.querySelector(`[data-art-id="${item.id}"] svg`)
        await downloadSvgAsPng(svg, `${slugify(item.title)}.png`)
      }
      toast(`Downloaded “${item.title}”`, 'success')
    } catch {
      toast('Could not download this study', 'error')
    }
  }

  const handleDelete = (item) => {
    removeGalleryItem(item.id)
    if (lightboxId === item.id) setLightboxId(null)
    toast('Study removed from your gallery')
  }

  const step = (direction) => {
    if (!visible.length) return
    const next = (currentIndex + direction + visible.length) % visible.length
    setLightboxId(visible[next].id)
  }

  const filters = [
    { id: 'all', label: 'All', count: allItems.length },
    { id: 'studies', label: 'Studies', count: BUILT_IN_STUDIES.length },
    { id: 'yours', label: 'Yours', count: gallery.length },
  ]

  return (
    <section id="gallery" className="section section-line" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head gallery-head" data-reveal>
          <div>
            <p className="kicker">
              <span>04</span> Gallery
            </p>
            <h2 id="gallery-title">Studies in blue</h2>
            <p className="lead">
              A growing board of impressions — pinned, downloaded, and added to
              by you.
            </p>
          </div>

          <button type="button" className="btn btn-primary btn-small" onClick={openUpload}>
            <PlusIcon /> Upload study
          </button>
        </header>

        <div className="gallery-bar">
          <div className="chips" role="group" aria-label="Filter studies">
            {filters.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`chip-btn ${filter === option.id ? 'is-active' : ''}`}
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
                <span className="chip-count mono">{option.count}</span>
              </button>
            ))}
          </div>
          <p className="gallery-count mono">
            {visible.length} {visible.length === 1 ? 'study' : 'studies'}
          </p>
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            <p>Your gallery is empty — for now.</p>
            <button type="button" className="btn btn-primary btn-small" onClick={openUpload}>
              <PlusIcon /> Upload your first study
            </button>
          </div>
        ) : (
          <div className="masonry">
            {visible.map((item) => (
              <figure className={`pin ${item.kind === 'upload' ? 'is-upload' : ''}`} key={item.id} data-reveal>
                <div
                  className="pin-media"
                  style={{
                    aspectRatio:
                      item.kind === 'upload'
                        ? `${item.width || 4} / ${item.height || 3}`
                        : item.ratio,
                  }}
                >
                  <button
                    type="button"
                    className="pin-open"
                    onClick={() => setLightboxId(item.id)}
                    aria-label={`Open ${item.title}`}
                  >
                    <span className="art-wrap" data-art-id={item.id}>
                      <Artwork item={item} />
                    </span>
                    <span className="pin-veil" aria-hidden="true" />
                  </button>

                  <div className="pin-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => handleDownload(item)}
                      aria-label={`Download ${item.title}`}
                      title="Download"
                    >
                      <DownloadIcon />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => setLightboxId(item.id)}
                      aria-label={`Expand ${item.title}`}
                      title="Expand"
                    >
                      <ExpandIcon />
                    </button>
                    {item.kind === 'upload' && (
                      <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        onClick={() => handleDelete(item)}
                        aria-label={`Delete ${item.title}`}
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </div>

                <figcaption className="pin-caption">
                  <div>
                    <p className="pin-title">{item.title}</p>
                    <p className="pin-sub mono">{item.caption}</p>
                  </div>
                  {item.kind === 'upload' && <span className="pin-badge mono">yours</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(current)}
        onClose={() => setLightboxId(null)}
        title={current?.title}
        subtitle={current ? (current.kind === 'upload' ? 'your study' : 'from the archive') : ''}
        size="lg"
      >
        {current && (
          <div className="lightbox">
            <div className="lightbox-art" data-art-id={current.id}>
              <Artwork item={current} />
            </div>
            <p className="lightbox-caption">{current.caption}</p>

            <div className="lightbox-actions">
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={() => handleDownload(current)}
              >
                <DownloadIcon /> Download
              </button>

              {current.kind === 'upload' && (
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => handleDelete(current)}
                >
                  <TrashIcon /> Delete
                </button>
              )}

              <div className="lightbox-nav">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => step(-1)}
                  aria-label="Previous study"
                >
                  <ChevronLeftIcon />
                </button>
                <span className="mono">
                  {currentIndex + 1} / {visible.length}
                </span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => step(1)}
                  aria-label="Next study"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
