import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContext } from '../state/contexts.js'

let nextId = 0

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message, tone = 'default') => {
      const id = ++nextId
      setToasts((previous) => [...previous.slice(-3), { id, message, tone }])
      const timer = setTimeout(() => {
        setToasts((previous) => previous.filter((item) => item.id !== id))
        timers.current.delete(id)
      }, 4200)
      timers.current.set(id, timer)
      return id
    },
    [],
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((timer) => clearTimeout(timer))
      map.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((item) => (
          <div className={`toast toast-${item.tone}`} key={item.id} role="status">
            <span className="toast-dot" aria-hidden="true" />
            <p>{item.message}</p>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
