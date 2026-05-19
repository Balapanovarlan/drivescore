import type { Icon } from '@phosphor-icons/react'

interface EmptyStateProps {
  icon?: Icon
  title: string
  description?: string
}

export function EmptyState({ icon: IconComponent, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {IconComponent && (
        <IconComponent size={32} className="text-muted-foreground" />
      )}
      <p className="font-semibold">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
