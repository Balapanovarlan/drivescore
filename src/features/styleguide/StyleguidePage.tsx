import { PageHeader } from '@/components/layout/PageHeader'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SectionCard } from '@/components/widgets/SectionCard'
import { KpiCard } from '@/components/widgets/KpiCard'
import { RiskBadge } from '@/components/widgets/RiskBadge'
import { CoefficientTag } from '@/components/widgets/CoefficientTag'
import { StatRow } from '@/components/widgets/StatRow'
import { EmptyState } from '@/components/widgets/EmptyState'
import { ScoreGauge } from '@/components/widgets/ScoreGauge'
import { DataTable, type Column } from '@/components/widgets/DataTable'
import { RadarBreakdownChart } from '@/components/charts/RadarBreakdownChart'
import { ScoreTrendChart } from '@/components/charts/ScoreTrendChart'
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart'
import { ScoreHistogram } from '@/components/charts/ScoreHistogram'
import { PenaltyBars } from '@/components/charts/PenaltyBars'
import { TrayIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { MOCK_DRIVERS, driverScore, buildDashboardSummary } from '@/data/drivers.mock'

const driver = MOCK_DRIVERS[0]
const result = driverScore(driver)
const summary = buildDashboardSummary(MOCK_DRIVERS)

interface DemoRow {
  name: string
  score: number
}
const demoColumns: Column<DemoRow>[] = [
  { key: 'name', header: 'Driver', render: (r) => r.name, sortValue: (r) => r.name },
  {
    key: 'score',
    header: 'Score',
    align: 'right',
    render: (r) => r.score,
    sortValue: (r) => r.score,
  },
]
const demoRows: DemoRow[] = MOCK_DRIVERS.map((d) => ({
  name: d.fullName,
  score: driverScore(d).score,
}))

export default function StyleguidePage() {
  return (
    <div className="flex flex-col gap-6" data-testid="page-styleguide">
      <Breadcrumb items={[{ label: 'DriveScore', to: '/' }, { label: 'Styleguide' }]} />
      <PageHeader title="Styleguide" subtitle="Widget and chart component reference" />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total drivers" value={String(summary.totalDrivers)} />
        <KpiCard
          label="Average score"
          value={String(summary.averageScore)}
          delta="+3"
          deltaDirection="up"
        />
        <KpiCard
          label="High-risk share"
          value={`${summary.highRiskShare}%`}
          delta="-2%"
          deltaDirection="down"
        />
        <KpiCard label="Loss ratio" value={summary.estimatedLossRatio.toFixed(2)} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SectionCard title="ScoreGauge & badges" icon={SquaresFourIcon}>
          <div className="flex items-center gap-6">
            <ScoreGauge score={result.score} />
            <div className="flex flex-col gap-3">
              <RiskBadge category="low" />
              <RiskBadge category="medium" />
              <RiskBadge category="high" />
              <CoefficientTag coefficient={result.premiumCoefficient} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="StatRow list" icon={SquaresFourIcon} caption="detail rows">
          <StatRow label="License" value={driver.licenseNumber} />
          <StatRow label="Experience" value={`${driver.experienceYears} yrs`} />
          <StatRow label="City" value={driver.city} />
        </SectionCard>

        <SectionCard title="Risk composition" icon={SquaresFourIcon}>
          <RadarBreakdownChart breakdown={result.breakdown} />
        </SectionCard>

        <SectionCard title="Penalty bars" icon={SquaresFourIcon}>
          <PenaltyBars breakdown={result.breakdown} />
        </SectionCard>

        <SectionCard title="Score trend" icon={SquaresFourIcon}>
          <ScoreTrendChart history={driver.scoreHistory} />
        </SectionCard>

        <SectionCard title="Risk distribution" icon={SquaresFourIcon}>
          <RiskDistributionChart distribution={summary.riskDistribution} />
        </SectionCard>

        <SectionCard title="Score histogram" icon={SquaresFourIcon}>
          <ScoreHistogram buckets={summary.scoreHistogram} />
        </SectionCard>

        <SectionCard title="Empty state" icon={SquaresFourIcon}>
          <EmptyState
            icon={TrayIcon}
            title="Nothing here yet"
            description="This is how an empty list renders."
          />
        </SectionCard>
      </div>

      <SectionCard title="DataTable" icon={SquaresFourIcon} caption="sortable, paginated">
        <DataTable columns={demoColumns} data={demoRows} />
      </SectionCard>
    </div>
  )
}
