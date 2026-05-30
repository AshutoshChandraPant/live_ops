import {
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks as fnsAddWeeks,
  parseISO,
  format,
  isSameWeek,
  isWithinInterval,
} from 'date-fns'

const WEEK_OPTS = { weekStartsOn: 1 as const } // Monday

export function getMondayOf(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date
  return startOfWeek(d, WEEK_OPTS)
}

export function getSundayOf(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date
  return endOfWeek(d, WEEK_OPTS)
}

export function addWeeks(date: Date | string, n: number): Date {
  const d = typeof date === 'string' ? parseISO(date) : date
  return fnsAddWeeks(d, n)
}

export function isInWeek(sessionDate: string, weekStart: Date): boolean {
  return isWithinInterval(parseISO(sessionDate), {
    start: weekStart,
    end: getSundayOf(weekStart),
  })
}

export function isCurrentWeek(weekStart: Date): boolean {
  return isSameWeek(weekStart, new Date(), WEEK_OPTS)
}

export function formatWeekLabel(weekStart: Date): string {
  const sunday = getSundayOf(weekStart)
  return `${format(weekStart, 'dd MMM')} – ${format(sunday, 'dd MMM yyyy')}`
}

export function formatWeekShort(weekStart: Date): string {
  return format(weekStart, 'dd MMM')
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function addDaysToISO(isoDate: string, days: number): string {
  return toISODate(addDays(parseISO(isoDate), days))
}

/**
 * Returns all unique week-start Mondays for which we have any sessions,
 * plus the current week and next week even if empty.
 */
export function getAvailableWeeks(sessionDates: string[]): Date[] {
  const set = new Set<string>()
  for (const d of sessionDates) {
    set.add(toISODate(getMondayOf(d)))
  }
  // Always include current week + next week
  set.add(toISODate(getMondayOf(new Date())))
  set.add(toISODate(getMondayOf(addWeeks(new Date(), 1))))

  return Array.from(set)
    .map((s) => parseISO(s))
    .sort((a, b) => a.getTime() - b.getTime())
}
