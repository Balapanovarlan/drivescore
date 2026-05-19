import { useQuery } from '@tanstack/react-query'
import { getDrivers } from '../drivers.api'

export function useDrivers() {
  return useQuery({ queryKey: ['drivers'], queryFn: getDrivers })
}
