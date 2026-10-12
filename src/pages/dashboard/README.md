# Dashboard (feat/dashboard)

Authenticated area of the Event Management System: overview metrics, the user's
registrations, event discovery, activity, profile and settings.

## Routes

| Route | Screen | Notes |
| --- | --- | --- |
| `/dashboard` | Overview | Compact summary line, upcoming events, recent activity |
| `/dashboard/discover` | Discover Events | Upcoming catalogue, category filter + search |
| `/dashboard/my-events` | My Events | Registrations with All / Upcoming / Completed / Cancelled filters |
| `/dashboard/profile` | Profile | Profile summary + editable form |
| `/dashboard/settings` | Settings | Notification preferences, appearance, account placeholders |

Routes are declared in `src/App.jsx` and share the `DashboardLayout` shell
(sidebar + top bar) through a nested route.

Links out of the dashboard use the existing conventions owned by other
features: event detail/register actions open an in-dashboard dialog, and the
"Log out" / "Back to site" links point at `/login` and `/` respectively.

## Data

All data is mock data and lives outside the UI:

- `src/data/events.js` — event catalogue and the user's registrations
- `src/data/user.js` — signed-in user profile
- `src/data/activity.js` — activity feed and notifications
- `src/data/selectors.js` — every derived value (states, filters, summary counts)
- `src/data/mockApi.js` — async access layer that mirrors a future API client
- `src/hooks/useDashboardStore.js` — in-memory store seeded from the mock layer

Summary counts are always derived from the event/registration arrays, never
hardcoded, so the cards and lists cannot drift apart.

Registration `status` (`confirmed` / `pending` / `cancelled`) is a stored
lifecycle value; `upcoming` vs `completed` is derived from the event date in
`getEventState`, so temporal state never goes stale.

## Authentication integration (required before release)

The dashboard is **not** guarded yet — it is deliberately usable during
development. To integrate with `feat/auth`:

1. Wrap the `/dashboard` route (or `DashboardLayout`) with the protected-route
   component from `feat/auth` so unauthenticated visitors are redirected to
   `/login`.
2. Replace the mock profile in `src/data/user.js` with the session user from the
   auth context/provider, and pass it into `useDashboardStore` (or replace the
   store's `user` with the session value).
3. Replace `src/data/mockApi.js` with the real API client. The store already
   handles `loading` / `ready` / `error` states, so the pages need no changes.
4. Persist profile edits and registration changes — currently they are in-memory
   only and reset on reload.

## Dependencies

- The shared components live in `src/components/ui/` with lowercase file names.
  The dashboard primitives (`button`, `badge`, `avatar`, `skeleton`) are the
  canonical implementations and the dashboard-specific pieces
  (`dashboard-layout`, `sidebar`, `topbar`, `nav-items`, `section`/`list`,
  `event-row`, `event-details-modal`, `filter-tabs`, `empty-state`,
  `activity-list`, `icons`) sit alongside them. The `Button` and `Badge`
  variant names from the original UI kit are kept as aliases, so both the
  dashboard and the landing/component screens share one set of components.
- **Theming is global.** `src/index.css` is the single stylesheet for the whole
  app: it declares the design tokens on `:root`, the dark-only palette, the
  `#root`/`body` reset and the global type scale, with base styles in
  `@layer base` and the shared `.d-*` component classes in `@layer components`.
  Because Tailwind's `@layer utilities` outranks both, a utility class always
  wins when a screen needs to deviate.
  - There is no separate dashboard stylesheet any more (`src/dashboard.css` and
    the template's `src/App.css` were removed), so dashboard, landing and auth
    screens render from one palette and one type scale.
  - The old template rules (`h1 { font-size: 56px }`, `p { margin: 0 }`,
    `#root { width: 1126px }`) that used to fight Tailwind are gone, so margin
    and `space-y` utilities now behave normally (dashboard markup still prefers
    flex/grid `gap` for vertical rhythm).
