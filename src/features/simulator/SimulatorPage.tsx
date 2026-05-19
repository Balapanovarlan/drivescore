import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { computeScore } from '@/lib/scoring'
import { formatKzt } from '@/lib/format'
import type { Locale, ScoreInput } from '@/data/types'

const INITIAL: ScoreInput = {
  mileageKm: 10000,
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

// Illustrative base annual premium (KZT); the tariff coefficient is applied to it.
const BASE_PREMIUM_KZT = 50000

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

export default function SimulatorPage() {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage ?? 'ru') as Locale
  const [input, setInput] = useState<ScoreInput>(INITIAL)

  const result = computeScore(input)
  const estimatedPremium = Math.round(BASE_PREMIUM_KZT * result.premiumCoefficient)

  function setField(key: keyof ScoreInput, value: number) {
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput(INITIAL)}
            >
              <ArrowCounterClockwiseIcon size={14} />
              {t('simulator.reset')}
            </Button>
          }
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-t py-3 first:border-t-0">
              <span className="text-sm font-medium">
                {t('simulator.mileage')}
              </span>
              <Stepper
                value={input.mileageKm}
                onChange={(value) => setField('mileageKm', value)}
                step={500}
              />
            </div>
            {FACTOR_FIELDS.map((factor) => (
              <div
                key={factor}
                className="flex items-center justify-between border-t py-3"
              >
                <span className="text-sm font-medium">
                  {t(`factor.${factor}`)}
                </span>
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
            <ScoreGauge score={result.score} />
            <RiskBadge category={result.riskCategory} />
          </div>
          <div className="mt-6">
            <StatRow
              label={t('simulator.coefficient')}
              value={<CoefficientTag coefficient={result.premiumCoefficient} />}
            />
            <StatRow
              label={t('simulator.estPremium')}
              value={formatKzt(estimatedPremium, locale)}
            />
          </div>
        </SectionCard>
      </div>

      {/* Penalty distribution */}
      <SectionCard
        title={t('simulator.penaltyDistribution')}
        icon={ChartBarIcon}
      >
        <PenaltyBars breakdown={result.breakdown} />
      </SectionCard>
    </div>
  )
}
