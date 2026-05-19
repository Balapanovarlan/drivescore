interface TooltipPayloadEntry {
  name?: string
  value?: number | string
  color?: string
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string | number
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-xl border bg-white px-3 py-2 text-sm shadow-md">
      {label !== undefined && label !== '' && (
        <p className="mb-1 font-semibold text-foreground">{label}</p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color ?? 'var(--primary)' }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-mono text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}
