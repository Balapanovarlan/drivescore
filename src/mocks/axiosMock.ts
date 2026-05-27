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

// Mock users store — survives within one tab/session.
interface MockUser {
  id: string
  email: string
  fullName: string | null
  role: 'admin' | 'manager'
}
const MOCK_USERS: MockUser[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'info@adam.ua',
    fullName: 'Admin',
    role: 'admin',
  },
]

function findUser(email: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

let currentMockUser: MockUser = MOCK_USERS[0]

// POST /api/auth/login — accepts any email; the mock pretends auth always succeeds.
mock.onPost('/api/auth/login').reply((config) => {
  const body = JSON.parse(config.data ?? '{}')
  const user =
    findUser(body.email) ??
    (() => {
      const created: MockUser = {
        id: crypto.randomUUID(),
        email: body.email ?? 'demo@drivescore.kz',
        fullName: null,
        role: 'manager',
      }
      MOCK_USERS.push(created)
      return created
    })()
  currentMockUser = user
  return [200, { token: 'mock-token', user }]
})

// POST /api/auth/register
mock.onPost('/api/auth/register').reply((config) => {
  const body = JSON.parse(config.data ?? '{}')
  const user: MockUser = {
    id: crypto.randomUUID(),
    email: body.email,
    fullName: body.fullName ?? null,
    role: 'manager',
  }
  MOCK_USERS.push(user)
  currentMockUser = user
  return [201, { token: 'mock-token', user }]
})

// GET /api/auth/me
mock.onGet('/api/auth/me').reply(() => [200, currentMockUser])

// POST /api/auth/change-password
mock.onPost('/api/auth/change-password').reply(204)

// GET /api/users (admin only — mock can't really enforce, returns 403 unless admin)
mock.onGet('/api/users').reply(() => {
  if (currentMockUser.role !== 'admin') return [403, { detail: 'Admin role required.' }]
  return [200, MOCK_USERS]
})

// POST /api/users
mock.onPost('/api/users').reply((config) => {
  if (currentMockUser.role !== 'admin')
    return [403, { detail: 'Admin role required.' }]
  const body = JSON.parse(config.data ?? '{}')
  if (findUser(body.email)) return [409, { detail: 'Email already registered' }]
  const user: MockUser = {
    id: crypto.randomUUID(),
    email: body.email,
    fullName: body.fullName ?? null,
    role: body.role === 'admin' ? 'admin' : 'manager',
  }
  MOCK_USERS.push(user)
  return [201, user]
})

// GET /api/koap-articles
mock.onGet('/api/koap-articles').reply(200, [
  { code: 'Art.592', name: 'Minor speeding', weight: 2, factorGroup: 'speeding' },
  { code: 'Art.591', name: 'Phone usage', weight: 5, factorGroup: 'phoneUsage' },
  { code: 'Art.599', name: 'Red light', weight: 10, factorGroup: 'redLight' },
])

// POST /api/score/simulate — mirrors backend другаяформула.docx formula:
//   RiskScore = k · [Σ(W·F·R·D) + 10·n_acc]
//   Premium   = 22000 · (1 + RiskScore)
// All violations assumed today (decay = 1.0). Used by the Vercel demo when no
// real backend is reachable.
mock.onPost('/api/score/simulate').reply((config) => {
  const body = JSON.parse(config.data ?? '{}') as {
    violations: { articleCode: string; atFault: boolean }[]
    accidentCount: number
  }

  const K_SCALE = 0.07
  const BASE_PREMIUM = 22_000
  const ACCIDENT_PENALTY = 10

  const WEIGHTS: Record<string, number> = {
    'Art.592': 2,
    'Art.592 Part 3-1': 12,
    'Art.591': 5,
    'Art.599': 10,
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
  let rawScore = 0
  for (const [code, count] of Object.entries(grouped)) {
    const w = WEIGHTS[code] ?? 0
    const r = count <= 1 ? 1.0 : 1.0 + 0.1 * (count - 1) // linear R
    const contribution = w * count * r // decay = 1.0 because all today
    rawScore += contribution
    const group = FACTOR_GROUP[code] ?? 'accident'
    breakdown[group] += contribution
  }
  rawScore += ACCIDENT_PENALTY * Math.max(0, body.accidentCount)
  rawScore = Math.round(rawScore * 100) / 100

  const behavioral = 1 + K_SCALE * rawScore
  const finalPremium = Math.round(BASE_PREMIUM * behavioral)

  const safety = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-rawScore / 30))))
  const riskCategory: 'low' | 'medium' | 'high' =
    safety >= 70 ? 'low' : safety >= 30 ? 'medium' : 'high'

  return [
    200,
    {
      score: safety,
      riskCategory,
      riskTier: riskCategory,
      premiumCoefficient: Math.round(behavioral * 10000) / 10000,
      finalPremiumKzt: finalPremium,
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
