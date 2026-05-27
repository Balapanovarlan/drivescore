import { apiClient } from './client'
import type { RiskCategory, ScoreFactor } from '@/data/types'

export interface SimulateViolationIn {
  articleCode: string
  occurredAt: string // ISO date (YYYY-MM-DD)
  atFault: boolean
}

export interface SimulateIn {
  violations: SimulateViolationIn[]
  accidentCount: number
  basePremium?: number
}

export interface SimulateResult {
  score: number
  riskCategory: RiskCategory
  riskTier: RiskCategory
  premiumCoefficient: number
  finalPremiumKzt: number
  breakdown: Record<ScoreFactor, number>
}

export async function simulateScore(input: SimulateIn): Promise<SimulateResult> {
  const { data } = await apiClient.post<SimulateResult>('/score/simulate', input)
  return data
}
