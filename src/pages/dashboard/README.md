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

Registrations live in the Redux `events` slice and are saved to `localStorage`.
Discover loads events from Ticketmaster. Profile uses the auth user. Settings
preferences live in the Redux `settings` slice.

`src/data/selectors.js` derives counts and upcoming/completed state from those
registrations. `upcoming` vs `completed` comes from the event date in
`getEventState`.

The `/dashboard` routes are wrapped in `ProtectedRoute`.

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
