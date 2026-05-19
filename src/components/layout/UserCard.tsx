import { SignOutIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function UserCard() {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl bg-slate p-3 text-slate-foreground">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            TU
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Test User</p>
          <p className="truncate text-xs text-white/60">Insurance Officer</p>
        </div>
      </div>
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-xs font-medium hover:bg-white/15"
      >
        <SignOutIcon size={16} />
        {t('shell.logout')}
      </button>
    </div>
  )
}
