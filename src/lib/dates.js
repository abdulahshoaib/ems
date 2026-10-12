const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000
const MINUTE_MS = 60_000

export function isoDaysFromNow(days, hour = 18, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

export function isoHoursFromNow(hours) {
  return new Date(Date.now() + hours * HOUR_MS).toISOString()
}

function toDate(value) {
  return value instanceof Date ? value : new Date(value)
}

export function formatEventDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(toDate(value))
}

export function formatEventTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(toDate(value))
}

export function formatDateRange(start, end) {
  const startDate = toDate(start)
  const endDate = end ? toDate(end) : null
  const dayLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  const startLabel = `${dayLabel.format(startDate)}, ${formatEventTime(startDate)}`
  if (!endDate || endDate.toDateString() === startDate.toDateString()) {
    return startLabel
  }
  return `${startLabel} – ${dayLabel.format(endDate)}, ${formatEventTime(endDate)}`
}

export function formatMonthYear(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(toDate(value))
}

export function formatRelativeTime(value) {
  const diffMs = toDate(value).getTime() - Date.now()
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })
  const abs = Math.abs(diffMs)

  if (abs < MINUTE_MS) return 'just now'
  if (abs < HOUR_MS) return rtf.format(Math.round(diffMs / MINUTE_MS), 'minute')
  if (abs < DAY_MS) return rtf.format(Math.round(diffMs / HOUR_MS), 'hour')
  if (abs < 30 * DAY_MS) return rtf.format(Math.round(diffMs / DAY_MS), 'day')
  if (abs < 365 * DAY_MS) return rtf.format(Math.round(diffMs / (30 * DAY_MS)), 'month')
  return rtf.format(Math.round(diffMs / (365 * DAY_MS)), 'year')
}
