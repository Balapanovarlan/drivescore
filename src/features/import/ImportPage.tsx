import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UploadSimpleIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { importViolationsCsv, type ImportResult } from '@/api/import.api'

export default function ImportPage() {
  const { t } = useTranslation()
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

  return (
    <div className="flex flex-col gap-6" data-testid="page-import">
      <PageHeader title={t('pages.import')} subtitle={t('import.subtitle')} />

      <SectionCard title={t('import.upload')} icon={UploadSimpleIcon}>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed py-10 text-sm text-muted-foreground hover:bg-secondary">
          <UploadSimpleIcon size={28} />
          {pending ? '…' : (fileName ?? t('import.selectFile'))}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        {result && (
          <p className="mt-3 text-sm text-muted-foreground">
            {t('import.imported', { count: result.importedRecords })}
            {' · '}
            {t('import.recomputed', { count: result.recomputedDrivers })}
          </p>
        )}
        {result?.errors && result.errors.length > 0 && (
          <ul className="mt-2 text-sm text-risk-high">
            {result.errors.slice(0, 5).map((e) => (
              <li key={e.row}>row {e.row}: {e.message}</li>
            ))}
          </ul>
        )}
        {error && <p className="mt-3 text-sm text-risk-high">{error}</p>}
      </SectionCard>
    </div>
  )
}
