import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Locale } from '@/data/types'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'kk', label: 'KZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'ru') as Locale
  return (
    <div className="inline-flex items-center rounded-full border bg-card p-0.5">
      {LOCALES.map((loc) => (
        <button
          key={loc.code}
          type="button"
          onClick={() => void i18n.changeLanguage(loc.code)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
            current === loc.code
              ? 'bg-slate text-slate-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {loc.label}
        </button>
      ))}
    </div>
  )
}
