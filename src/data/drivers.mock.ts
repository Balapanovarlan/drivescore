import type { Driver, DashboardSummary, RiskCategory } from './types'
import { computeScore } from '@/lib/scoring'

// Placeholder portfolio loss ratio until real claims data is available.
const PLACEHOLDER_LOSS_RATIO = 0.63

// ---------------------------------------------------------------------------
// Deterministic driver generator
//
// Declared before MOCK_DRIVERS because the MOCK_DRIVERS initializer calls
// generateDrivers() at module-eval time — the data it reads must already exist.
// ---------------------------------------------------------------------------

const KAZAKH_NAMES = [
  'Arman Bekovich',
  'Zarina Alimova',
  'Nurlan Ospanov',
  'Aigerim Seitkali',
  'Serikbol Dzhaksybekov',
  'Madina Yesmagambetova',
  'Dauren Abenov',
  'Saltanat Kenzhebekova',
  'Askar Mukhambetov',
  'Gulnara Tleubayeva',
  'Timur Baimagambetov',
  'Dinara Abdrakhmanova',
  'Ruslan Saginov',
  'Asel Nurmagambetova',
  'Bekzat Zhaksylikov',
]

const CITIES = ['Astana', 'Almaty', 'Shymkent']

// scoreInput configurations chosen so computeScore produces a spread of scores
// across 0–100 (verified manually against the scoring formula).
// Each tuple: [mileageKm, speeding, harshBraking, harshAcceleration, phoneUsage, redLight, accident]
const SCORE_INPUTS: [number, number, number, number, number, number, number][] = [
  [10000, 0, 0, 0, 0, 0, 0], // ~100 (low)
  [10000, 2, 3, 2, 2, 0, 0], // ~96  (low)
  [10000, 5, 8, 5, 5, 0, 0], // ~91  (low)
  [10000, 9, 12, 9, 10, 0, 0], // ~84  (low)
  [10000, 12, 18, 14, 14, 1, 0], // ~75  (medium)
  [10000, 15, 22, 18, 18, 1, 0], // ~70  (medium)
  [10000, 20, 30, 22, 22, 2, 0], // ~63  (medium)
  [10000, 25, 35, 28, 28, 2, 0], // ~56  (medium)
  [10000, 30, 45, 35, 35, 2, 1], // ~44  (high)
  [10000, 40, 55, 45, 40, 3, 1], // ~33  (high)
  [10000, 55, 70, 55, 50, 3, 1], // ~22  (high)
  [10000, 70, 85, 70, 60, 4, 2], // ~10  (high)
  [10000, 80, 90, 80, 70, 4, 2], // ~5   (high)
  [10000, 10, 15, 10, 12, 0, 0], // ~82  (low)
  [10000, 18, 25, 20, 20, 1, 0], // ~68  (medium)
]

const EVENT_TYPES = [
  'speeding',
  'harshBraking',
  'harshAcceleration',
  'phoneUsage',
] as const
const EVENT_SEVERITIES = ['+12 km/h', '-3.8 m/s²', '+3.2 m/s²', '2 min 10 s']

