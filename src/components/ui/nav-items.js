import { CalendarCheckIcon, CompassIcon, GridIcon, SettingsIcon, UserIcon } from './icons'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: GridIcon, end: true },
  { to: '/dashboard/discover', label: 'Discover Events', icon: CompassIcon },
  { to: '/dashboard/my-events', label: 'My Events', icon: CalendarCheckIcon, badgeKey: 'upcoming' },
  { to: '/dashboard/profile', label: 'Profile', icon: UserIcon },
  { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
]

export function getPageTitle(pathname) {
  const match = [...NAV_ITEMS]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
  return match ? match.label : 'Dashboard'
}
