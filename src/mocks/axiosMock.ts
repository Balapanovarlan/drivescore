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

// POST /api/score/simulate
mock.onPost('/api/score/simulate').reply(200, {
  score: 75,
  riskCategory: 'low',
  riskTier: 'moderate',
  premiumCoefficient: 1.0,
  finalPremiumKzt: 200000,
  accidentFactor: 1.0,
  discount: 0.05,
  breakdown: {
    speeding: 0,
    harshBraking: 0,
    harshAcceleration: 0,
    phoneUsage: 0,
    redLight: 0,
    accident: 0,
  },
})

// POST /api/import/violations
mock.onPost('/api/import/violations').reply(200, {
  importedRecords: 5,
  recomputedDrivers: 3,
  errors: [],
})

export { mock }
