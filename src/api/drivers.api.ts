import { apiClient } from './client'
import type { Driver, ScoreResult } from '@/data/types'

export type DriverListItem = Pick<
  Driver,
  'id' | 'fullName' | 'licenseNumber' | 'experienceYears'
> &
  ScoreResult

export async function getDrivers(): Promise<DriverListItem[]> {
  const { data } = await apiClient.get<DriverListItem[]>('/drivers')
  return data
}

export type DriverDetail = Driver & ScoreResult

export async function getDriver(id: string): Promise<DriverDetail> {
  const { data } = await apiClient.get<DriverDetail>(`/drivers/${id}`)
  return data
}
