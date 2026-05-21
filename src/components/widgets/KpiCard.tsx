import { TrendUpIcon, TrendDownIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  delta?: string
  deltaDirection?: 'up' | 'down'
  dark?: boolean
}

export function KpiCard({ label, value, delta, deltaDirection, dark }: KpiCardProps) {
  const isDown = deltaDirection === 'down'
  return (
    <div
      className={cn(
        'soft-shadow rounded-[2rem] p-5',
        dark ? 'bg-slate text-slate-foreground' : 'bg-card',
      )}
    >
      <p
        className={cn(
          'text-[11px] font-semibold uppercase tracking-wider',
          dark ? 'text-white/50' : 'text-muted-foreground',
        )}
      >
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            'mt-1 flex items-center gap-1 text-xs font-medium',
            isDown ? 'text-risk-high' : 'text-risk-low',
          )}
        >
          {isDown ? <TrendDownIcon size={14} /> : <TrendUpIcon size={14} />}
          {delta}
        </p>
      )}
    </div>
  )
}
