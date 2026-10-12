import { isoDaysFromNow, isoHoursFromNow } from '../lib/dates'

/**
 * Representative activity feed for the signed-in user. These entries are
 * illustrative mock data — they are not pulled from a live notification
 * service and are safe to replace with real API results later.
 */
export const activityFeed = [
  {
    id: 'act-001',
    type: 'registration',
    title: 'Registration confirmed',
    description: 'Your spot for React & Vite Deep Dive Workshop is confirmed.',
    eventId: 'evt-002',
    timestamp: isoHoursFromNow(-5),
  },
  {
    id: 'act-002',
    type: 'event-update',
    title: 'Schedule update',
    description: 'Startup Pitch Night moved its doors-open time to 6:30 PM.',
    eventId: 'evt-004',
    timestamp: isoHoursFromNow(-26),
  },
  {
    id: 'act-003',
    type: 'reminder',
    title: 'Event starting soon',
    description: 'Startup Pitch Night starts in 3 days. Check your ticket details.',
    eventId: 'evt-004',
    timestamp: isoDaysFromNow(-1, 9),
  },
  {
    id: 'act-004',
    type: 'registration',
    title: 'Awaiting confirmation',
    description: 'Cloud Native Meetup needs organiser approval before it is finalised.',
    eventId: 'evt-011',
    timestamp: isoDaysFromNow(-1, 20),
  },
  {
    id: 'act-005',
    type: 'cancellation',
    title: 'Registration cancelled',
    description: 'You cancelled your registration for Community Food & Wine Tasting.',
    eventId: 'evt-010',
    timestamp: isoDaysFromNow(-4, 16),
  },
  {
    id: 'act-006',
    type: 'feedback',
    title: 'How was it?',
    description: 'Share feedback for AI in Education Conference to get your certificate.',
    eventId: 'evt-008',
    timestamp: isoDaysFromNow(-20, 10),
  },
]

/**
 * Notification centre entries shown in the top bar. `read` drives the unread
 * badge; marking them read is local UI state only.
 */
export const notifications = [
  {
    id: 'ntf-001',
    type: 'reminder',
    title: 'Startup Pitch Night is in 3 days',
    description: 'Doors open at 6:30 PM at Innovation Hub.',
    eventId: 'evt-004',
    timestamp: isoDaysFromNow(-1, 9),
    read: false,
  },
  {
    id: 'ntf-002',
    type: 'registration',
    title: 'Registration pending approval',
    description: 'Cloud Native Meetup is waiting on the organiser.',
    eventId: 'evt-011',
    timestamp: isoDaysFromNow(-1, 20),
    read: false,
  },
  {
    id: 'ntf-003',
    type: 'event-update',
    title: 'Schedule update for an event you follow',
    description: 'React & Vite Deep Dive Workshop added a Q&A session.',
    eventId: 'evt-002',
    timestamp: isoHoursFromNow(-8),
    read: false,
  },
  {
    id: 'ntf-004',
    type: 'feedback',
    title: 'Leave feedback',
    description: 'AI in Education Conference would love your thoughts.',
    eventId: 'evt-008',
    timestamp: isoDaysFromNow(-19, 12),
    read: true,
  },
  {
    id: 'ntf-005',
    type: 'promo',
    title: 'New events near you',
    description: '4 new events were added in San Francisco this week.',
    eventId: null,
    timestamp: isoDaysFromNow(-3, 8),
    read: true,
  },
]
