import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/button'
import { EmptyState, ErrorState } from '../../components/ui/empty-state'
import { EventRow } from '../../components/ui/event-row'
import { EventDetailsModal } from '../../components/ui/event-details-modal'
import { FilterTabs } from '../../components/ui/filter-tabs'
import { List } from '../../components/ui/section'
import { EventRowSkeleton } from '../../components/ui/skeleton'
import { CalendarIcon, SearchIcon } from '../../components/ui/icons'
import { EVENT_CATEGORIES } from '../../data/categories'
import { getRegistration, getUpcomingCatalog } from '../../data/selectors'
import { useDashboardData } from '../../hooks/useDashboardData'
import { pluralize } from '../../lib/format'

export function DiscoverEvents() {
  const { status, error, data, retry, registerForEvent, cancelRegistration } = useDashboardData()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [activeEvent, setActiveEvent] = useState(null)

  const upcoming = useMemo(() => (data ? getUpcomingCatalog(data.events) : []), [data])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return upcoming.filter((event) => {
      const matchesCategory = category === 'all' || event.category === category
      const matchesQuery =
        term.length === 0 ||
        event.title.toLowerCase().includes(term) ||
        event.summary.toLowerCase().includes(term) ||
        event.organizer.toLowerCase().includes(term)
      return matchesCategory && matchesQuery
    })
  }, [upcoming, category, query])

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All', count: upcoming.length },
      ...EVENT_CATEGORIES.map((name) => ({
        value: name,
        label: name,
        count: upcoming.filter((event) => event.category === name).length,
      })).filter((option) => option.count > 0),
    ],
    [upcoming],
  )

  if (status === 'error') {
    return (
      <ErrorState
        title="We couldn't load events"
        description={error?.message ?? 'The data service did not respond. Please try again.'}
        onRetry={retry}
      />
    )
  }

  const isLoading = status === 'loading' || !data

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="text-[13px] text-[var(--d-muted)]">
          {isLoading
            ? 'Loading the event catalogue…'
            : `${upcoming.length} upcoming ${pluralize(upcoming.length, 'event')}`}
        </p>
        <div className="relative w-full sm:w-64">
          <label htmlFor="event-search" className="sr-only">
            Search events by title, organiser or description
          </label>
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--d-subtle)]" />
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={(changeEvent) => setQuery(changeEvent.target.value)}
            placeholder="Search events…"
            className="d-focus h-8 w-full rounded-md border border-[var(--d-line)] bg-[var(--d-surface)] pl-8 pr-3 text-[13px] text-[var(--d-text)] placeholder:text-[var(--d-subtle)]"
          />
        </div>
      </div>

      <FilterTabs
        label="Filter by category"
        value={category}
        onChange={setCategory}
        options={categoryOptions}
      />

      {isLoading ? (
        <List>
          <EventRowSkeleton />
          <EventRowSkeleton />
          <EventRowSkeleton />
          <EventRowSkeleton />
          <EventRowSkeleton />
        </List>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="h-4 w-4" />}
          title="No events match your filters"
          description="Try a different category or clear the search to see everything that is coming up."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCategory('all')
                setQuery('')
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <p className="sr-only" role="status">
            {visible.length} {pluralize(visible.length, 'event')} shown
          </p>
          <List>
            {visible.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                registration={getRegistration(data.registrations, event.id)}
                onViewDetails={setActiveEvent}
                onRegister={(target) => registerForEvent(target.id)}
              />
            ))}
          </List>
        </>
      )}

      <p className="text-[12px] text-[var(--d-subtle)]">
        Listings are sample data, not a live event feed.
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
