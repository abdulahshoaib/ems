import { useOutletContext } from 'react-router-dom'

/**
 * Access the dashboard store shared by every dashboard route through the
 * layout's <Outlet context={...} />.
 */
export function useDashboardData() {
  const context = useOutletContext()
  if (!context) {
    throw new Error('useDashboardData must be used inside the dashboard layout route')
  }
  return context
}
