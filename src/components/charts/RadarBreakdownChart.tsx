import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import type { ScoreFactor } from '@/data/types'
import { ChartTooltip } from './ChartTooltip'

export function RadarBreakdownChart({
  breakdown,
}: {
  breakdown: Record<ScoreFactor, number>
}) {
  const { t } = useTranslation()
  const data = (Object.keys(breakdown) as ScoreFactor[]).map((factor) => ({
    factor: t(`factor.${factor}`),
    value: breakdown[factor],
  }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="factor"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: 'var(--border)' }}
        />
        <Radar
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.25}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
