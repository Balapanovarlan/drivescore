import { useQuery } from '@tanstack/react-query'
import { getDriver } from '../drivers.api'

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: () => getDriver(id),
    enabled: Boolean(id),
  })
}
