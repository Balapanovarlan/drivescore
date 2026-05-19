import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { RiskCategory } from '@/data/types'
import { ChartTooltip } from './ChartTooltip'

const BAND_COLOR: Record<RiskCategory, string> = {
  high: 'var(--risk-high)',
  medium: 'var(--risk-medium)',
  low: 'var(--risk-low)',
}

interface ScoreHistogramProps {
  buckets: { range: string; count: number; band: RiskCategory }[]
}

export function ScoreHistogram({ buckets }: ScoreHistogramProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={buckets}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="range"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <YAxis
          allowDecimals={false}
          width={28}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={28}>
          {buckets.map((bucket, i) => (
            <Cell key={i} fill={BAND_COLOR[bucket.band]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
