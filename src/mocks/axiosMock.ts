import MockAdapter from 'axios-mock-adapter'
import { apiClient } from '../api/client'
import { MOCK_DRIVERS, driverScore, buildDashboardSummary } from '@/data/drivers.mock'

const mock = new MockAdapter(apiClient, { delayResponse: 150 })

// GET /api/dashboard/summary
mock.onGet('/api/dashboard/summary').reply(200, buildDashboardSummary(MOCK_DRIVERS))

// GET /api/drivers
mock.onGet('/api/drivers').reply(
  200,
  MOCK_DRIVERS.map((d) => ({
    id: d.id,
    fullName: d.fullName,
    licenseNumber: d.licenseNumber,
    experienceYears: d.experienceYears,
    ...driverScore(d),
  })),
)

// GET /api/drivers/:id
mock.onGet(/\/api\/drivers\/([^/]+)$/).reply((config) => {
  const url = config.url ?? ''
  const id = url.split('/').pop()
  const driver = MOCK_DRIVERS.find((d) => d.id === id)
  if (!driver) return [404, null]
  return [200, { ...driver, ...driverScore(driver) }]
})

// POST /api/import/csv
mock.onPost('/api/import/csv').reply((config) => {
  let body: { rows?: number } = {}
  try {
    body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data ?? {}
  } catch {
    body = {}
  }
  return [200, { importedRecords: body.rows ?? 0, recomputedDrivers: MOCK_DRIVERS.length }]
})

// POST /api/auth/login — demo upsert, accepts anything
mock.onPost('/api/auth/login').reply((config) => {
  const body = JSON.parse(config.data ?? '{}')
  return [
    200,
    {
      token: 'mock-token',
      user: {
        id: 'mock-id',
        email: body.email ?? 'demo@drivescore.kz',
        fullName: null,
      },
    },
  ]
})

// POST /api/auth/register
mock.onPost('/api/auth/register').reply(201, {
  token: 'mock-token',
  user: { id: 'mock-id', email: 'demo@drivescore.kz', fullName: 'Demo' },
})

// GET /api/auth/me
mock.onGet('/api/auth/me').reply(200, {
  id: 'mock-id',
  email: 'info@adam.ua',
  fullName: 'Test User',
})

// GET /api/koap-articles
mock.onGet('/api/koap-articles').reply(200, [
  { code: 'Art.592', name: 'Minor speeding', weight: 2, factorGroup: 'speeding' },
  { code: 'Art.591', name: 'Phone usage', weight: 5, factorGroup: 'phoneUsage' },
  { code: 'Art.599', name: 'Red light', weight: 8, factorGroup: 'redLight' },
])

// POST /api/score/simulate — coarse client-side mirror of the docx formula
// so the Vercel demo (no real backend) still reacts to user input.
mock.onPost('/api/score/simulate').reply((config) => {
  const body = JSON.parse(config.data ?? '{}') as {
    violations: { articleCode: string; atFault: boolean }[]
    accidentCount: number
  }

  const WEIGHTS: Record<string, number> = {
    'Art.592': 2,
    'Art.592 Part 3-1': 10,
    'Art.591': 5,
    'Art.599': 8,
    'Art.593': 3,
    'Art.596 Part 3': 15,
    'Art.613 Part 1': 12,
    'Art.612 Part 3': 20,
    'Art.611 Part 2': 18,
    'Art.608 Part 1': 25,
    'Art.608 Part 3': 35,
    'Art.613 Part 4': 30,
  }
  const FACTOR_GROUP: Record<string, string> = {
    'Art.592': 'speeding',
    'Art.592 Part 3-1': 'speeding',
    'Art.591': 'phoneUsage',
    'Art.599': 'redLight',
    'Art.593': 'harshAcceleration',
    'Art.596 Part 3': 'harshBraking',
    'Art.613 Part 1': 'harshBraking',
    'Art.612 Part 3': 'harshAcceleration',
    'Art.611 Part 2': 'accident',
    'Art.608 Part 1': 'accident',
    'Art.608 Part 3': 'accident',
    'Art.613 Part 4': 'accident',
  }

  // Group by article, F=count, R from table
  const grouped: Record<string, number> = {}
  for (const v of body.violations) {
    grouped[v.articleCode] = (grouped[v.articleCode] ?? 0) + 1
  }
  const breakdown: Record<string, number> = {
    speeding: 0,
    harshBraking: 0,
    harshAcceleration: 0,
    phoneUsage: 0,
    redLight: 0,
    accident: 0,
  }
  let riskScore = 0
  for (const [code, count] of Object.entries(grouped)) {
    const w = WEIGHTS[code] ?? 0
    const r = count <= 1 ? 1.0 : count === 2 ? 1.3 : count === 3 ? 1.6 : 2.0
    const contribution = w * count * r // decay = 1.0 because all today
    riskScore += contribution
    const group = FACTOR_GROUP[code] ?? 'accident'
    breakdown[group] += contribution
  }
  riskScore = Math.round(riskScore * 100) / 100

  const accidentFactor =
    body.accidentCount === 0
      ? 1.0
      : body.accidentCount === 1
        ? 1.2
        : body.accidentCount === 2
          ? 1.5
          : 2.0
  const discount = body.violations.length === 0 ? 0.25 : 0
  const behavioral = 1 + 0.02 * riskScore
  const finalPremium = Math.round(200_000 * behavioral * accidentFactor * (1 - discount))

  const safety = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-riskScore / 30))))
  let tier: 'low' | 'moderate' | 'high' | 'dangerous' | 'critical' = 'low'
  let coef = 0.9
  if (riskScore > 50) {
    tier = 'critical'
    coef = 2.2
  } else if (riskScore > 30) {
    tier = 'dangerous'
    coef = 1.7
  } else if (riskScore > 15) {
    tier = 'high'
    coef = 1.3
  } else if (riskScore > 5) {
    tier = 'moderate'
    coef = 1.0
  }
  const riskCategory =
    tier === 'low' || tier === 'moderate'
      ? 'low'
      : tier === 'high'
        ? 'medium'
        : 'high'

  return [
    200,
    {
      score: safety,
      riskCategory,
      riskTier: tier,
      premiumCoefficient: coef,
      finalPremiumKzt: finalPremium,
      accidentFactor,
      discount,
      breakdown,
    },
  ]
})

// POST /api/import/violations
mock.onPost('/api/import/violations').reply(200, {
  importedRecords: 5,
  recomputedDrivers: 3,
  errors: [],
})

export { mock }
