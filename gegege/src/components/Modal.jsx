import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './icons.jsx'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  bare = false,
  ariaLabel,
}) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  const restoreRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined

    restoreRef.current = document.activeElement
    const body = document.body
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const focusTimer = window.setTimeout(() => {
      const node = dialogRef.current
      if (!node) return
      const target =
        node.querySelector('[data-autofocus]') || node.querySelector(FOCUSABLE)
      target?.focus()
    }, 40)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current?.()
        return
      }

      if (event.key !== 'Tab') return

      const node = dialogRef.current
      if (!node) return

      const items = Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      )

      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
      const restore = restoreRef.current
      if (restore && typeof restore.focus === 'function') restore.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className={`modal-backdrop ${bare ? 'is-bare' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeRef.current?.()
      }}
    >
      <div
        ref={dialogRef}
        className={`modal modal-${size} ${bare ? 'modal-bare' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || undefined}
        aria-labelledby={ariaLabel ? undefined : titleId}
      >
        {!bare && (
          <header className="modal-head">
            <div className="modal-heading">
              {subtitle && <p className="modal-sub mono">{subtitle}</p>}
              <h2 id={titleId}>{title}</h2>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={() => closeRef.current?.()}
              aria-label="Close dialog"
            >
              <CloseIcon />
            </button>
          </header>
        )}

        <div className={bare ? 'modal-plain' : 'modal-body'}>{children}</div>

        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
