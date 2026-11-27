import { useEffect, useRef, useState } from 'react'
import Modal from './Modal.jsx'
import { CloseIcon, UploadIcon } from './icons.jsx'
import { compressImageFile } from '../lib/download.js'
import { useData, useToast, useUI } from '../state/contexts.js'

const MAX_PER_BATCH = 8
const MAX_FILE_SIZE = 12 * 1024 * 1024

const nextPendingId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? `upload-${crypto.randomUUID()}`
    : `upload-${Date.now()}-${Math.random().toString(16).slice(2)}`

export default function UploadModal() {
  const { uploadOpen, closeUpload } = useUI()
  const { addGalleryItems, gallery, maxUploads } = useData()
  const toast = useToast()
  const [pending, setPending] = useState([])
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const room = Math.max(0, maxUploads - gallery.length)

  useEffect(() => {
    if (uploadOpen) return
    // Revoke preview URLs and reset the draft when the modal closes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPending((previous) => {
      previous.forEach((entry) => URL.revokeObjectURL(entry.preview))
      return []
    })
    setBusy(false)
    setDragging(false)
  }, [uploadOpen])

  const addFiles = (fileList) => {
    const files = Array.from(fileList)
    if (files.length === 0) return

    const images = files.filter((file) => file.type.startsWith('image/'))
    if (images.length < files.length) {
      toast('Only image files can be added', 'error')
    }

    const oversized = images.filter((file) => file.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      toast('Some images were larger than 12 MB and were skipped', 'error')
    }

    const usable = images.filter((file) => file.size <= MAX_FILE_SIZE)
    const slots = Math.min(MAX_PER_BATCH, room) - pending.length

    if (slots <= 0) {
      toast(
        room === 0
          ? 'Your gallery is full — delete a study first'
          : `Up to ${Math.min(MAX_PER_BATCH, room)} images can be added`,
        'error',
      )
      return
    }

    const selected = usable.slice(0, slots)
    if (usable.length > selected.length) {
      toast(`Only ${slots} more ${slots === 1 ? 'image' : 'images'} can be added`, 'error')
    }

    const next = selected.map((file) => ({
      id: nextPendingId(),
      file,
      name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim(),
      preview: URL.createObjectURL(file),
    }))

    setPending((previous) => [...previous, ...next])
  }

  const removePending = (id) => {
    setPending((previous) => {
      const target = previous.find((entry) => entry.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return previous.filter((entry) => entry.id !== id)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    if (pending.length === 0) {
      toast('Choose at least one image first', 'error')
      return
    }

    setBusy(true)
    try {
      const items = []
      for (const entry of pending) {
        const image = await compressImageFile(entry.file)
        items.push({
          id: entry.id,
          kind: 'upload',
          src: image.src,
          width: image.width,
          height: image.height,
          title: entry.name || 'Untitled study',
          caption: 'uploaded by you',
          createdAt: new Date().toISOString(),
        })
      }

      const saved = await addGalleryItems(items)
      if (!saved) {
        toast('Could not save locally — check browser storage permissions', 'error')
        return
      }

      toast(`Added ${items.length} ${items.length === 1 ? 'study' : 'studies'} to the gallery`, 'success')
      closeUpload()
    } catch {
      toast('Could not process those images', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={uploadOpen}
      onClose={closeUpload}
      title="Upload a study"
      subtitle="add to the gallery"
      size="md"
    >
      <form className="upload-form" onSubmit={handleSubmit}>
        <label
          className={`dropzone ${dragging ? 'is-dragging' : ''} ${room === 0 ? 'is-disabled' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            addFiles(event.dataTransfer.files)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              addFiles(event.target.files)
              event.target.value = ''
            }}
          />
          <span className="dropzone-icon" aria-hidden="true">
            <UploadIcon />
          </span>
          <span className="dropzone-title">
            {room === 0 ? 'Your gallery is full' : 'Drop images here'}
          </span>
          <span className="dropzone-sub mono">
            {room === 0 ? 'delete a study to make room' : 'or click to browse · jpg, png, webp · up to 8'}
          </span>
        </label>

        {pending.length > 0 && (
          <ul className="upload-previews">
            {pending.map((entry) => (
              <li key={entry.id}>
                <img src={entry.preview} alt="" />
                <div className="upload-preview-meta">
                  <p>{entry.name || entry.file.name}</p>
                  <span className="mono">{Math.max(1, Math.round(entry.file.size / 1024))} KB</span>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => removePending(entry.id)}
                  aria-label={`Remove ${entry.name || entry.file.name}`}
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="form-hint mono">
          Images are resized to 1200px and stored in this browser only.
        </p>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost btn-small" onClick={closeUpload}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-small"
            disabled={busy || pending.length === 0}
          >
            {busy
              ? 'Adding…'
              : pending.length > 0
                ? `Add ${pending.length} ${pending.length === 1 ? 'study' : 'studies'}`
                : 'Add to gallery'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
