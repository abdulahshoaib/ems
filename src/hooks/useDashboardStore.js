import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadDashboardData } from '../data/mockApi'
import { deriveSummary } from '../data/selectors'

let activitySequence = 0

function createActivityEntry(type, title, description, eventId) {
  activitySequence += 1
  return {
    id: `act-local-${Date.now()}-${activitySequence}`,
    type,
    title,
    description,
    eventId,
    timestamp: new Date().toISOString(),
  }
}

/**
 * In-memory dashboard store. Seeded from the mock data layer, then mutated
 * locally by register/cancel/profile actions so the UI stays reactive during
 * development. Nothing here is persisted — the backend will replace it.
 */
export function useDashboardStore() {
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const retry = useCallback(() => {
    setStatus('loading')
    setError(null)
    return loadDashboardData()
      .then((payload) => {
        setData(payload)
        setStatus('ready')
      })
      .catch((loadError) => {
        setError(loadError)
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    let cancelled = false
    async function start() {
      try {
        const payload = await loadDashboardData()
        if (cancelled) return
        setData(payload)
        setStatus('ready')
      } catch (loadError) {
        if (cancelled) return
        setError(loadError)
        setStatus('error')
      }
    }
    start()
    return () => {
      cancelled = true
    }
  }, [])

  const registerForEvent = useCallback((eventId) => {
    setData((previous) => {
      if (!previous) return previous
      const existing = previous.registrations.find((item) => item.eventId === eventId)
      const event = previous.events.find((item) => item.id === eventId)
      const activityEntry = createActivityEntry(
        'registration',
        'Registration submitted',
        `You registered for ${event ? event.title : 'an event'}. Approval is pending.`,
        eventId,
      )

      const nextRegistrations = existing
        ? previous.registrations.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  status: 'pending',
                  registeredAt: new Date().toISOString(),
                  cancelledAt: null,
                  ticketCode: null,
                }
              : item,
          )
        : [
            ...previous.registrations,
            {
              id: `reg-local-${Date.now()}`,
              userId: previous.user.id,
              eventId,
              status: 'pending',
              ticketType: 'General Admission',
              ticketCode: null,
              registeredAt: new Date().toISOString(),
            },
          ]

      return {
        ...previous,
        registrations: nextRegistrations,
        activity: [activityEntry, ...previous.activity],
      }
    })
  }, [])

  const cancelRegistration = useCallback((registrationId) => {
    setData((previous) => {
      if (!previous) return previous
      const registration = previous.registrations.find((item) => item.id === registrationId)
      const event = registration
        ? previous.events.find((item) => item.id === registration.eventId)
        : null
      const activityEntry = createActivityEntry(
        'cancellation',
        'Registration cancelled',
        `You cancelled your registration for ${event ? event.title : 'an event'}.`,
        event ? event.id : null,
      )
      return {
        ...previous,
        registrations: previous.registrations.map((item) =>
          item.id === registrationId
            ? { ...item, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : item,
        ),
        activity: [activityEntry, ...previous.activity],
      }
    })
  }, [])

  const updateProfile = useCallback((patch) => {
    setData((previous) => (previous ? { ...previous, user: { ...previous.user, ...patch } } : previous))
  }, [])

  const markNotificationsRead = useCallback(() => {
    setData((previous) =>
      previous
        ? {
            ...previous,
            notifications: previous.notifications.map((item) => ({ ...item, read: true })),
          }
        : previous,
    )
  }, [])

  const summary = useMemo(
    () => (data ? deriveSummary(data.events, data.registrations) : null),
    [data],
  )

  const unreadCount = useMemo(
    () => (data ? data.notifications.filter((item) => !item.read).length : 0),
    [data],
  )

  return {
    status,
    error,
    data,
    summary,
    unreadCount,
    retry,
    registerForEvent,
    cancelRegistration,
    updateProfile,
    markNotificationsRead,
  }
}
