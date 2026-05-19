import { apiClient } from './client'

export interface ImportPayload {
  kind: 'events' | 'violations'
  rows: number
}

export interface ImportResult {
  importedRecords: number
  recomputedDrivers: number
}

export async function importCsv(payload: ImportPayload): Promise<ImportResult> {
  const { data } = await apiClient.post<ImportResult>('/import/csv', payload)
  return data
}
