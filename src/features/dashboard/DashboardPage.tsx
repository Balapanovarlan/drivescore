import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ChartPieIcon, ChartBarIcon, WarningIcon, EyeIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { KpiCard } from '@/components/widgets/KpiCard'
import { RiskBadge } from '@/components/widgets/RiskBadge'
import { DataTable, type Column } from '@/components/widgets/DataTable'
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart'
import { ScoreHistogram } from '@/components/charts/ScoreHistogram'
import { useDashboardSummary } from '@/api/hooks/useDashboardSummary'
import { useDrivers } from '@/api/hooks/useDrivers'
import type { DriverListItem } from '@/api/drivers.api'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const summary = useDashboardSummary()
  const drivers = useDrivers()

  if (summary.isLoading || drivers.isLoading) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>
  }
  if (!summary.data || !drivers.data) {
    return <p className="text-risk-high">{t('common.error')}</p>
  }

  const s = summary.data
  const topRisk = [...drivers.data].sort((a, b) => a.score - b.score).slice(0, 10)

  const columns: Column<DriverListItem>[] = [
    {
      key: 'name',
      header: t('drivers.colName'),
      render: (d) => d.fullName,
      sortValue: (d) => d.fullName,
    },
    {
      key: 'license',
      header: t('drivers.colLicense'),
      render: (d) => d.licenseNumber,
    },
    {
      key: 'score',
      header: t('drivers.colScore'),
      align: 'right',
      render: (d) => (
        <span className="font-mono tabular-nums">{d.score}</span>
      ),
      sortValue: (d) => d.score,
    },
    {
      key: 'risk',
      header: t('drivers.colRisk'),
      render: (d) => <RiskBadge category={d.riskCategory} />,
    },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (d) => (
        <button
          type="button"
          aria-label={t('drivers.details')}
          title={t('drivers.details')}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/drivers/${d.id}`)
          }}
          className="inline-flex size-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
        >
          <EyeIcon size={16} />
        </button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6" data-testid="page-dashboard">
      <PageHeader title={t('pages.dashboard')} subtitle={t('dashboard.subtitle')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label={t('dashboard.kpiAvg')}
          value={String(s.averageScore)}
          dark
        />
        <KpiCard label={t('dashboard.kpiTotal')} value={String(s.totalDrivers)} />
        <KpiCard
          label={t('dashboard.kpiHighRisk')}
          value={`${s.highRiskShare}%`}
        />
        <KpiCard
          label={t('dashboard.kpiLossRatio')}
          value={s.estimatedLossRatio.toFixed(2)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title={t('dashboard.riskDist')} icon={ChartPieIcon}>
          <RiskDistributionChart distribution={s.riskDistribution} />
        </SectionCard>
        <SectionCard title={t('dashboard.scoreDist')} icon={ChartBarIcon}>
          <ScoreHistogram buckets={s.scoreHistogram} />
        </SectionCard>
      </div>

      <SectionCard title={t('dashboard.highRisk')} icon={WarningIcon}>
        <DataTable
          columns={columns}
          data={topRisk}
          pageSize={5}
          onRowClick={(d) => navigate(`/drivers/${d.id}`)}
        />
      </SectionCard>
    </div>
  )
}
