export type Locale = 'kk' | 'ru' | 'en'

export type LocalizedText = Record<Locale, string>

export type RiskCategory = 'low' | 'medium' | 'high'

export type ScoreFactor =
  | 'speeding'
  | 'harshBraking'
  | 'harshAcceleration'
  | 'phoneUsage'
  | 'redLight'
  | 'accident'

/** Raw counts for one scoring period (one year). */
export interface ScoreInput {
  mileageKm: number
  speeding: number
  harshBraking: number
  harshAcceleration: number
  phoneUsage: number
  redLight: number
  accident: number
}

export interface ScoreResult {
  score: number
  riskCategory: RiskCategory
  premiumCoefficient: number
  breakdown: Record<ScoreFactor, number>
}

export interface TelematicsEvent {
  id: string
  type: 'speeding' | 'harshBraking' | 'harshAcceleration' | 'phoneUsage'
  occurredAt: string
  severity: string
}

export interface Violation {
  id: string
  type: 'redLight' | 'speedingCamera' | 'accident'
  occurredAt: string
  fineKzt: number | null
  atFault: boolean | null
}

export interface Driver {
  id: string
  fullName: string
  licenseNumber: string
  experienceYears: number
  city: string
  addedAt: string
  scoreInput: ScoreInput
  events: TelematicsEvent[]
  violations: Violation[]
  scoreHistory: { period: string; score: number }[]
}

export interface DashboardSummary {
  totalDrivers: number
  averageScore: number
  highRiskShare: number
  estimatedLossRatio: number
  riskDistribution: Record<RiskCategory, number>
  scoreHistogram: { range: string; count: number; band: RiskCategory }[]
}
