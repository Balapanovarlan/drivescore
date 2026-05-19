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
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}
