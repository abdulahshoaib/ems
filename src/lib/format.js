export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function formatCurrency(amount) {
  if (!amount) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatEventLocation(location) {
  if (!location) return 'Location to be announced'
  if (location.mode === 'online') return 'Online event'
  const place = [location.venue, location.city].filter(Boolean).join(', ')
  const base = place || 'Location to be announced'
  return location.mode === 'hybrid' ? `${base} · Hybrid` : base
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}
