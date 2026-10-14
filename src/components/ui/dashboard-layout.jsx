import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { useDashboardStore } from "../../hooks/useDashboardStore";
import { useSelector } from "react-redux";

/**
 * Authenticated dashboard shell: sidebar + top bar + routed content.
 *
 * NOTE (auth integration): this layout is intentionally not guarded. The
 * protected-route wrapper from feat/auth should wrap the `/dashboard` route
 * once it lands, and the signed-in user should be supplied from that session
 * instead of the mock profile in src/data/user.js.
 */
export function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const store = useDashboardStore();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const badges = store.summary ? { upcoming: store.summary.upcoming } : {};

  return (
    <div className="flex min-h-svh w-full">
      <a href="#dashboard-content" className="d-skip-link">
        Skip to main content
      </a>

      <Sidebar
        user={user}
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        badges={badges}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={user}
          notifications={store.data?.notifications ?? []}
          unreadCount={store.unreadCount}
          onMarkAllRead={store.markNotificationsRead}
          onOpenNav={() => setIsNavOpen(true)}
        />

        <main
          id="dashboard-content"
          className="flex-1 px-4 py-4 sm:px-6 sm:py-5"
        >
          <div className="mx-auto w-full max-w-5xl">
            <Outlet context={store} />
          </div>
        </main>
      </div>
    </div>
  );
}
