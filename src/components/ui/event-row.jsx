import { Badge } from './badge'
import { Button } from './button'
import { EVENT_STATE, REGISTRATION_STATUS, getEventState } from '../../data/selectors'
import { formatCurrency, formatEventLocation } from '../../lib/format'
import { formatEventDate, formatEventTime } from '../../lib/dates'

/**
 * Reusable compact event row shared by Discover, My Events and the overview's
 * upcoming list. Every consumer passes the same event shape plus an optional
 * registration, so status is never inferred twice.
 */
export function EventRow({
  event,
  registration = null,
  onViewDetails,
  onRegister,
  showRegistrationStatus = true,
  className = '',
}) {
  const eventState = getEventState(event)
  const stateMeta = EVENT_STATE[eventState]
  const registrationMeta = registration ? REGISTRATION_STATUS[registration.status] : null
  const spotsLeft = Math.max(event.capacity - event.registeredCount, 0)
  const isFull = spotsLeft === 0
  const canRegister = !registration || registration.status === 'cancelled'
  const statusBadge = showRegistrationStatus && registrationMeta ? registrationMeta : stateMeta

  return (
    <li className={`flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="min-w-0 truncate">{event.title}</h3>
          <Badge tone={statusBadge.tone}>{statusBadge.label}</Badge>
        </div>
        <p className="truncate text-[12px] text-[var(--d-muted)]">
          {event.category}
          <span className="mx-1.5 text-[var(--d-subtle)]">·</span>
          <time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time>
          <span className="mx-1.5 text-[var(--d-subtle)]">·</span>
          {formatEventTime(event.startDate)}
          <span className="mx-1.5 text-[var(--d-subtle)]">·</span>
          {formatEventLocation(event.location)}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <span className="mr-auto text-[12px] text-[var(--d-subtle)] sm:mr-1">
          {formatCurrency(event.price)}
          <span className="mx-1.5">·</span>
          {isFull ? 'waitlist only' : `${spotsLeft} spots left`}
        </span>
        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={() => onViewDetails(event)}>
            Details
          </Button>
        )}
        {canRegister && onRegister && (
          <Button
            size="sm"
            onClick={() => onRegister(event)}
            disabled={isFull}
            aria-label={isFull ? `${event.title} is full` : `Register for ${event.title}`}
          >
            {isFull ? 'Full' : registration ? 'Re-register' : 'Register'}
          </Button>
        )}
      </div>
    </li>
  )
}
