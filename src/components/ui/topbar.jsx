import { Fragment, useCallback, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar } from './avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'
import { getBreadcrumbs, getPageTitle } from './nav-items'
import { useDismissable } from '../../hooks/useDismissable'
import { formatRelativeTime } from '../../lib/dates'
import { BellIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon } from './icons'

const MENU_PANEL =
  'absolute right-0 z-30 mt-2 overflow-hidden rounded-lg border border-[var(--d-line-strong)] bg-[var(--d-surface)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9)]'
const MENU_ITEM =
  'd-focus flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]'

function NotificationMenu({ notifications, unreadCount, onMarkAllRead }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const close = useCallback(() => setIsOpen(false), [])
  useDismissable(containerRef, isOpen, close)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        className="d-focus relative inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]"
      >
        <BellIcon className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-white" />
        )}
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Notifications" className={`${MENU_PANEL} w-[19rem] max-w-[calc(100vw-2rem)]`}>
          <div className="flex items-center justify-between border-b border-[var(--d-line)] px-3 py-2">
            <span className="text-[12px] font-semibold text-[var(--d-text)]">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="d-focus rounded px-1 text-[11.5px] text-[var(--d-muted)] hover:text-[var(--d-text)]"
              >
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="px-3 py-5 text-center text-[12.5px] text-[var(--d-muted)]">
              You are all caught up.
            </p>
          ) : (
            <ul className="max-h-[20rem] divide-y divide-[var(--d-line)] overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex gap-2.5 px-3 py-2.5">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      notification.read ? 'bg-[var(--d-line-strong)]' : 'bg-white'
                    }`}
                  />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-[12.5px] font-medium text-[var(--d-text)]">
                      {notification.title}
                      {!notification.read && <span className="sr-only"> (unread)</span>}
                    </p>
                    <p className="text-[12px] text-[var(--d-muted)]">{notification.description}</p>
                    <p className="text-[11px] text-[var(--d-subtle)]">
                      {formatRelativeTime(notification.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="border-t border-[var(--d-line)] px-3 py-2 text-[11px] text-[var(--d-subtle)]">
            Sample notifications — not connected to a live service.
          </p>
        </div>
      )}
    </div>
  )
}

function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const close = useCallback(() => setIsOpen(false), [])
  useDismissable(containerRef, isOpen, close)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className="d-focus inline-flex items-center gap-2 rounded-md py-0.5 pl-0.5 pr-1.5 hover:bg-white/[0.06]"
      >
        <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
        <span className="hidden max-w-[8rem] truncate text-[12.5px] text-[var(--d-muted)] sm:block">
          {user?.name}
        </span>
      </button>

      {isOpen && (
        <div role="menu" aria-label="User menu" className={`${MENU_PANEL} w-52`}>
          <div className="border-b border-[var(--d-line)] px-3 py-2.5">
            <p className="truncate text-[12.5px] font-semibold text-[var(--d-text)]">{user?.name}</p>
            <p className="truncate text-[11.5px] text-[var(--d-subtle)]">{user?.email}</p>
          </div>
          <div className="flex flex-col p-1">
            <Link to="/dashboard/profile" role="menuitem" onClick={close} className={MENU_ITEM}>
              <UserIcon className="h-3.5 w-3.5" />
              Your profile
            </Link>
            <Link to="/dashboard/settings" role="menuitem" onClick={close} className={MENU_ITEM}>
              <SettingsIcon className="h-3.5 w-3.5" />
              Settings
            </Link>
          </div>
          <div className="border-t border-[var(--d-line)] p-1">
            <Link to="/login" role="menuitem" onClick={close} className={MENU_ITEM}>
              <LogOutIcon className="h-3.5 w-3.5" />
              Log out
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

const CRUMB_LINK = '!text-[var(--d-muted)] hover:!text-[var(--d-text)]'

export function Topbar({ user, notifications, unreadCount, onMarkAllRead, onOpenNav }) {
  const location = useLocation()
  const title = getPageTitle(location.pathname)
  const crumbs = getBreadcrumbs(location.pathname)

  return (
    <header className="d-topbar sticky top-0 z-20 border-b border-[var(--d-line)] backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenNav}
            aria-label="Open navigation"
            className="d-focus inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)] lg:hidden"
          >
            <MenuIcon className="h-4 w-4" />
          </button>

          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="!flex-nowrap !text-[12.5px] !text-[var(--d-muted)]">
              {crumbs.map((crumb, index) => (
                <Fragment key={crumb.to ?? crumb.label}>
                  {index > 0 && <BreadcrumbSeparator className="!text-[var(--d-subtle)]" />}
                  <BreadcrumbItem className="min-w-0">
                    {crumb.current ? (
                      <BreadcrumbPage className="truncate !font-medium !text-[var(--d-text)]">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink to={crumb.to} className={`truncate ${CRUMB_LINK}`}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="max-w-[40vw] truncate text-center">{title}</h1>

        <div className="flex items-center justify-end gap-1">
          <NotificationMenu
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllRead={onMarkAllRead}
          />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
