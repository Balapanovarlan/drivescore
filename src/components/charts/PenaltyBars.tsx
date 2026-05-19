import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import type { ScoreFactor } from '@/data/types'
import { ChartTooltip } from './ChartTooltip'

export function PenaltyBars({
  breakdown,
}: {
  breakdown: Record<ScoreFactor, number>
}) {
  const { t } = useTranslation()
  const data = (Object.keys(breakdown) as ScoreFactor[]).map((factor) => ({
    factor: t(`factor.${factor}`),
    penalty: breakdown[factor],
  }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 12 }}>
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <YAxis
          type="category"
          dataKey="factor"
          width={130}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
        />
        <Bar dataKey="penalty" fill="var(--primary)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
