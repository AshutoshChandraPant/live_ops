'use client'

import { useState } from 'react'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCalendarColor, getSessionStatus, formatTimeRange } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Session } from '@/lib/types'

type CalView = 'week' | 'day' | 'month'

export default function CalendarView({ sessions }: { sessions: Session[] }) {
  const [view, setView] = useState<CalView>('week')
  const [cursor, setCursor] = useState(new Date())

  const nav = (dir: 1 | -1) => {
    if (view === 'week') setCursor(dir > 0 ? addWeeks(cursor, 1) : subWeeks(cursor, 1))
    else if (view === 'month') setCursor(dir > 0 ? addMonths(cursor, 1) : subMonths(cursor, 1))
    else setCursor(new Date(cursor.getTime() + dir * 86400000))
  }

  const days = view === 'week'
    ? eachDayOfInterval({ start: startOfWeek(cursor, { weekStartsOn: 1 }), end: endOfWeek(cursor, { weekStartsOn: 1 }) })
    : view === 'month'
    ? eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) })
    : [cursor]

  const title = view === 'week'
    ? `${format(days[0], 'dd MMM')} – ${format(days[days.length - 1], 'dd MMM yyyy')}`
    : view === 'month'
    ? format(cursor, 'MMMM yyyy')
    : format(cursor, 'EEEE, dd MMM yyyy')

  const sessionsOnDay = (day: Date) =>
    sessions.filter((s) => isSameDay(parseISO(s.date), day))

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 border-b">
        <div className="flex gap-1">
          {(['week', 'day', 'month'] as CalView[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? 'secondary' : 'ghost'}
              size="sm"
              className="capitalize text-xs"
              onClick={() => setView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Button variant="ghost" size="icon" onClick={() => nav(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-48 text-center">{title}</span>
          <Button variant="ghost" size="icon" onClick={() => nav(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs ml-auto" onClick={() => setCursor(new Date())}>
          Today
        </Button>
      </div>

      <div
        className={cn(
          'flex-1 grid overflow-auto p-4 gap-2',
          view === 'month' ? 'grid-cols-7' : `grid-cols-${days.length}`
        )}
      >
        {days.map((day) => {
          const daySessions = sessionsOnDay(day)
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[120px] border rounded-md p-1.5 flex flex-col gap-1',
                isToday(day) ? 'border-primary bg-primary/5' : 'border-border'
              )}
            >
              <div
                className={cn(
                  'text-xs font-medium mb-1',
                  isToday(day) ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <span className="block">{format(day, 'EEE')}</span>
                <span>{format(day, 'd')}</span>
              </div>
              {daySessions.map((s) => {
                const status = getSessionStatus(s)
                return (
                  <div
                    key={s.id}
                    className={cn(
                      'rounded px-1.5 py-0.5 text-xs text-white font-medium truncate',
                      getCalendarColor(status)
                    )}
                    title={`${s.program} • ${s.session_type} • ${formatTimeRange(s.start_time, s.end_time)}`}
                  >
                    {format(parseISO(`2000-01-01T${s.start_time}`), 'HH:mm')} {s.program}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 px-4 py-2 border-t text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />Draft</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Soft Confirmed</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Confirmed</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Cancelled</span>
      </div>
    </div>
  )
}
