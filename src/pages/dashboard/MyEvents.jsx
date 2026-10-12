import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/button'
import { EmptyState, ErrorState } from '../../components/ui/empty-state'
import { EventRow } from '../../components/ui/event-row'
import { EventDetailsModal } from '../../components/ui/event-details-modal'
import { List } from '../../components/ui/section'
import { EventRowSkeleton } from '../../components/ui/skeleton'
import { FilterTabs } from '../../components/ui/filter-tabs'
import { CalendarCheckIcon, CalendarIcon, CloseIcon } from '../../components/ui/icons'
import {
  buildUserEvents,
  countUserEvents,
  filterUserEvents,
  getRegistration,
} from '../../data/selectors'
import { useDashboardData } from '../../hooks/useDashboardData'
import { pluralize } from '../../lib/format'

const EMPTY_COPY = {
  all: {
    title: 'No registered events yet',
    description: 'Events you register for will show up here with their status.',
    icon: CalendarIcon,
  },
  upcoming: {
    title: 'No upcoming events',
    description: 'You have nothing scheduled ahead. Explore the catalogue to find your next one.',
    icon: CalendarIcon,
  },
  completed: {
    title: 'No completed events yet',
    description: 'Once you have attended an event it will be listed here.',
    icon: CalendarCheckIcon,
  },
  cancelled: {
    title: 'No cancelled registrations',
    description: 'Cancellations you make will be kept here for your records.',
    icon: CloseIcon,
  },
}

export function MyEvents() {
  const { status, error, data, retry, registerForEvent, cancelRegistration } = useDashboardData()
  const [filter, setFilter] = useState('all')
  const [activeEvent, setActiveEvent] = useState(null)

  const userEvents = useMemo(
    () => (data ? buildUserEvents(data.events, data.registrations) : []),
    [data],
  )
  const counts = useMemo(() => countUserEvents(userEvents), [userEvents])
  const visible = useMemo(() => filterUserEvents(userEvents, filter), [userEvents, filter])

  if (status === 'error') {
    return (
      <ErrorState
        title="We couldn't load your events"
        description={error?.message ?? 'The data service did not respond. Please try again.'}
        onRetry={retry}
      />
    )
  }

  const isLoading = status === 'loading' || !data
  const emptyCopy = EMPTY_COPY[filter] ?? EMPTY_COPY.all
  const EmptyIcon = emptyCopy.icon

  const filterOptions = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { value: 'completed', label: 'Completed', count: counts.completed },
    { value: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-[13px] text-[var(--d-muted)]">
          {isLoading
            ? 'Loading your registrations…'
            : `${counts.all} ${pluralize(counts.all, 'registration')}`}
        </p>
        <Button to="/dashboard/discover" variant="secondary" size="sm">
          Find more events
        </Button>
      </div>

      <FilterTabs
        label="Filter my events"
        value={filter}
        onChange={setFilter}
        options={filterOptions}
      />

      {isLoading ? (
        <List>
          <EventRowSkeleton />
          <EventRowSkeleton />
          <EventRowSkeleton />
          <EventRowSkeleton />
        </List>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<EmptyIcon className="h-4 w-4" />}
          title={emptyCopy.title}
          description={emptyCopy.description}
          action={
            filter === 'all' || filter === 'upcoming' ? (
              <Button to="/dashboard/discover" size="sm">
                Discover events
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setFilter('all')}>
                Show all events
              </Button>
            )
          }
        />
      ) : (
        <List>
          {visible.map(({ event }) => (
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
