/**
 * Derived data helpers. Every count on the dashboard comes from these so the
 * summary figures can never disagree with the event lists they describe.
 */

export const REGISTRATION_STATUS = {
  confirmed: { label: 'Confirmed', tone: 'ok' },
  pending: { label: 'Pending', tone: 'warn' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
}

export const EVENT_STATE = {
  upcoming: { label: 'Upcoming', tone: 'neutral' },
  ongoing: { label: 'Now', tone: 'ok' },
  completed: { label: 'Completed', tone: 'dim' },
}

export function getEventState(event, now = new Date()) {
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : start
  if (now < start) return 'upcoming'
  if (now > end) return 'completed'
  return 'ongoing'
}

export function getRegistration(registrations, eventId) {
  return registrations.find((registration) => registration.eventId === eventId) ?? null
}

function byStartDate(a, b) {
  return new Date(a.event.startDate) - new Date(b.event.startDate)
}

export function buildUserEvents(events, registrations) {
  const eventsById = new Map(events.map((event) => [event.id, event]))
  return registrations
    .map((registration) => ({ registration, event: eventsById.get(registration.eventId) }))
    .filter((item) => Boolean(item.event))
    .sort(byStartDate)
}

export function filterUserEvents(userEvents, filter) {
  switch (filter) {
    case 'upcoming':
      return userEvents.filter(
        ({ registration, event }) =>
          registration.status !== 'cancelled' && getEventState(event) !== 'completed',
      )
    case 'completed':
      return userEvents.filter(
        ({ registration, event }) =>
          registration.status !== 'cancelled' && getEventState(event) === 'completed',
      )
    case 'cancelled':
      return userEvents.filter(({ registration }) => registration.status === 'cancelled')
    default:
      return userEvents
  }
}

export function countUserEvents(userEvents) {
  return {
    all: userEvents.length,
    upcoming: filterUserEvents(userEvents, 'upcoming').length,
    completed: filterUserEvents(userEvents, 'completed').length,
    cancelled: filterUserEvents(userEvents, 'cancelled').length,
  }
}

export function deriveSummary(events, registrations) {
  const userEvents = buildUserEvents(events, registrations)
  const active = userEvents.filter(({ registration }) => registration.status !== 'cancelled')
  return {
    registered: active.length,
    upcoming: active.filter(({ event }) => getEventState(event) !== 'completed').length,
    completed: active.filter(({ event }) => getEventState(event) === 'completed').length,
    pending: userEvents.filter(({ registration }) => registration.status === 'pending').length,
    cancelled: userEvents.filter(({ registration }) => registration.status === 'cancelled').length,
  }
}

export function getUpcomingCatalog(events, { limit } = {}) {
  const upcoming = events
    .filter((event) => getEventState(event) !== 'completed')
    .map((event) => ({ event, sortKey: new Date(event.startDate) }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ event }) => event)
  return typeof limit === 'number' ? upcoming.slice(0, limit) : upcoming
}
