import {
  GaugeIcon,
  UsersIcon,
  SlidersHorizontalIcon,
  UploadSimpleIcon,
  GearIcon,
  ShieldCheckIcon,
  type Icon,
} from '@phosphor-icons/react'

export interface NavItem {
  to: string
  /** i18n key under nav.* */
  labelKey: string
  icon: Icon
  end?: boolean
  /** If true, item is only shown for admins. */
  adminOnly?: boolean
}

export const PRIMARY_NAV: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: GaugeIcon, end: true },
  { to: '/drivers', labelKey: 'nav.drivers', icon: UsersIcon },
  { to: '/simulator', labelKey: 'nav.simulator', icon: SlidersHorizontalIcon },
  { to: '/import', labelKey: 'nav.import', icon: UploadSimpleIcon },
]

export const SECONDARY_NAV: NavItem[] = [
  { to: '/users', labelKey: 'nav.users', icon: ShieldCheckIcon, adminOnly: true },
  { to: '/settings', labelKey: 'nav.settings', icon: GearIcon },
]
