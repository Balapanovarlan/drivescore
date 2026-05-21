import type { Locale } from '@/data/types'

const INTL_LOCALE: Record<Locale, string> = {
  kk: 'kk-KZ',
  ru: 'ru-KZ',
  en: 'en-US',
}

const KM_UNIT: Record<Locale, string> = { kk: 'км', ru: 'км', en: 'km' }

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value)
}

export function formatKzt(value: number, locale: Locale): string {
  return `${formatNumber(value, locale)} ₸`
}

export function formatKm(value: number, locale: Locale): string {
  return `${formatNumber(value, locale)} ${KM_UNIT[locale]}`
}

export function formatDate(iso: string, locale: Locale): string {
  // Numeric day/month/year — same shape in every locale. The 'short' month
  // format produced "M04"-style placeholders in Kazakh because the kk CLDR
  // dataset isn't shipped in every JS engine; numeric is universally supported.
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}
