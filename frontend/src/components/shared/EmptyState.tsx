import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: LucideIcon
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className = '',
}) => {
  return (
    <div
      className={`col-span-full py-14 px-4 text-center border rounded-2xl bg-card/60 backdrop-blur-xs space-y-3 ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-base text-foreground">{title}</h4>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button size="sm" onClick={onAction} className="gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>{actionLabel}</span>
          </Button>
        </div>
      )}
    </div>
  )
}

