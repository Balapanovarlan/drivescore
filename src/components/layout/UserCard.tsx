import { SignOutIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { clearToken } from '@/api/auth.api'
import { useMe } from '@/api/hooks/useMe'

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'
}

export function UserCard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const me = useMe()

  const displayName = me.data?.fullName?.trim() || me.data?.email || t('shell.loading')
  const subtitle = me.data?.email ?? t('shell.role')

  function handleSignOut() {
    clearToken()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return (
    <div className="rounded-2xl bg-slate p-3 text-slate-foreground">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {me.data ? initialsFrom(displayName) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-white/60">{subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-xs font-medium hover:bg-white/15"
      >
        <SignOutIcon size={16} />
        {t('shell.logout')}
      </button>
    </div>
  )
}
