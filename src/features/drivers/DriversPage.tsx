import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlassIcon, UsersIcon, EyeIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { RiskBadge } from '@/components/widgets/RiskBadge'
import { CoefficientTag } from '@/components/widgets/CoefficientTag'
import { DataTable, type Column } from '@/components/widgets/DataTable'
import { EmptyState } from '@/components/widgets/EmptyState'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useDrivers } from '@/api/hooks/useDrivers'
import type { DriverListItem } from '@/api/drivers.api'
import type { RiskCategory } from '@/data/types'

const RISK_FILTERS: (RiskCategory | 'all')[] = ['all', 'low', 'medium', 'high']

export default function DriversPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data, isLoading } = useDrivers()
  const [search, setSearch] = useState('')
  const [risk, setRisk] = useState<RiskCategory | 'all'>('all')

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    return data.filter((d) => {
      const matchesSearch =
        d.fullName.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q)
      const matchesRisk = risk === 'all' || d.riskCategory === risk
      return matchesSearch && matchesRisk
    })
  }, [data, search, risk])

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
      key: 'experience',
      header: t('drivers.colExperience'),
      align: 'right',
      render: (d) => d.experienceYears,
      sortValue: (d) => d.experienceYears,
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
      key: 'coef',
      header: t('drivers.colCoef'),
      align: 'right',
      render: (d) => <CoefficientTag coefficient={d.premiumCoefficient} />,
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
    <div className="flex flex-col gap-6" data-testid="page-drivers">
      <PageHeader
        title={t('pages.drivers')}
        subtitle={`${filtered.length} ${t('drivers.count')}`}
      />

      <SectionCard title={t('drivers.registry')} icon={UsersIcon}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-xs flex-1">
            <MagnifyingGlassIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-9"
              placeholder={t('drivers.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {RISK_FILTERS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRisk(r)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium',
                  risk === r
                    ? 'bg-slate text-slate-foreground'
                    : 'text-muted-foreground hover:bg-secondary',
                )}
              >
                {r === 'all' ? t('drivers.filterAll') : t(`risk.${r}`)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">{t('common.loading')}</p>
        ) : filtered.length === 0 ? (
          <EmptyState title={t('drivers.empty')} />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={8}
            onRowClick={(d) => navigate(`/drivers/${d.id}`)}
          />
        )}
      </SectionCard>
    </div>
  )
}
