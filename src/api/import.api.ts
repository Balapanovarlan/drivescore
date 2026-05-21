import { apiClient } from './client'

export interface ImportError {
  row: number
  message: string
}

export interface ImportResult {
  importedRecords: number
  recomputedDrivers: number
  errors: ImportError[]
}

export async function importViolationsCsv(file: File): Promise<ImportResult> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<ImportResult>('/import/violations', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
