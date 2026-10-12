import { useEffect, useId, useRef } from 'react'
import { Badge } from './badge'
import { Button } from './button'
import { EVENT_STATE, REGISTRATION_STATUS, getEventState } from '../../data/selectors'
import { formatCurrency, formatEventLocation } from '../../lib/format'
import { formatDateRange } from '../../lib/dates'
import { CloseIcon } from './icons'

function Detail({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--d-subtle)]">
        {label}
      </span>
      <span className="text-[13px] text-[var(--d-text)]">{children}</span>
    </div>
  )
}

/**
 * Self-contained event detail dialog so the dashboard stays usable while the
 * /events/:id page owned by the events feature is still being built.
 */
export function EventDetailsModal({ event, registration, onClose, onRegister, onCancel }) {
  const titleId = useId()
  const closeButtonRef = useRef(null)
  const isOpen = Boolean(event)

  useEffect(() => {
    if (!isOpen) return undefined
    closeButtonRef.current?.focus()
    function handleKeyDown(keyboardEvent) {
      if (keyboardEvent.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!event) return null

  const eventState = getEventState(event)
  const stateMeta = EVENT_STATE[eventState]
  const registrationMeta = registration ? REGISTRATION_STATUS[registration.status] : null
  const spotsLeft = Math.max(event.capacity - event.registeredCount, 0)
  const isFull = spotsLeft === 0
  const canRegister = !registration || registration.status === 'cancelled'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[88svh] w-full max-w-lg flex-col overflow-hidden border border-[var(--d-line-strong)] bg-[var(--d-surface)] sm:rounded-lg"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--d-line)] px-4 py-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone={stateMeta.tone}>{stateMeta.label}</Badge>
              <Badge>{event.category}</Badge>
              {registrationMeta && <Badge tone={registrationMeta.tone}>{registrationMeta.label}</Badge>}
            </div>
            <h2 id={titleId}>{event.title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            className="d-focus -mr-1 -mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3.5">
          <p className="text-[13px] leading-6 text-[var(--d-muted)]">{event.summary}</p>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <Detail label="When">{formatDateRange(event.startDate, event.endDate)}</Detail>
            <Detail label="Where">{formatEventLocation(event.location)}</Detail>
            <Detail label="Organiser">{event.organizer}</Detail>
            <Detail label="Price">{formatCurrency(event.price)}</Detail>
            <Detail label="Attendance">
              {event.registeredCount} registered
              {isFull ? ' · waitlist only' : ` · ${spotsLeft} left`}
            </Detail>
            {registration?.ticketCode && <Detail label="Ticket">{registration.ticketCode}</Detail>}
          </div>

          {event.tags?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Event tags">
              {event.tags.map((tag) => (
                <li key={tag}>
                  <Badge>{tag}</Badge>
                </li>
              ))}
            </ul>
          )}

          {registration?.status === 'pending' && (
            <div className="mt-4">
              <p className="border-l-2 border-[var(--d-warn)] pl-2.5 text-[12.5px] text-[var(--d-muted)]">
                Your registration is awaiting organiser approval.
              </p>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--d-line)] px-4 py-3">
          {registration && registration.status !== 'cancelled' && (
            <Button variant="danger" size="sm" onClick={() => onCancel(registration)}>
              Cancel registration
            </Button>
          )}
          {canRegister && (
            <Button size="sm" disabled={isFull} onClick={() => onRegister(event)}>
              {isFull ? 'Event full' : registration ? 'Re-register' : 'Register'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  )
}
