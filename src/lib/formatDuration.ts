import type { TFunction } from 'i18next'

/**
 * Renders a duration in seconds as a human-friendly localized string.
 * Examples (en): 45 → "45 seconds", 90 → "1 minute 30 seconds",
 *                900 → "15 minutes", 3600 → "1 hour".
 */
export function formatDuration(seconds: number, t: TFunction): string {
  const s = Math.max(0, Math.round(seconds))
  if (s < 60) {
    return t('time.seconds', { count: s })
  }
  const totalMinutes = Math.floor(s / 60)
  const remSeconds = s % 60
  if (totalMinutes < 60) {
    if (remSeconds === 0) return t('time.minutes', { count: totalMinutes })
    return `${t('time.minutes', { count: totalMinutes })} ${t('time.seconds', { count: remSeconds })}`
  }
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (minutes === 0) return t('time.hours', { count: hours })
  return `${t('time.hours', { count: hours })} ${t('time.minutes', { count: minutes })}`
}
