import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal.jsx'
import { LetterIcon } from './icons.jsx'
import { useData, useToast, useUI } from '../state/contexts.js'

export default function LetterComposer() {
  const { letterOpen, closeLetter } = useUI()
  const { addLetter } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (letterOpen) return
    // Clear the previous draft after the composer closes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle('')
    setBody('')
    setSaving(false)
  }, [letterOpen])

  const save = (openArchive = false) => {
    if (!title.trim() || !body.trim()) {
      toast('A letter needs a title and a few lines', 'error')
      return
    }

    setSaving(true)
    addLetter({ title, body })
    toast('Letter saved to the archive', 'success')
    closeLetter()
    if (openArchive) navigate('/app/archive#letters')
    setSaving(false)
  }

  const words = body.trim() ? body.trim().split(/\s+/).length : 0

  return (
    <Modal
      open={letterOpen}
      onClose={closeLetter}
      title="Write her a letter"
      subtitle="letters never sent"
      size="md"
    >
      <form
        className="compose-form"
        onSubmit={(event) => {
          event.preventDefault()
          save(false)
        }}
      >
        <div className="field">
          <label htmlFor="letter-title">Title</label>
          <input
            id="letter-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Something you would only say in ink"
            maxLength={90}
            autoComplete="off"
            data-autofocus
          />
        </div>

        <div className="field">
          <label htmlFor="letter-body">Letter</label>
          <textarea
            id="letter-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Dear Blank,"
            rows={9}
            maxLength={4000}
          />
          <p className="field-hint mono">
            {words} {words === 1 ? 'word' : 'words'} · saved only in this browser
          </p>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost btn-small" onClick={closeLetter}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => save(true)}
            disabled={saving}
          >
            Save &amp; open archive
          </button>
          <button type="submit" className="btn btn-primary btn-small" disabled={saving}>
            <LetterIcon /> {saving ? 'Saving…' : 'Save letter'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
