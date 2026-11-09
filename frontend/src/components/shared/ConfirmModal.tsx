import React, { createContext, useState, useCallback, useEffect } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'primary'

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  isLoading?: boolean
}

const VARIANT_CONFIGS = {
  danger: {
    icon: AlertTriangle,
    iconContainer: 'bg-destructive/10 text-destructive border-destructive/20',
    confirmButtonClass:
      'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-xs',
  },
  warning: {
    icon: AlertCircle,
    iconContainer: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    confirmButtonClass:
      'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 shadow-xs',
  },
  info: {
    icon: Info,
    iconContainer: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    confirmButtonClass:
      'bg-sky-600 hover:bg-sky-700 text-white shadow-xs',
  },
  primary: {
    icon: CheckCircle2,
    iconContainer: 'bg-primary/10 text-primary border-primary/20',
    confirmButtonClass:
      'bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs',
  },
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác Nhận Hành Động',
  description = 'Bạn có chắc chắn muốn thực hiện hành động này? Thao tác không thể hoàn tác.',
  confirmText = 'Xác Nhận',
  cancelText = 'Hủy Bỏ',
  variant = 'danger',
  isLoading = false,
}) => {
  const config = VARIANT_CONFIGS[variant]
  const Icon = config.icon

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose()
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className={`p-2.5 rounded-xl border shrink-0 ${config.iconContainer}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 id="confirm-modal-title" className="text-base font-bold text-foreground">
              {title}
            </h3>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 h-9 text-xs font-semibold cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-4 h-9 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${config.confirmButtonClass}`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export interface ConfirmOptions {
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
}

export type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>

export const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    options: ConfirmOptions
  }>({
    isOpen: false,
    options: {},
  })

  const resolveRef = React.useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setModalState({
        isOpen: true,
        options,
      })
    })
  }, [])

  const handleClose = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false)
      resolveRef.current = null
    }
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const handleConfirm = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(true)
      resolveRef.current = null
    }
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={modalState.options.title}
        description={modalState.options.description}
        confirmText={modalState.options.confirmText}
        cancelText={modalState.options.cancelText}
        variant={modalState.options.variant}
      />
    </ConfirmContext.Provider>
  )
}
