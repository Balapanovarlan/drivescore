import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { RiskCategory } from '@/data/types'

const DOT_CLASS: Record<RiskCategory, string> = {
  low: 'bg-risk-low',
  medium: 'bg-risk-medium',
  high: 'bg-risk-high',
}

export function RiskBadge({ category }: { category: RiskCategory }) {
  const { t } = useTranslation()
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
      <span className={cn('size-2 rounded-full', DOT_CLASS[category])} />
      {t(`risk.${category}`)}
    </span>
  )
}
