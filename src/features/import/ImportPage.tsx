import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { UploadSimpleIcon, EyeIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useImportCsv } from '@/api/hooks/useImportCsv'

type Kind = 'events' | 'violations'

export default function ImportPage() {
  const { t } = useTranslation()
  const [kind, setKind] = useState<Kind>('events')
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<string[]>([])
  const importMutation = useImportCsv()

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const text = await file.text()
    setRows(text.split(/\r?\n/).filter((line) => line.trim().length > 0))
    importMutation.reset()
  }

  function handleImport() {
    importMutation.mutate({ kind, rows: Math.max(0, rows.length - 1) })
  }

  return (
    <div className="flex flex-col gap-6" data-testid="page-import">
      <PageHeader title={t('pages.import')} subtitle={t('import.subtitle')} />

      <SectionCard title={t('import.upload')} icon={UploadSimpleIcon}>
        <div className="mb-4 flex gap-1">
          {(['events', 'violations'] as Kind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium',
                kind === k
                  ? 'bg-slate text-slate-foreground'
                  : 'text-muted-foreground hover:bg-secondary',
              )}
            >
              {k === 'events' ? t('import.kindEvents') : t('import.kindViolations')}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed py-10 text-sm text-muted-foreground hover:bg-secondary">
          <UploadSimpleIcon size={28} />
          {fileName ?? t('import.selectFile')}
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      </SectionCard>

      {rows.length > 0 && (
        <SectionCard title={t('import.preview')} icon={EyeIcon}>
          <pre className="max-h-60 overflow-auto rounded-xl bg-muted p-3 font-mono text-xs">
            {rows.slice(0, 10).join('\n')}
          </pre>
          <Button
            className="mt-4"
            onClick={handleImport}
            disabled={importMutation.isPending}
          >
            {t('import.submit')}
          </Button>
          {importMutation.data && (
            <p className="mt-3 text-sm font-medium text-risk-low">
              {t('import.result', {
                records: importMutation.data.importedRecords,
                drivers: importMutation.data.recomputedDrivers,
              })}
            </p>
          )}
        </SectionCard>
      )}
    </div>
  )
}
