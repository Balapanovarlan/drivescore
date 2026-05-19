import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { NavItem } from './navItems'

interface SidebarNavItemProps {
  item: NavItem
  onNavigate?: () => void
}

export function SidebarNavItem({ item, onNavigate }: SidebarNavItemProps) {
  const { t } = useTranslation()
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-slate text-slate-foreground'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
          {t(item.labelKey)}
        </>
      )}
    </NavLink>
  )
}
