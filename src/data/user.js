/**
 * The signed-in user. This stands in for the profile returned by the accounts
 * service (see the auth integration notes in the dashboard README section).
 * There is no real authentication yet — do not treat this as a session.
 */
export const currentUser = {
  id: 'usr-001',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatarUrl: null,
  role: 'Event Enthusiast',
  bio: 'Frontend engineer who likes community meetups, live music and anything that gets people together offline.',
  phone: '+1 (555) 010-2030',
  location: 'San Francisco, CA',
  memberSince: '2024-03-15T00:00:00.000Z',
  interests: ['Technology', 'Music', 'Business', 'Arts & Culture'],
}
