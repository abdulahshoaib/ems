import { events, registrations } from './events'
import { currentUser } from './user'
import { activityFeed, notifications } from './activity'

const NETWORK_DELAY_MS = 350

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Mock data-access layer for the dashboard. It mirrors the shape a real API
 * client would return so the UI can keep its loading/error handling when the
 * backend lands — only this module needs to change at that point.
 */
export async function loadDashboardData() {
  await delay(NETWORK_DELAY_MS)
  return {
    user: currentUser,
    events: [...events],
    registrations: [...registrations],
    activity: [...activityFeed],
    notifications: [...notifications],
  }
}
