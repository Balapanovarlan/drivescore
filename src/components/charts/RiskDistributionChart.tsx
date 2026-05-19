import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import type { RiskCategory } from '@/data/types'
import { ChartTooltip } from './ChartTooltip'

const SLICE_COLOR: Record<RiskCategory, string> = {
  low: 'var(--risk-low)',
  medium: 'var(--risk-medium)',
  high: 'var(--risk-high)',
}

export function RiskDistributionChart({
  distribution,
}: {
  distribution: Record<RiskCategory, number>
}) {
  const { t } = useTranslation()
  const data = (Object.keys(distribution) as RiskCategory[]).map((key) => ({
    key,
    name: t(`risk.${key}`),
    value: distribution[key],
  }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={2}
        >
          {data.map((slice) => (
            <Cell key={slice.key} fill={SLICE_COLOR[slice.key]} />
          ))}
        </Pie>
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
