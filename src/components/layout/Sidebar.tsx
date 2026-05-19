import { FireIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { PRIMARY_NAV, SECONDARY_NAV } from './navItems'
import { SidebarNavItem } from './SidebarNavItem'
import { UserCard } from './UserCard'

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { t } = useTranslation()
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col gap-6 overflow-y-auto border-r bg-card p-4">
      <div className="flex items-center gap-2.5 px-2 pt-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <FireIcon size={20} weight="fill" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-extrabold">{t('app.name')}</p>
          <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {PRIMARY_NAV.map((item) => (
          <SidebarNavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t('nav.account')}
        </p>
        {SECONDARY_NAV.map((item) => (
          <SidebarNavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="mt-auto">
        <UserCard />
      </div>
    </aside>
  )
}
