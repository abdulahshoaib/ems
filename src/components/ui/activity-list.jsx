import { formatRelativeTime } from '../../lib/dates'
import { AlertIcon, BellIcon, CloseIcon, RefreshIcon, SparklesIcon, TicketIcon } from './icons'

const ACTIVITY_META = {
  registration: { icon: TicketIcon, label: 'Registration' },
  'event-update': { icon: RefreshIcon, label: 'Event update' },
  reminder: { icon: BellIcon, label: 'Reminder' },
  cancellation: { icon: CloseIcon, label: 'Cancellation' },
  feedback: { icon: SparklesIcon, label: 'Feedback' },
}

export function ActivityList({ items, getEventTitle, emptyMessage = 'No recent activity yet.' }) {
  if (!items || items.length === 0) {
    return (
      <p className="flex items-center gap-2 border-y border-[var(--d-line)] py-6 text-[13px] text-[var(--d-muted)]">
        <AlertIcon className="h-3.5 w-3.5 shrink-0" />
        {emptyMessage}
      </p>
    )
  }

  return (
    <ul className="divide-y divide-[var(--d-line)] border-y border-[var(--d-line)]">
      {items.map((item) => {
        const meta = ACTIVITY_META[item.type] ?? ACTIVITY_META.registration
        const Icon = meta.icon
        const eventTitle = getEventTitle?.(item.eventId)
        return (
          <li key={item.id} className="flex gap-3 py-2.5">
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--d-subtle)]" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-[12.5px] font-medium text-[var(--d-text)]">{item.title}</p>
              <p className="text-[12px] text-[var(--d-muted)]">{item.description}</p>
              <p className="text-[11px] text-[var(--d-subtle)]">
                <span className="uppercase tracking-wide">{meta.label}</span>
                {eventTitle && (
                  <>
                    <span className="mx-1.5">·</span>
                    {eventTitle}
                  </>
                )}
                <span className="mx-1.5">·</span>
                <time dateTime={item.timestamp}>{formatRelativeTime(item.timestamp)}</time>
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
