import type {
  RiskCategory,
  ScoreFactor,
  ScoreInput,
  ScoreResult,
} from '@/data/types'

interface FactorConfig {
  weight: number
  threshold: number
  perMileage: boolean
}

const FACTORS: Record<ScoreFactor, FactorConfig> = {
  speeding: { weight: 25, threshold: 10, perMileage: true },
  accident: { weight: 22, threshold: 2, perMileage: false },
  redLight: { weight: 16, threshold: 3, perMileage: false },
  phoneUsage: { weight: 15, threshold: 20, perMileage: true },
  harshBraking: { weight: 12, threshold: 15, perMileage: true },
  harshAcceleration: { weight: 10, threshold: 15, perMileage: true },
}

export const FACTOR_WEIGHTS = Object.fromEntries(
  (Object.keys(FACTORS) as ScoreFactor[]).map((key) => [key, FACTORS[key].weight]),
) as Record<ScoreFactor, number>

export function riskCategory(score: number): RiskCategory {
  if (score >= 80) return 'low'
  if (score >= 50) return 'medium'
  return 'high'
}

const COEFFICIENT: Record<RiskCategory, number> = {
  low: 0.85,
  medium: 1,
  high: 1.35,
}

export function computeScore(input: ScoreInput): ScoreResult {
  const breakdown = {} as Record<ScoreFactor, number>
  let totalPenalty = 0

  for (const key of Object.keys(FACTORS) as ScoreFactor[]) {
    const cfg = FACTORS[key]
    const count = input[key]
    const rate = cfg.perMileage
      ? (count / input.mileageKm) * 1000
      : count
    const penalty = cfg.weight * Math.min(rate / cfg.threshold, 1)
    const rounded = Math.round(penalty * 100) / 100
    breakdown[key] = rounded
    totalPenalty += rounded
  }

  totalPenalty = Math.round(totalPenalty * 100) / 100
  const score = Math.max(0, Math.min(100, Math.round(100 - totalPenalty)))
  const category = riskCategory(score)

  return {
    score,
    riskCategory: category,
    premiumCoefficient: COEFFICIENT[category],
    breakdown,
  }
}
