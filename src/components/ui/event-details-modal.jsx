import { useEffect, useId, useRef } from 'react'
import { Badge } from './badge'
import { Button } from './button'
import { EVENT_STATE, REGISTRATION_STATUS, getEventState } from '../../data/selectors'
import {
  formatCurrency,
  formatEventAddress,
  formatEventLocation,
  formatPriceRange,
} from '../../lib/format'
import { formatDateRange, formatEventDate, formatEventTime } from '../../lib/dates'
import { CloseIcon } from './icons'

const TM_STATUS = {
  onsale: { label: 'On sale', tone: 'ok' },
  offsale: { label: 'Off sale', tone: 'dim' },
  canceled: { label: 'Cancelled', tone: 'danger' },
  postponed: { label: 'Postponed', tone: 'warn' },
  rescheduled: { label: 'Rescheduled', tone: 'warn' },
}

const EXTERNAL_LINK_LABELS = {
  youtube: 'YouTube',
  twitter: 'Twitter',
  facebook: 'Facebook',
  instagram: 'Instagram',
  wiki: 'Wikipedia',
  spotify: 'Spotify',
  itunes: 'iTunes',
  lastfm: 'Last.fm',
  musicbrainz: 'MusicBrainz',
  homePage: 'Website',
}

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

function SubSection({ label, children }) {
  return (
    <section className="mt-4">
      <h3 className="d-label">{label}</h3>
      <div className="mt-1.5">{children}</div>
    </section>
  )
}

function formatMoment(value) {
  if (!value) return null
  return `${formatEventDate(value)} · ${formatEventTime(value)}`
}