function generateDrivers(): Driver[] {
  const drivers: Driver[] = []

  for (let idx = 0; idx < 15; idx++) {
    const id = `DR-007${String(idx + 1).padStart(2, '0')}`
    const fullName = KAZAKH_NAMES[idx % KAZAKH_NAMES.length]
    const city = CITIES[idx % CITIES.length]
    const experienceYears = 1 + ((idx * 3) % 20)
    const licenseNumber = `05 ${String(123 + idx * 17).padStart(3, '0')} ${String(
      456 + idx * 31,
    ).padStart(3, '0')}`
    const addedAt = `202${4 + (idx % 2)}-${String(1 + (idx % 12)).padStart(2, '0')}-${String(
      1 + (idx % 28),
    ).padStart(2, '0')}`

    const rawInput = SCORE_INPUTS[idx % SCORE_INPUTS.length]
    const scoreInput = {
      mileageKm: rawInput[0],
      speeding: rawInput[1],
      harshBraking: rawInput[2],
      harshAcceleration: rawInput[3],
      phoneUsage: rawInput[4],
      redLight: rawInput[5],
      accident: rawInput[6],
    }

    const finalScore = computeScore(scoreInput).score

    // 1–3 events
    const eventCount = 1 + (idx % 3)
    const events = Array.from({ length: eventCount }, (_, j) => ({
      id: `gen-e-${id}-${j}`,
      type: EVENT_TYPES[(idx + j) % EVENT_TYPES.length],
      occurredAt: `2026-05-${String(1 + ((idx * 3 + j) % 14)).padStart(2, '0')}`,
      severity: EVENT_SEVERITIES[(idx + j) % EVENT_SEVERITIES.length],
    }))

    // 0–3 violations
    const violationCount = idx % 4
    const violations = Array.from({ length: violationCount }, (_, j) => ({
      id: `gen-v-${id}-${j}`,
      type: (['redLight', 'speedingCamera', 'accident'] as const)[(idx + j) % 3],
      occurredAt: `2026-04-${String(1 + ((idx * 5 + j) % 28)).padStart(2, '0')}`,
      fineKzt: j % 2 === 0 ? 13780 + idx * 1000 : null,
      atFault: j % 3 === 0 ? true : null,
    }))

    // 6-entry scoreHistory whose final entry equals finalScore
    const historyBase = Math.max(5, finalScore - 10 + (idx % 5))
    const scoreHistory = [
      { period: '2025-12', score: Math.max(0, Math.min(100, historyBase - 4)) },
      { period: '2026-01', score: Math.max(0, Math.min(100, historyBase - 3)) },
      { period: '2026-02', score: Math.max(0, Math.min(100, historyBase - 2)) },
      { period: '2026-03', score: Math.max(0, Math.min(100, historyBase - 1)) },
      { period: '2026-04', score: Math.max(0, Math.min(100, historyBase)) },
      { period: '2026-05', score: finalScore },
    ]

    drivers.push({
      id,
      fullName,
      licenseNumber,
      experienceYears,
      city,
      addedAt,
      scoreInput,
      events,
      violations,
      scoreHistory,
    })
  }

  return drivers
}

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'DR-00428',
    fullName: 'Aibek Nurlanov',
    licenseNumber: '04 882 311',
    experienceYears: 7,
    city: 'Astana',
    addedAt: '2025-03-14',
    scoreInput: {
      mileageKm: 8000,
      speeding: 42,
      harshBraking: 70,
      harshAcceleration: 55,
      phoneUsage: 30,
      redLight: 2,
      accident: 1,
    },
    events: [
      { id: 'e1', type: 'harshBraking', occurredAt: '2026-05-12', severity: '-4.1 m/s²' },
      { id: 'e2', type: 'speeding', occurredAt: '2026-05-10', severity: '+18 km/h' },
      { id: 'e3', type: 'phoneUsage', occurredAt: '2026-05-09', severity: '3 min 20 s' },
    ],
    violations: [
      { id: 'v1', type: 'redLight', occurredAt: '2026-04-21', fineKzt: 27560, atFault: null },
      { id: 'v2', type: 'accident', occurredAt: '2025-11-08', fineKzt: null, atFault: true },
    ],
    scoreHistory: [
      { period: '2025-12', score: 44 },
      { period: '2026-01', score: 46 },
      { period: '2026-02', score: 45 },
      { period: '2026-03', score: 49 },
      { period: '2026-04', score: 50 },
      { period: '2026-05', score: 51 },
    ],
  },
  {
    id: 'DR-00591',
    fullName: 'Dana Yerlanqyzy',
    licenseNumber: '02 145 907',
    experienceYears: 12,
    city: 'Astana',
    addedAt: '2024-09-02',
    scoreInput: {
      mileageKm: 11000,
      speeding: 8,
      harshBraking: 20,
      harshAcceleration: 14,
      phoneUsage: 6,
      redLight: 0,
      accident: 0,
    },
    events: [
      { id: 'e4', type: 'harshBraking', occurredAt: '2026-05-03', severity: '-3.4 m/s²' },
    ],
    violations: [],
    scoreHistory: [
      { period: '2025-12', score: 89 },
      { period: '2026-01', score: 91 },
      { period: '2026-02', score: 92 },
      { period: '2026-03', score: 93 },
      { period: '2026-04', score: 94 },
      { period: '2026-05', score: 95 },
    ],
  },
  {
    id: 'DR-00614',
    fullName: 'Marat Saparov',
    licenseNumber: '03 720 558',
    experienceYears: 3,
    city: 'Astana',
    addedAt: '2025-11-20',
    scoreInput: {
      mileageKm: 6500,
      speeding: 80,
      harshBraking: 95,
      harshAcceleration: 88,
      phoneUsage: 60,
      redLight: 4,
      accident: 2,
    },
    events: [
      { id: 'e5', type: 'speeding', occurredAt: '2026-05-14', severity: '+27 km/h' },
      { id: 'e6', type: 'harshAcceleration', occurredAt: '2026-05-11', severity: '+4.6 m/s²' },
    ],
    violations: [
      { id: 'v3', type: 'speedingCamera', occurredAt: '2026-04-30', fineKzt: 13780, atFault: null },
      { id: 'v4', type: 'accident', occurredAt: '2026-02-17', fineKzt: null, atFault: true },
    ],
    scoreHistory: [
      { period: '2025-12', score: 23 },
      { period: '2026-01', score: 19 },
      { period: '2026-02', score: 16 },
      { period: '2026-03', score: 13 },
      { period: '2026-04', score: 11 },
      { period: '2026-05', score: 9 },
    ],
  },
  ...generateDrivers(),
]

