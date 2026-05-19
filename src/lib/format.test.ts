import { describe, it, expect } from 'vitest'
import { formatKzt, formatKm, formatNumber } from './format'

describe('formatters', () => {
  it('formats tenge with a currency suffix', () => {
    expect(formatKzt(27560, 'ru')).toContain('27')
    expect(formatKzt(27560, 'ru')).toContain('₸')
  })

  it('formats kilometres', () => {
    expect(formatKm(8000, 'en')).toContain('8')
    expect(formatKm(8000, 'en')).toContain('km')
  })

  it('formats plain numbers with grouping', () => {
    expect(formatNumber(842, 'en')).toBe('842')
  })
})
