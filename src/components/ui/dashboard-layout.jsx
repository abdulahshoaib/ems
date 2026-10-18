import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { selectMyRegistrations } from "../../features/events/eventsSlice";
import { deriveSummary } from "../../data/selectors";

export function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const registrations = useSelector(selectMyRegistrations);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const upcoming = useMemo(() => {
    const events = registrations.map((item) => item.event);
    return deriveSummary(events, registrations).upcoming;
  }, [registrations]);

  const badges = { upcoming };

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
        <Topbar user={user} onOpenNav={() => setIsNavOpen(true)} />

        <main
          id="dashboard-content"
          className="flex-1 px-4 py-4 sm:px-6 sm:py-5"
        >
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
