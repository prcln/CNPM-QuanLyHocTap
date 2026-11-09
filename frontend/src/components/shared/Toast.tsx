import React, { createContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  title?: string
  duration?: number
}

export interface ToastOptions {
  title?: string
  duration?: number
}

export interface ToastContextType {
  toasts: ToastItem[]
  showToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
  toast: {
    success: (message: string, options?: ToastOptions) => string
    error: (message: string, options?: ToastOptions) => string
    warning: (message: string, options?: ToastOptions) => string
    info: (message: string, options?: ToastOptions) => string
  }
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const TOAST_STYLES = {
  success: {
    container: 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/80 text-foreground',
    icon: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    title: 'text-emerald-900 dark:text-emerald-200',
  },
  error: {
    container: 'border-destructive/30 bg-red-50/90 dark:bg-red-950/80 text-foreground',
    icon: 'text-destructive dark:text-red-400 bg-destructive/10',
    title: 'text-red-900 dark:text-red-200',
  },
  warning: {
    container: 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/80 text-foreground',
    icon: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    title: 'text-amber-900 dark:text-amber-200',
  },
  info: {
    container: 'border-sky-500/30 bg-sky-50/90 dark:bg-sky-950/80 text-foreground',
    icon: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
    title: 'text-sky-900 dark:text-sky-200',
  },
}

interface ToastCardProps {
  toast: ToastItem
  onClose: (id: string) => void
}

export const ToastCard: React.FC<ToastCardProps> = ({ toast, onClose }) => {
  const Icon = TOAST_ICONS[toast.type]
  const styles = TOAST_STYLES[toast.type]

  useEffect(() => {
    const duration = toast.duration ?? 3500
    if (duration <= 0) return

    const timer = setTimeout(() => {
      onClose(toast.id)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in ${styles.container}`}
    >
      <div className={`p-1.5 rounded-xl shrink-0 ${styles.icon}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 space-y-0.5 pt-0.5 text-xs">
        {toast.title && <h5 className={`font-bold leading-tight ${styles.title}`}>{toast.title}</h5>}
        <p className="text-muted-foreground leading-relaxed">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
        aria-label="Đóng thông báo"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export const ToastContainer: React.FC<{
  toasts: ToastItem[]
  onClose: (id: string) => void
}> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-label="Danh sách thông báo"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} onClose={onClose} />
      ))}
    </div>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      setToasts((prev) => [...prev, { ...item, id }])
      return id
    },
    [],
  )

  const toast = {
    success: useCallback(
      (message: string, options?: ToastOptions) =>
        showToast({ type: 'success', message, title: options?.title, duration: options?.duration }),
      [showToast],
    ),
    error: useCallback(
      (message: string, options?: ToastOptions) =>
        showToast({ type: 'error', message, title: options?.title, duration: options?.duration }),
      [showToast],
    ),
    warning: useCallback(
      (message: string, options?: ToastOptions) =>
        showToast({ type: 'warning', message, title: options?.title, duration: options?.duration }),
      [showToast],
    ),
    info: useCallback(
      (message: string, options?: ToastOptions) =>
        showToast({ type: 'info', message, title: options?.title, duration: options?.duration }),
      [showToast],
    ),
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}
