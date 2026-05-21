import { Navigate } from 'react-router-dom'
import { useMe } from '@/api/hooks/useMe'

/**
 * Wraps a route element and only renders it when the current user is an admin.
 * Loading state is rendered as null; on resolution, non-admins are redirected to /.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const me = useMe()
  if (me.isLoading) return null
  if (!me.data || me.data.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
