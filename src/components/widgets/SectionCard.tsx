import type { ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  caption?: string
  icon?: Icon
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function SectionCard({
  title,
  caption,
  icon: IconComponent,
  action,
  className,
  children,
}: SectionCardProps) {
  return (
    <section className={cn('soft-shadow rounded-[2rem] bg-card p-6', className)}>
      <header className="mb-5 flex items-center gap-3">
        {IconComponent && (
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconComponent size={18} />
          </span>
        )}
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {(caption || action) && (
          <div className="ml-auto flex items-center gap-3">
            {caption && (
              <span className="text-xs text-muted-foreground">{caption}</span>
            )}
            {action}
          </div>
        )}
      </header>
      {children}
    </section>
  )
}
