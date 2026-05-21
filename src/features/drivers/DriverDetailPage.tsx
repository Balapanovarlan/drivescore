import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  GaugeIcon,
  CarIcon,
  LightningIcon,
  DeviceMobileIcon,
  TrafficSignIcon,
  WarningIcon,
  MapPinIcon,
  TrendUpIcon,
  SealCheckIcon,
  type Icon,
} from '@phosphor-icons/react'
import { ScoreTrendChart } from '@/components/charts/ScoreTrendChart'
import { RadarBreakdownChart } from '@/components/charts/RadarBreakdownChart'
import { useDriver } from '@/api/hooks/useDriver'
import { formatKm, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Locale, RiskCategory, ScoreFactor } from '@/data/types'

const FACTOR_ICON: Record<ScoreFactor, Icon> = {
  speeding: GaugeIcon,
  harshBraking: CarIcon,
  harshAcceleration: LightningIcon,
  phoneUsage: DeviceMobileIcon,
  redLight: TrafficSignIcon,
  accident: WarningIcon,
}

const RISK_TEXT: Record<RiskCategory, string> = {
  low: 'text-risk-low',
  medium: 'text-risk-medium',
  high: 'text-risk-high',
}

const CARD = 'rounded-[2rem] bg-card p-6 soft-shadow sm:p-8'

function ScoreRing({ score }: { score: number }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference * (1 - clamped / 100)
  return (
    <div className="relative flex size-48 items-center justify-center">
      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold tracking-tighter">
          {Math.round(clamped)}
        </span>
        <span className="mt-1 text-sm font-medium uppercase tracking-widest text-white/50">
          / 100
        </span>
      </div>
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border bg-background p-3 sm:items-start sm:p-4">
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
        {label}
      </span>
      <span className="text-lg font-bold leading-tight sm:text-2xl">{value}</span>
    </div>
  )
}

export default function DriverDetailPage() {
  const { t, i18n } = useTranslation()
  const { id = '' } = useParams()
  const { data: driver, isLoading } = useDriver(id)
  const locale = (i18n.resolvedLanguage ?? 'ru') as Locale

  if (isLoading) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>
  }
  if (!driver) {
    return <p className="text-risk-high">{t('common.error')}</p>
  }

  const history = driver.scoreHistory
  const monthlyDelta =
    history.length >= 2 ? driver.score - history[history.length - 2].score : 0
  const initials = driver.fullName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="grid grid-cols-12 gap-6" data-testid="page-driver-detail">
      {/* Profile header */}
      <section
        className={cn(
          CARD,
          'relative col-span-12 flex flex-col justify-center items-center gap-8 overflow-hidden sm:flex-row sm:items-center lg:col-span-8',
        )}
      >
        <div className="pointer-events-none absolute -top-32 right-0 size-64 translate-x-1/4 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative z-10 shrink-0">
          <div className="size-32 rounded-full bg-gradient-to-tr from-primary to-primary-deep p-1">
            <div className="flex size-full items-center justify-center rounded-full border-4 border-card bg-secondary text-2xl font-bold">
              {initials}
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate px-3 py-1 text-xs font-bold text-slate-foreground">
            ID: #{driver.id}
          </div>
        </div>
        <div className="z-10 w-full flex-1 text-center sm:text-left">
          <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {driver.fullName}
              </h2>
              <p className="flex items-center justify-center gap-1 text-muted-foreground sm:justify-start">
                <MapPinIcon size={16} />
                {driver.city}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold',
                RISK_TEXT[driver.riskCategory],
              )}
            >
              <SealCheckIcon size={18} weight="fill" />
              {t(`risk.${driver.riskCategory}`)}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <StatTile
              label={t('driverDetail.mileage')}
              value={formatKm(driver.scoreInput.mileageKm, locale)}
            />
            <StatTile
              label={t('driverDetail.experience')}
              value={`${driver.experienceYears} ${t('driverDetail.years')}`}
            />
            <StatTile
              label={t('driverDetail.incidents')}
              value={String(driver.violations.length)}
            />
          </div>
        </div>
      </section>

      {/* Driver score (dark) */}
      <section className="col-span-12 flex flex-col items-center justify-center rounded-[2rem] bg-slate p-6 text-slate-foreground shadow-2xl sm:p-8 lg:col-span-4">
        <h3 className="mb-6 w-full text-center text-xl font-semibold">
          {t('driverDetail.driverScore')}
        </h3>
        <ScoreRing score={driver.score} />
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
          <TrendUpIcon size={16} />
          {monthlyDelta >= 0 ? '+' : ''}
          {monthlyDelta} {t('driverDetail.points')} · {t('driverDetail.thisMonth')}
        </div>
      </section>

      {/* Risk factor analysis */}
      <section className={cn(CARD, 'col-span-12 flex flex-col lg:col-span-6')}>
        <h3 className="mb-6 text-xl font-semibold">
          {t('driverDetail.riskFactors')}
        </h3>
        <div className="flex flex-1 items-center justify-center">
          <RadarBreakdownChart breakdown={driver.breakdown} />
        </div>
      </section>

      {/* Score trend */}
      <section className={cn(CARD, 'col-span-12 flex flex-col lg:col-span-6')}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {t('driverDetail.scoreHistory')}
          </h3>
          <span className="rounded-xl border bg-background px-3 py-1 text-sm text-muted-foreground">
            {t('driverDetail.lastSixPeriods')}
          </span>
        </div>
        <ScoreTrendChart history={driver.scoreHistory} />
      </section>

      {/* Recent telematics events */}
      <section className={cn(CARD, 'col-span-12')}>
        <h3 className="mb-6 text-xl font-semibold">
          {t('driverDetail.recentEvents')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-4 font-semibold">{t('driverDetail.colType')}</th>
                <th className="pb-4 font-semibold">{t('driverDetail.colDate')}</th>
                <th className="pb-4 text-right font-semibold">
                  {t('driverDetail.colSeverity')}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {driver.events.map((event) => {
                const EventIcon = FACTOR_ICON[event.type]
                return (
                  <tr
                    key={event.id}
                    className="border-b last:border-b-0 hover:bg-background"
                  >
                    <td className="py-4">
                      <span className="flex items-center gap-3 font-medium">
                        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <EventIcon size={18} />
                        </span>
                        {t(`factor.${event.type}`)}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {formatDate(event.occurredAt, locale)}
                    </td>
                    <td className="py-4 text-right">
                      <span className="rounded-full bg-muted px-3 py-1 font-mono text-xs font-bold">
                        {event.severity}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
