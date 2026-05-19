import {
  GaugeIcon,
  UsersIcon,
  SlidersHorizontalIcon,
  UploadSimpleIcon,
  GearIcon,
  type Icon,
} from '@phosphor-icons/react'

export interface NavItem {
  to: string
  /** i18n key under nav.* */
  labelKey: string
  icon: Icon
  end?: boolean
}

export const PRIMARY_NAV: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: GaugeIcon, end: true },
  { to: '/drivers', labelKey: 'nav.drivers', icon: UsersIcon },
  { to: '/simulator', labelKey: 'nav.simulator', icon: SlidersHorizontalIcon },
  { to: '/import', labelKey: 'nav.import', icon: UploadSimpleIcon },
]

export const SECONDARY_NAV: NavItem[] = [
  { to: '/settings', labelKey: 'nav.settings', icon: GearIcon },
]
