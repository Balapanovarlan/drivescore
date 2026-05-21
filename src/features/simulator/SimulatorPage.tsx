import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  SlidersHorizontalIcon,
  GaugeIcon,
  ChartBarIcon,
  ArrowCounterClockwiseIcon,
  MinusIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { ScoreGauge } from '@/components/widgets/ScoreGauge'
import { RiskBadge } from '@/components/widgets/RiskBadge'
import { CoefficientTag } from '@/components/widgets/CoefficientTag'
import { StatRow } from '@/components/widgets/StatRow'
import { PenaltyBars } from '@/components/charts/PenaltyBars'
import { Button } from '@/components/ui/button'
import { simulateScore, type SimulateIn } from '@/api/simulate.api'
import { formatKzt } from '@/lib/format'
import type { Locale, ScoreFactor } from '@/data/types'

interface SimulatorInput {
  speeding: number
  harshBraking: number
  harshAcceleration: number
  phoneUsage: number
  redLight: number
  accident: number
}

const INITIAL: SimulatorInput = {
  speeding: 0,
  harshBraking: 0,
  harshAcceleration: 0,
  phoneUsage: 0,
  redLight: 0,
  accident: 0,
}

const FACTOR_FIELDS = [
  'speeding',
  'harshBraking',
  'harshAcceleration',
  'phoneUsage',
  'redLight',
  'accident',
] as const

// Each frontend factor maps to a representative КоАП article from формула.docx §3.
// Picked so the article's factor_group matches the simulator label.
const ARTICLE_FOR_FACTOR: Record<keyof SimulatorInput, string> = {
  speeding: 'Art.592', // minor speeding (W=2)
  harshBraking: 'Art.596 Part 3', // dangerous overtaking (W=15)
  harshAcceleration: 'Art.593', // seatbelt (W=3)
  phoneUsage: 'Art.591', // phone usage (W=5)
  redLight: 'Art.599', // red light (W=8)
  accident: 'Art.611 Part 2', // leaving accident scene (W=18, at_fault)
}

function buildPayload(input: SimulatorInput): SimulateIn {
  const today = new Date().toISOString().slice(0, 10)
  const violations: SimulateIn['violations'] = []
  for (const key of FACTOR_FIELDS) {
    const count = input[key]
    for (let i = 0; i < count; i++) {
      violations.push({
        articleCode: ARTICLE_FOR_FACTOR[key],
        occurredAt: today,
        atFault: key === 'accident',
      })
    }
  }
  return { violations, accidentCount: input.accident }
}

function Stepper({
  value,
  onChange,
  step = 1,
}: {
  value: number
  onChange: (value: number) => void
  step?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(0, value - step))}
        className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-secondary"
      >
        <MinusIcon size={14} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label="value"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '')
          onChange(digits === '' ? 0 : Number(digits))
        }}
        className="w-16 rounded-lg border border-transparent bg-transparent py-1 text-center font-mono font-semibold tabular-nums outline-none focus:border-border focus:bg-secondary"
      />
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(value + step)}
        className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-secondary"
      >
        <PlusIcon size={14} />
      </button>
    </div>
  )
}

const EMPTY_BREAKDOWN: Record<ScoreFactor, number> = {
  speeding: 0,
  harshBraking: 0,
  harshAcceleration: 0,
  phoneUsage: 0,
  redLight: 0,
  accident: 0,
}

export default function SimulatorPage() {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage ?? 'ru') as Locale
  const [input, setInput] = useState<SimulatorInput>(INITIAL)

  const query = useQuery({
    queryKey: ['simulate', input],
    queryFn: () => simulateScore(buildPayload(input)),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
  const result = query.data

  function setField(key: keyof SimulatorInput, value: number) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-6" data-testid="page-simulator">
      <PageHeader title={t('pages.simulator')} subtitle={t('simulator.subtitle')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Parameters */}
        <SectionCard
          title={t('simulator.inputs')}
          icon={SlidersHorizontalIcon}
          action={
            <Button variant="outline" size="sm" onClick={() => setInput(INITIAL)}>
              <ArrowCounterClockwiseIcon size={14} />
              {t('simulator.reset')}
            </Button>
          }
        >
          <div className="flex flex-col">
            {FACTOR_FIELDS.map((factor) => (
              <div
                key={factor}
                className="flex items-center justify-between border-t py-3 first:border-t-0"
              >
                <span className="text-sm font-medium">{t(`factor.${factor}`)}</span>
                <Stepper
                  value={input[factor]}
                  onChange={(value) => setField(factor, value)}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Result */}
        <SectionCard title={t('simulator.result')} icon={GaugeIcon}>
          <div className="flex flex-col items-center gap-4">
            <ScoreGauge score={result?.score ?? 100} />
            <RiskBadge category={result?.riskCategory ?? 'low'} />
          </div>
          <div className="mt-6">
            <StatRow
              label={t('simulator.coefficient')}
              value={
                <CoefficientTag coefficient={result?.premiumCoefficient ?? 0.9} />
              }
            />
            <StatRow
              label={t('simulator.estPremium')}
              value={formatKzt(result?.finalPremiumKzt ?? 0, locale)}
            />
          </div>
        </SectionCard>
      </div>

      {/* Penalty distribution */}
      <SectionCard title={t('simulator.penaltyDistribution')} icon={ChartBarIcon}>
        <PenaltyBars breakdown={result?.breakdown ?? EMPTY_BREAKDOWN} />
      </SectionCard>
    </div>
  )
}
