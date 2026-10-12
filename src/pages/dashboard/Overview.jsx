import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ActivityList } from '../../components/ui/activity-list'
import { Button } from '../../components/ui/button'
import { EmptyState, ErrorState } from '../../components/ui/empty-state'
import { EventRow } from '../../components/ui/event-row'
import { EventDetailsModal } from '../../components/ui/event-details-modal'
import { List, Section } from '../../components/ui/section'
import {
  ActivityRowSkeleton,
  EventRowSkeleton,
  MetricsSkeleton,
} from '../../components/ui/skeleton'
import { AlertIcon, CalendarIcon } from '../../components/ui/icons'
import { getRegistration, getUpcomingCatalog } from '../../data/selectors'
import { useDashboardData } from '../../hooks/useDashboardData'
import { pluralize } from '../../lib/format'

const ACTIVITY_LIMIT = 6
const UPCOMING_LIMIT = 4

function Metric({ value, label, tone }) {
  return (
    <span className="flex items-baseline gap-1.5 text-[12.5px] text-[var(--d-muted)]">
      <span
        className={`text-[15px] font-semibold tabular-nums ${
          tone === 'warn' ? 'text-[var(--d-warn)]' : 'text-[var(--d-text)]'
        }`}
      >
        {value}
      </span>
      {label}
    </span>
  )
}

export function Overview() {
  const { status, error, data, summary, retry, registerForEvent, cancelRegistration } =
    useDashboardData()
  const [activeEvent, setActiveEvent] = useState(null)

  const eventsById = useMemo(
    () => new Map((data?.events ?? []).map((event) => [event.id, event])),
    [data],
  )
  const upcoming = useMemo(
    () => (data ? getUpcomingCatalog(data.events, { limit: UPCOMING_LIMIT }) : []),
    [data],
  )
  const recentActivity = useMemo(() => (data ? data.activity.slice(0, ACTIVITY_LIMIT) : []), [data])

  if (status === 'error') {
    return (
      <ErrorState
        title="We couldn't load your dashboard"
        description={error?.message ?? 'The data service did not respond. Please try again.'}
        onRetry={retry}
      />
    )
  }

  const isLoading = status === 'loading' || !data

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {isLoading ? (
          <MetricsSkeleton />
        ) : (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Metric value={summary.registered} label="registered" />
            <Metric value={summary.upcoming} label="upcoming" />
            <Metric value={summary.completed} label="completed" />
            <Metric value={summary.pending} label="awaiting approval" tone="warn" />
          </div>
        )}
        <Button to="/dashboard/discover" size="sm">
          Discover events
        </Button>
      </div>

      {!isLoading && summary.pending > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-l-2 border-[var(--d-warn)] pl-3">
          <AlertIcon className="h-4 w-4 shrink-0 text-[var(--d-warn)]" />
          <p className="text-[13px] text-[var(--d-muted)]">
            <span className="font-medium text-[var(--d-text)]">{summary.pending}</span>{' '}
            {pluralize(summary.pending, 'registration is', 'registrations are')} awaiting organiser
            approval.
          </p>
          <Link
            to="/dashboard/my-events"
            className="d-focus rounded text-[12.5px] font-medium text-[var(--d-text)] underline-offset-2 hover:underline"
          >
            Review
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Upcoming events"
          action={
            <Link
              to="/dashboard/discover"
              className="d-focus rounded text-[12.5px] text-[var(--d-muted)] underline-offset-2 hover:text-[var(--d-text)] hover:underline"
            >
              Browse all
            </Link>
          }
        >
          {isLoading ? (
            <List>
              <EventRowSkeleton />
              <EventRowSkeleton />
            </List>
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon className="h-4 w-4" />}
              title="No upcoming events"
              description="New events are added regularly. Explore the catalogue to find something to attend."
              action={<Button to="/dashboard/discover" size="sm">Discover events</Button>}
            />
          ) : (
            <List>
              {upcoming.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  registration={getRegistration(data.registrations, event.id)}
                  onViewDetails={setActiveEvent}
                  onRegister={(target) => registerForEvent(target.id)}
                />
              ))}
            </List>
          )}
        </Section>

        <Section title="Recent activity">
          {isLoading ? (
            <List>
              <ActivityRowSkeleton />
              <ActivityRowSkeleton />
              <ActivityRowSkeleton />
            </List>
          ) : (
            <ActivityList
              items={recentActivity}
              getEventTitle={(eventId) => eventsById.get(eventId)?.title}
              emptyMessage="Your registrations and event updates will appear here."
            />
          )}
        </Section>
      </div>

      <p className="text-[12px] text-[var(--d-subtle)]">
        Figures above are derived from your registrations and the event catalogue.
      </p>

      <EventDetailsModal
        event={activeEvent}
        registration={activeEvent ? getRegistration(data.registrations, activeEvent.id) : null}
        onClose={() => setActiveEvent(null)}
        onRegister={(event) => registerForEvent(event.id)}
        onCancel={(registration) => cancelRegistration(registration.id)}
      />
    </div>
  )
}
