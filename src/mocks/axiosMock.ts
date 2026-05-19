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

export { mock }