/**
 * Self-contained event detail dialog so the dashboard stays usable while the
 * /events/:id page owned by the events feature is still being built. Besides
 * the shared fields it surfaces the full Ticketmaster payload (classifications,
 * sales windows, promoter, venue address, ticket limit, accessibility, links).
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
  const hasCapacity = Number.isFinite(event.capacity) && Number.isFinite(event.registeredCount)
  const spotsLeft = hasCapacity ? Math.max(event.capacity - event.registeredCount, 0) : null
  const isFull = hasCapacity && spotsLeft === 0
  const canRegister = !registration || registration.status === 'cancelled'
  const isTicketmaster = event.source === 'ticketmaster'

  const statusMeta = event.status ? TM_STATUS[event.status] : null
  const priceLabel = Array.isArray(event.priceRanges)
    ? formatPriceRange(event.priceRanges)
    : formatCurrency(event.price)
  const address = formatEventAddress(event.location)
  const accessStart = formatMoment(event.access?.startDateTime)
  const publicStart = formatMoment(event.sales?.publicStart)
  const publicEnd = formatMoment(event.sales?.publicEnd)
  const presales = event.sales?.presales ?? []
  const externalLinks = Object.entries(event.externalLinks ?? {}).filter(
    ([, url]) => typeof url === 'string' && url,
  )
  const hasUnits = event.distance != null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[88svh] w-full max-w-lg flex-col overflow-hidden border border-[var(--d-line-strong)] bg-[var(--d-surface)] sm:rounded-lg"
      >
        {event.imageUrl && (
          <div className="relative h-36 shrink-0 overflow-hidden border-b border-[var(--d-line)]">
            <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        <header className="flex items-start justify-between gap-4 border-b border-[var(--d-line)] px-4 py-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone={stateMeta.tone}>{stateMeta.label}</Badge>
              {event.category && <Badge>{event.category}</Badge>}
              {statusMeta && <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>}
              {event.genre && <Badge>{event.genre}</Badge>}
              {registrationMeta && <Badge tone={registrationMeta.tone}>{registrationMeta.label}</Badge>}
            </div>
            <h2 id={titleId}>{event.title}</h2>
            {event.organizer && (
              <p className="truncate text-[12px] text-[var(--d-muted)]">{event.organizer}</p>
            )}
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

          {event.info && event.info !== event.summary && (
            <p className="mt-2 text-[12.5px] leading-6 text-[var(--d-muted)]">{event.info}</p>
          )}

          {event.pleaseNote && (
            <p className="mt-3 border-l-2 border-[var(--d-line-strong)] pl-2.5 text-[12.5px] text-[var(--d-subtle)]">
              {event.pleaseNote}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <Detail label="When">
              {formatDateRange(event.startDate, event.endDate)}
              {event.timezone && <span className="block text-[11.5px] text-[var(--d-subtle)]">{event.timezone}</span>}
            </Detail>
            <Detail label="Where">
              {formatEventLocation(event.location)}
              {address && <span className="block text-[11.5px] text-[var(--d-subtle)]">{address}</span>}
              {event.location?.latitude != null && event.location?.longitude != null && (
                <span className="block text-[11.5px] text-[var(--d-subtle)]">
                  {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                </span>
              )}
            </Detail>
            {isTicketmaster && event.segment && <Detail label="Segment">{event.segment}</Detail>}
            <Detail label="Price">{priceLabel}</Detail>
            {accessStart && <Detail label="Doors open">{accessStart}</Detail>}
            {(publicStart || publicEnd) && (
              <Detail label="Public sale">
                {[publicStart, publicEnd].filter(Boolean).join(' – ')}
              </Detail>
            )}
            {isTicketmaster && event.ageRestricted && <Detail label="Age limit">Restricted</Detail>}
            {isTicketmaster && event.ticketLimit && (
              <Detail label="Ticket limit">{event.ticketLimit}</Detail>
            )}
            {hasUnits && (
              <Detail label="Distance">
                {event.distance} {event.units ?? 'mi'}
              </Detail>
            )}
            {hasCapacity && (
              <Detail label="Attendance">
                {event.registeredCount} registered
                {isFull ? ' · waitlist only' : ` · ${spotsLeft} left`}
              </Detail>
            )}
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

          {isTicketmaster && event.classifications?.length > 0 && (
            <SubSection label="Classification">
              <ul className="flex flex-col gap-2">
                {event.classifications.map((classification, index) => {
                  const lineage = [
                    classification.segment,
                    classification.genre,
                    classification.subGenre,
                  ].filter(Boolean)
                  const typeLine = [classification.type, classification.subType].filter(Boolean)
                  return (
                    <li key={`${classification.segment}-${index}`} className="flex flex-wrap items-center gap-1.5">
                      {classification.primary && <Badge tone="solid">Primary</Badge>}
                      {lineage.map((part) => (
                        <Badge key={part}>{part}</Badge>
                      ))}
                      {typeLine.map((part) => (
                        <Badge key={part} tone="dim">
                          {part}
                        </Badge>
                      ))}
                    </li>
                  )
                })}
              </ul>
            </SubSection>
          )}

          {isTicketmaster && event.attractions?.length > 0 && (
            <SubSection label="Line-up">
              <ul className="flex flex-col gap-1">
                {event.attractions.map((attraction) => (
                  <li key={attraction.id ?? attraction.name} className="text-[12.5px] text-[var(--d-text)]">
                    {attraction.url ? (
                      <a
                        href={attraction.url}
                        target="_blank"
                        rel="noreferrer"
                        className="d-focus rounded underline-offset-2 hover:underline"
                      >
                        {attraction.name}
                      </a>
                    ) : (
                      attraction.name
                    )}
                  </li>
                ))}
              </ul>
            </SubSection>
          )}

          {presales.length > 0 && (
            <SubSection label="Presales">
              <ul className="flex flex-col gap-2">
                {presales.map((presale, index) => (
                  <li key={`${presale.name}-${index}`} className="text-[12.5px] text-[var(--d-text)]">
                    <div className="flex flex-wrap items-center justify-between gap-x-3">
                      <span className="font-medium">{presale.name ?? 'Presale'}</span>
                      <span className="text-[11.5px] text-[var(--d-subtle)]">
                        {[formatMoment(presale.startDateTime), formatMoment(presale.endDateTime)]
                          .filter(Boolean)
                          .join(' – ')}
                      </span>
                    </div>
                    {presale.description && (
                      <p className="text-[11.5px] text-[var(--d-subtle)]">{presale.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </SubSection>
          )}

          {(event.promoters?.length > 0 || event.promoter) && (
            <SubSection label="Promoter">
              <ul className="flex flex-col gap-1">
                {[event.promoter, ...(event.promoters ?? [])]
                  .filter(Boolean)
                  .map((promoter, index) => (
                    <li key={`${promoter.id ?? promoter.name}-${index}`} className="text-[12.5px] text-[var(--d-text)]">
                      {promoter.name}
                      {promoter.description && (
                        <span className="block text-[11.5px] text-[var(--d-subtle)]">{promoter.description}</span>
                      )}
                    </li>
                  ))}
              </ul>
            </SubSection>
          )}

          {isTicketmaster && event.accessibility && (
            <SubSection label="Accessibility">
              <p className="text-[12.5px] leading-6 text-[var(--d-muted)]">{event.accessibility}</p>
            </SubSection>
          )}

          {(event.seatmapUrl || externalLinks.length > 0 || event.ticketUrl) && (
            <SubSection label="Links">
              <div className="flex flex-wrap gap-1.5">
                {event.ticketUrl && (
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="d-focus inline-flex h-7 items-center rounded-md border border-[var(--d-line-strong)] px-2.5 text-[12px] font-medium text-[var(--d-text)] hover:bg-white/[0.06]"
                  >
                    Ticketmaster
                  </a>
                )}
                {event.seatmapUrl && (
                  <a
                    href={event.seatmapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="d-focus inline-flex h-7 items-center rounded-md border border-[var(--d-line-strong)] px-2.5 text-[12px] font-medium text-[var(--d-text)] hover:bg-white/[0.06]"
                  >
                    Seat map
                  </a>
                )}
                {externalLinks.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="d-focus inline-flex h-7 items-center rounded-md border border-[var(--d-line)] px-2.5 text-[12px] font-medium text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]"
                  >
                    {EXTERNAL_LINK_LABELS[key] ?? key}
                  </a>
                ))}
              </div>
            </SubSection>
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
          {event.ticketUrl && (
            <Button href={event.ticketUrl} target="_blank" rel="noreferrer" size="sm">
              Get tickets
            </Button>
          )}
          {registration && registration.status !== 'cancelled' && (
            <Button variant="danger" size="sm" onClick={() => onCancel(registration)}>
              Cancel registration
            </Button>
          )}
          {canRegister && onRegister && (
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
