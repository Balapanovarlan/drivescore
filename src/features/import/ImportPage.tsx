import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import {
  UploadSimpleIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { Button } from '@/components/ui/button'
import { importViolationsCsv, type ImportResult } from '@/api/import.api'
import { cn } from '@/lib/utils'

type Status = 'success' | 'partial' | 'failure'

function statusFromResult(r: ImportResult): Status {
  if (r.errors.length === 0) return 'success'
  if (r.importedRecords > 0) return 'partial'
  return 'failure'
}

const STATUS_STYLE: Record<
  Status,
  { icon: typeof CheckCircleIcon; tint: string; border: string; iconColor: string }
> = {
  success: {
    icon: CheckCircleIcon,
    tint: 'bg-risk-low/10',
    border: 'border-risk-low/30',
    iconColor: 'text-risk-low',
  },
  partial: {
    icon: WarningCircleIcon,
    tint: 'bg-risk-medium/10',
    border: 'border-risk-medium/30',
    iconColor: 'text-risk-medium',
  },
  failure: {
    icon: XCircleIcon,
    tint: 'bg-risk-high/10',
    border: 'border-risk-high/30',
    iconColor: 'text-risk-high',
  },
}

export default function ImportPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [fileName, setFileName] = useState<string | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setResult(null)
    setError(null)
    setPending(true)
    try {
      const res = await importViolationsCsv(file)
      setResult(res)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function reset() {
    setFileName(null)
    setResult(null)
    setError(null)
    inputRef.current?.click()
  }

  const status = result ? statusFromResult(result) : null

  return (
    <div className="flex flex-col gap-6" data-testid="page-import">
      <PageHeader title={t('pages.import')} subtitle={t('import.subtitle')} />

      <SectionCard title={t('import.upload')} icon={UploadSimpleIcon}>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed py-10 text-sm text-muted-foreground hover:bg-secondary">
          <UploadSimpleIcon size={28} />
          {pending ? t('import.uploading') : (fileName ?? t('import.selectFile'))}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        <p className="mt-3 text-xs text-muted-foreground">
          {t('import.hint')}
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-2xl border border-risk-high/30 bg-risk-high/10 p-4"
          >
            <XCircleIcon size={20} className="mt-0.5 text-risk-high" weight="fill" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-risk-high">{t('import.networkErrorTitle')}</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
      </SectionCard>

      {result && status && (
        <ResultCard
          status={status}
          result={result}
          fileName={fileName ?? ''}
          onUploadAnother={reset}
          onViewDrivers={() => navigate('/drivers')}
        />
      )}
    </div>
  )
}

function ResultCard({
  status,
  result,
  fileName,
  onUploadAnother,
  onViewDrivers,
}: {
  status: Status
  result: ImportResult
  fileName: string
  onUploadAnother: () => void
  onViewDrivers: () => void
}) {
  const { t } = useTranslation()
  const style = STATUS_STYLE[status]
  const Icon = style.icon

  const titleKey =
    status === 'success'
      ? 'import.successTitle'
      : status === 'partial'
        ? 'import.partialTitle'
        : 'import.failureTitle'
  const messageKey =
    status === 'success'
      ? 'import.successMessage'
      : status === 'partial'
        ? 'import.partialMessage'
        : 'import.failureMessage'

  return (
    <section
      className={cn(
        'soft-shadow rounded-[2rem] border bg-card p-6 sm:p-8',
        style.border,
      )}
      data-testid="import-result"
    >
      <header className={cn('mb-6 flex items-start gap-4 rounded-2xl p-4', style.tint)}>
        <Icon size={28} weight="fill" className={cn('mt-0.5 shrink-0', style.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-base font-bold', style.iconColor)}>{t(titleKey)}</p>
          <p className="text-sm text-muted-foreground">{t(messageKey)}</p>
          {fileName && (
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {fileName}
            </p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat
          label={t('import.statImported')}
          value={String(result.importedRecords)}
          tone={result.importedRecords > 0 ? 'good' : 'muted'}
        />
        <Stat
          label={t('import.statRecomputed')}
          value={String(result.recomputedDrivers)}
          tone="muted"
        />
        <Stat
          label={t('import.statErrors')}
          value={String(result.errors.length)}
          tone={result.errors.length > 0 ? 'bad' : 'muted'}
        />
      </div>

      {result.errors.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('import.errorListTitle')}
          </p>
          <ul className="flex flex-col gap-2 rounded-2xl border bg-background p-4">
            {result.errors.slice(0, 20).map((e) => (
              <li key={e.row} className="flex items-start gap-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground">
                  {t('import.errorRow', { row: e.row })}
                </span>
                <span className="text-risk-high">{e.message}</span>
              </li>
            ))}
            {result.errors.length > 20 && (
              <li className="text-xs text-muted-foreground">
                {t('import.errorMore', { count: result.errors.length - 20 })}
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onUploadAnother} variant="outline">
          {t('import.uploadAnother')}
        </Button>
        {result.recomputedDrivers > 0 && (
          <Button onClick={onViewDrivers}>{t('import.viewDrivers')}</Button>
        )}
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
        >
          {t('import.viewDashboard')}
        </Link>
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'good' | 'bad' | 'muted'
}) {
  const color =
    tone === 'good' ? 'text-risk-low' : tone === 'bad' ? 'text-risk-high' : 'text-foreground'
  return (
    <div className="flex flex-col rounded-2xl border bg-background p-4">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
        {label}
      </span>
      <span className={cn('mt-1 font-mono text-3xl font-bold tabular-nums', color)}>
        {value}
      </span>
    </div>
  )
}
