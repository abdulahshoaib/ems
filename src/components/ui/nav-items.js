import { CalendarCheckIcon, CompassIcon, GridIcon, SettingsIcon, UserIcon } from './icons'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: GridIcon, end: true },
  { to: '/dashboard/discover', label: 'Discover Events', icon: CompassIcon },
  { to: '/dashboard/my-events', label: 'My Events', icon: CalendarCheckIcon, badgeKey: 'upcoming' },
  { to: '/dashboard/profile', label: 'Profile', icon: UserIcon },
  { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
]

function matchNavItem(pathname) {
  return [...NAV_ITEMS]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
}

export function getPageTitle(pathname) {
  return matchNavItem(pathname)?.label ?? 'Dashboard'
}

/** Dashboard, then the current page. On the dashboard itself that is one item. */
export function getBreadcrumbs(pathname) {
  const page = matchNavItem(pathname)
  const current = page?.label ?? 'Dashboard'
  if (!page || page.to === '/dashboard') {
    return [{ label: 'Dashboard', current: true }]
  }
  return [
    { label: 'Dashboard', to: '/dashboard' },
    { label: current, current: true },
  ]
}
