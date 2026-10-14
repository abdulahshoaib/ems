import { Fragment, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "./avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { getBreadcrumbs, getPageTitle } from "./nav-items";
import { useDismissable } from "../../hooks/useDismissable";
import { LogOutIcon, MenuIcon, SettingsIcon, UserIcon } from "./icons";
import { useDispatch } from "react-redux";

const MENU_PANEL =
  "absolute right-0 z-30 mt-2 overflow-hidden rounded-lg border border-[var(--d-line-strong)] bg-[var(--d-surface)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9)]";
const MENU_ITEM =
  "d-focus flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]";

function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const close = useCallback(() => setIsOpen(false), []);

  useDismissable(containerRef, isOpen, close);
  function handleLogout() {
    dispatch(logout());
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className="d-focus inline-flex items-center gap-2 rounded-md py-0.5 pl-0.5 pr-1.5 hover:bg-white/6"
      >
        <Avatar name={user?.fullname} src={user?.avatarUrl} size="sm" />
        <span className="hidden max-w-32 truncate text-[12.5px] text-(--d-muted) sm:block">
          {user?.fullname}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="User menu"
          className={`${MENU_PANEL} w-52`}
        >
          <div className="border-b border-(--d-line) px-3 py-2.5">
            <p className="truncate text-[12.5px] font-semibold text-(--d-text)">
              {user?.fullname}
            </p>
            <p className="truncate text-[11.5px] text-(--d-subtle)">
              {user?.email}
            </p>
          </div>
          <div className="flex flex-col p-1">
            <Link
              to="/dashboard/profile"
              role="menuitem"
              onClick={close}
              className={MENU_ITEM}
            >
              <UserIcon className="h-3.5 w-3.5" />
              Your profile
            </Link>
            <Link
              to="/dashboard/settings"
              role="menuitem"
              onClick={close}
              className={MENU_ITEM}
            >
              <SettingsIcon className="h-3.5 w-3.5" />
              Settings
            </Link>
          </div>
          <div className="border-t border-(--d-line) p-1">
            <Link role="menuitem" className={MENU_ITEM} onClick={handleLogout}>
              <LogOutIcon className="h-3.5 w-3.5" />
              Log out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const CRUMB_LINK = "text-[var(--d-muted)] hover:!text-[var(--d-text)]";

export function Topbar({ user, onOpenNav }) {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const crumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="d-topbar sticky top-0 z-20 border-b border-(--d-line) backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenNav}
            aria-label="Open navigation"
            className="d-focus inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-(--d-muted) hover:bg-white/6 hover:text-(--d-text) lg:hidden"
          >
            <MenuIcon className="h-4 w-4" />
          </button>

          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap! text-[12.5px]! text-(--d-muted)!">
              {crumbs.map((crumb, index) => (
                <Fragment key={crumb.to ?? crumb.label}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="text-(--d-subtle)!" />
                  )}
                  <BreadcrumbItem className="min-w-0">
                    {crumb.current ? (
                      <BreadcrumbPage className="truncate font-medium! text-(--d-text)!">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        to={crumb.to}
                        className={`truncate ${CRUMB_LINK}`}
                      >
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
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