/** Latest computed score result for a driver. */
export function driverScore(driver: Driver) {
  return computeScore(driver.scoreInput)
}

export function buildDashboardSummary(drivers: Driver[]): DashboardSummary {
  const results = drivers.map(driverScore)
  const total = drivers.length
  const avg =
    total === 0
      ? 0
      : Math.round(results.reduce((s, r) => s + r.score, 0) / total)
  const dist = { low: 0, medium: 0, high: 0 }
  for (const r of results) dist[r.riskCategory] += 1

  // Ten buckets: 0–9, 10–19, …, 80–89, 90–100
  // band: upper bound < 50 → high; lower bound < 80 → medium; else → low
  const BUCKETS: { range: string; lower: number; upper: number; band: RiskCategory }[] = [
    { range: '0–9', lower: 0, upper: 9, band: 'high' },
    { range: '10–19', lower: 10, upper: 19, band: 'high' },
    { range: '20–29', lower: 20, upper: 29, band: 'high' },
    { range: '30–39', lower: 30, upper: 39, band: 'high' },
    { range: '40–49', lower: 40, upper: 49, band: 'high' },
    { range: '50–59', lower: 50, upper: 59, band: 'medium' },
    { range: '60–69', lower: 60, upper: 69, band: 'medium' },
    { range: '70–79', lower: 70, upper: 79, band: 'medium' },
    { range: '80–89', lower: 80, upper: 89, band: 'low' },
    { range: '90–100', lower: 90, upper: 100, band: 'low' },
  ]

  const scoreHistogram = BUCKETS.map(({ range, lower, upper, band }) => ({
    range,
    count: results.filter((r) => r.score >= lower && r.score <= upper).length,
    band,
  }))

  return {
    totalDrivers: total,
    averageScore: avg,
    highRiskShare: total === 0 ? 0 : Math.round((dist.high / total) * 100),
    estimatedLossRatio: PLACEHOLDER_LOSS_RATIO,
    riskDistribution: dist,
    scoreHistogram,
  }
}
