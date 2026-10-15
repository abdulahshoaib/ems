import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./nav-items";
import { Avatar } from "./avatar";
import { CloseIcon } from "./icons";

function navLinkClasses({ isActive }) {
  return [
    "d-focus flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
    isActive
      ? "bg-white/[0.08] font-medium text-[var(--d-text)]"
      : "text-[var(--d-muted)] hover:bg-white/[0.05] hover:text-[var(--d-text)]",
  ].join(" ");
}

export function Sidebar({ isOpen, onClose, badges = {}, user }) {
  const content = (
    <div className="flex h-full flex-col px-2.5 py-3">
      <div className="flex items-center gap-3 px-1.5 pb-4">
        <img src="/ems.png" className="w-8 h-8" alt="ems logo" />
        <span className="text-[13.5px] font-semibold tracking-tight text-(--d-text)">
          ems
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="d-focus inline-flex h-7 w-7 items-center justify-center rounded-md text-(--d-muted) hover:bg-white/6 hover:text-(--d-text) lg:hidden"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <nav aria-label="Dashboard" className="flex flex-1 flex-col">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const badgeCount = item.badgeKey
              ? badges[item.badgeKey]
              : undefined;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={navLinkClasses}
                  onClick={onClose}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {typeof badgeCount === "number" && badgeCount > 0 && (
                    <span className="text-[11.5px] tabular-nums text-(--d-subtle)">
                      {badgeCount}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-(--d-line) px-1.5 pt-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={user?.fullname} src={user?.avatarUrl} size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12.5px] font-medium text-(--d-text)">
              {user?.fullname}
            </span>
            <span className="truncate text-[11px] text-(--d-subtle)">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile slide-over */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${isOpen ? "" : "pointer-events-none invisible"}`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <div
          className={`absolute inset-y-0 left-0 w-60 max-w-[85vw] border-r border-(--d-line-strong) bg-[#0a0a0b] transition-transform duration-200 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </div>
      </div>

      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-svh w-54 shrink-0 border-r border-(--d-line) lg:block">
        {content}
      </aside>
    </>
  );
}
