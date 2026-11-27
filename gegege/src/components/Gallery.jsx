import { useEffect, useMemo, useState } from 'react'
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
import { useReveal } from '../lib/useReveal.js'
import { useData, useToast, useUI } from '../state/contexts.js'

function Artwork({ item }) {
  return <img src={item.src} alt={item.title} loading="lazy" />
}

export default function Gallery() {
  const { gallery, galleryReady, removeGalleryItem } = useData()
  const { openUpload } = useUI()
  const toast = useToast()
  const [lightboxId, setLightboxId] = useState(null)

  const visible = useMemo(() => gallery, [gallery])

  useReveal([visible.length])

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

  return (
    <section id="gallery" className="section section-line" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head gallery-head" data-reveal>
          <div>
            <p className="kicker">
              <span>01</span> Gallery
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
          <p className="gallery-count mono">
            {visible.length} {visible.length === 1 ? 'study' : 'studies'}
            <span className="gallery-local-note"><span aria-hidden="true">🐧</span> kept on this device</span>
          </p>
        </div>

        {!galleryReady ? (
          <div className="empty-state" role="status">Loading your local gallery…</div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <p>Your gallery is empty — for now.</p>
            <button type="button" className="btn btn-primary btn-small" onClick={openUpload}>
              <PlusIcon /> Upload your first study
            </button>
          </div>
        ) : (
          <div className="masonry">
            {visible.map((item) => (
              <figure className="pin is-upload" key={item.id} data-reveal>
                <div
                  className="pin-media"
                  style={{
                    aspectRatio:
                      `${item.width || 4} / ${item.height || 3}`,
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
                    {(
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
                  <span className="pin-badge mono">yours</span>
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
