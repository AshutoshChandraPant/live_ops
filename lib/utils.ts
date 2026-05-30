import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isToday, isThisWeek, differenceInHours } from 'date-fns'
import type { Session, Notification } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(parseISO(date), 'dd MMM yyyy')
}

export function formatTime(time: string) {
  const [h, m] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(h), parseInt(m))
  return format(date, 'HH:mm')
}

export function formatTimeRange(start: string, end: string) {
  return `${formatTime(start)} – ${formatTime(end)}`
}

export function getDayOfWeek(date: string) {
  return format(parseISO(date), 'EEE')
}

export function getSessionStatus(session: Session) {
  if (session.cancelled) return 'Cancelled'
  if (session.final_confirmed) return 'Confirmed'
  if (session.soft_confirmed) return 'Awaiting Final Confirmation'
  return 'Draft'
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Awaiting Final Confirmation':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Draft':
      return 'bg-gray-100 text-gray-500 border-gray-200'
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

export function getCalendarColor(status: string) {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-500'
    case 'Awaiting Final Confirmation':
      return 'bg-yellow-400'
    case 'Draft':
      return 'bg-gray-400'
    case 'Cancelled':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

export function buildNotifications(sessions: Session[]): Notification[] {
  const notifications: Notification[] = []
  const now = new Date()

  for (const session of sessions) {
    if (!session.soft_confirmed) continue

    const sessionDateTime = new Date(`${session.date}T${session.start_time}`)

    if (!session.instructor) {
      notifications.push({
        id: `${session.id}-no-instructor`,
        sessionId: session.id,
        type: 'missing_instructor',
        message: `Missing instructor — ${session.program} ${session.session_type} on ${formatDate(session.date)}`,
        date: session.date,
      })
    }

    if (!session.ops_in_charge) {
      notifications.push({
        id: `${session.id}-no-moderator`,
        sessionId: session.id,
        type: 'missing_moderator',
        message: `Unassigned ops — ${session.program} ${session.session_type} on ${formatDate(session.date)}`,
        date: session.date,
      })
    }

    if (session.soft_confirmed && !session.final_confirmed) {
      notifications.push({
        id: `${session.id}-pending-confirm`,
        sessionId: session.id,
        type: 'pending_confirmation',
        message: `Awaiting final confirmation — ${session.program} ${session.session_type} on ${formatDate(session.date)}`,
        date: session.date,
      })
    }

    if (
      session.final_confirmed &&
      session.deck_status !== 'Ready' &&
      session.deck_status !== 'Shared'
    ) {
      notifications.push({
        id: `${session.id}-deck-pending`,
        sessionId: session.id,
        type: 'deck_pending',
        message: `Deck not ready — ${session.program} ${session.session_type} on ${formatDate(session.date)}`,
        date: session.date,
      })
    }

    const hoursUntil = differenceInHours(sessionDateTime, now)
    if (hoursUntil >= 0 && hoursUntil <= 24 && session.final_confirmed) {
      notifications.push({
        id: `${session.id}-starting-soon`,
        sessionId: session.id,
        type: 'starting_soon',
        message: `Starting in ${Math.round(hoursUntil)}h — ${session.program} ${session.session_type}`,
        date: session.date,
      })
    }
  }

  return notifications
}

export function computeMetrics(sessions: Session[]) {
  const todaySessions = sessions.filter(
    (s) => isToday(parseISO(s.date)) && !s.cancelled
  )
  const weekSessions = sessions.filter(
    (s) => isThisWeek(parseISO(s.date), { weekStartsOn: 1 }) && !s.cancelled
  )
  const pendingConfirmations = sessions.filter(
    (s) => s.soft_confirmed && !s.final_confirmed && !s.cancelled
  )
  const unassigned = sessions.filter(
    (s) => s.soft_confirmed && !s.ops_in_charge && !s.cancelled
  )

  return {
    today: todaySessions.length,
    thisWeek: weekSessions.length,
    pendingConfirmations: pendingConfirmations.length,
    unassigned: unassigned.length,
  }
}
