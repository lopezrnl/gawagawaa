import { createContext, useContext } from 'react'

export const DataContext = createContext(null)
export const UIContext = createContext(null)
export const ToastContext = createContext(null)

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used inside <DataProvider>')
  return context
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used inside <UIProvider>')
  return context
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}
