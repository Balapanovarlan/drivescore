import { describe, it, expect } from 'vitest'
import { computeScore, riskCategory } from './scoring'
import type { ScoreInput } from '@/data/types'

const zero: ScoreInput = {
  mileageKm: 1000,
  speeding: 0,
  harshBraking: 0,
  harshAcceleration: 0,
  phoneUsage: 0,
  redLight: 0,
  accident: 0,
}

describe('computeScore', () => {
  it('gives a perfect score for zero events', () => {
    const r = computeScore(zero)
    expect(r.score).toBe(100)
    expect(r.riskCategory).toBe('low')
    expect(r.premiumCoefficient).toBe(0.85)
  })

  it('applies the full speeding weight when the rate hits the threshold', () => {
    // 10 events over 1000 km => rate 10 == threshold => full 25-point penalty
    const r = computeScore({ ...zero, speeding: 10 })
    expect(r.score).toBe(75)
    expect(r.riskCategory).toBe('medium')
    expect(r.premiumCoefficient).toBe(1)
    expect(r.breakdown.speeding).toBe(25)
  })

  it('caps a factor penalty at its weight even past the threshold', () => {
    const r = computeScore({ ...zero, speeding: 100 })
    expect(r.breakdown.speeding).toBe(25)
  })

  it('classifies a heavy-violation driver as high risk', () => {
    // speeding 25 + accident 22 + redLight 16 = 63 penalty => score 37
    const r = computeScore({ ...zero, speeding: 10, accident: 2, redLight: 3 })
    expect(r.score).toBe(37)
    expect(r.riskCategory).toBe('high')
    expect(r.premiumCoefficient).toBe(1.35)
  })

  it('clamps the score to zero', () => {
    const r = computeScore({
      ...zero,
      speeding: 999,
      harshBraking: 999,
      harshAcceleration: 999,
      phoneUsage: 999,
      redLight: 999,
      accident: 999,
    })
    expect(r.score).toBe(0)
  })
})

describe('riskCategory', () => {
  it('maps score ranges to categories', () => {
    expect(riskCategory(100)).toBe('low')
    expect(riskCategory(80)).toBe('low')
    expect(riskCategory(79)).toBe('medium')
    expect(riskCategory(50)).toBe('medium')
    expect(riskCategory(49)).toBe('high')
    expect(riskCategory(0)).toBe('high')
  })
})
