import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ActivityList } from '../../components/ui/activity-list'
import { Button } from '../../components/ui/button'
import { EmptyState } from '../../components/ui/empty-state'
import { EventRow } from '../../components/ui/event-row'
import { EventDetailsModal } from '../../components/ui/event-details-modal'
import { List, Section } from '../../components/ui/section'
import { CalendarIcon } from '../../components/ui/icons'
import {
  buildUserEvents,
  deriveSummary,
  filterUserEvents,
  getRegistration,
} from '../../data/selectors'
import {
  cancelRegistration,
  registerEvent,
  selectMyRegistrations,
} from '../../features/events/eventsSlice'

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
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const registrations = useSelector(selectMyRegistrations)
  const [activeEvent, setActiveEvent] = useState(null)

  const events = useMemo(
    () => registrations.map((item) => item.event),
    [registrations],
  )
  const eventsById = useMemo(
    () => new Map(events.map((event) => [event.id, event])),
    [events],
  )
  const summary = useMemo(
    () => deriveSummary(events, registrations),
    [events, registrations],
  )
  const upcoming = useMemo(
    () =>
      filterUserEvents(buildUserEvents(events, registrations), 'upcoming')
        .slice(0, UPCOMING_LIMIT)
        .map(({ event }) => event),
    [events, registrations],
  )
  const recentActivity = useMemo(
    () =>
      [...registrations]
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
        .slice(0, ACTIVITY_LIMIT)
        .map((item) => ({
          id: item.id,
          type: item.status === 'cancelled' ? 'cancellation' : 'registration',
          title:
            item.status === 'cancelled' ? 'Registration cancelled' : 'Registered for an event',
          description: item.event.title,
          eventId: item.eventId,
          timestamp: item.registeredAt,
        })),
    [registrations],
  )

  function registerForEvent(event) {
    dispatch(registerEvent({ event, userEmail: user.email }))
  }

  function cancelForEvent(registration) {
    dispatch(cancelRegistration(registration.id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Metric value={summary.registered} label="registered" />
          <Metric value={summary.upcoming} label="upcoming" />
          <Metric value={summary.completed} label="completed" />
          <Metric value={summary.cancelled} label="cancelled" />
        </div>
        <Button to="/dashboard/discover" size="sm">
          Discover events
        </Button>
      </div>

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
          {upcoming.length === 0 ? (
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
                  registration={getRegistration(registrations, event.id)}
                  onViewDetails={setActiveEvent}
                  onRegister={registerForEvent}
                />
              ))}
            </List>
          )}
        </Section>

        <Section title="Recent activity">
          <ActivityList
            items={recentActivity}
            getEventTitle={(eventId) => eventsById.get(eventId)?.title}
            emptyMessage="Your registrations and event updates will appear here."
          />
        </Section>
      </div>

      <p className="text-[12px] text-[var(--d-subtle)]">
        Figures above are derived from your registrations.
      </p>

      <EventDetailsModal
        event={activeEvent}
        registration={activeEvent ? getRegistration(registrations, activeEvent.id) : null}
        onClose={() => setActiveEvent(null)}
        onRegister={registerForEvent}
        onCancel={cancelForEvent}
      />
    </div>
  )
}
