import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { FragmentIcon } from './icons.jsx'
import { useData, useToast, useUI } from '../state/contexts.js'

const LIMIT = 280

export default function FragmentComposer() {
  const { fragmentOpen, closeFragment } = useUI()
  const { addFragment } = useData()
  const toast = useToast()
  const [text, setText] = useState('')

  useEffect(() => {
    // Clear the draft after the composer closes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!fragmentOpen) setText('')
  }, [fragmentOpen])

  const save = () => {
    if (!text.trim()) {
      toast('Write a line before saving', 'error')
      return
    }

    addFragment(text)
    toast('Fragment added to the archive', 'success')
    closeFragment()
  }

  return (
    <Modal
      open={fragmentOpen}
      onClose={closeFragment}
      title="Add a fragment"
      subtitle="a loose line from the margin"
      size="sm"
    >
      <form
        className="compose-form"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <div className="field">
          <label htmlFor="fragment-text">Fragment</label>
          <textarea
            id="fragment-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="A line that does not need a paragraph around it."
            rows={5}
            maxLength={LIMIT}
            data-autofocus
          />
          <p className="field-hint mono">
            {text.length} / {LIMIT}
          </p>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost btn-small" onClick={closeFragment}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-small">
            <FragmentIcon /> Save fragment
          </button>
        </div>
      </form>
    </Modal>
  )
}
