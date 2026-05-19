import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

interface ScoreTrendChartProps {
  history: { period: string; score: number }[]
}

export function ScoreTrendChart({ history }: ScoreTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={history}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <YAxis
          domain={[0, 100]}
          width={32}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: 'var(--border)' }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
