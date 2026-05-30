'use client'

import { useState, useMemo } from 'react'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import MetricsBar from '@/components/MetricsBar'
import SessionPlanningTable from '@/components/SessionPlanningTable'
import CalendarView from '@/components/CalendarView'
import WeekSelector from '@/components/WeekSelector'
import { useSessions } from '@/hooks/useSessions'
import { useSessionTypes } from '@/hooks/useSessionTypes'
import { useAuth } from '@/hooks/useAuth'
import { useWeekState } from '@/hooks/useWeekState'
import { Button } from '@/components/ui/button'
import { TableIcon, CalendarDays, Settings2 } from 'lucide-react'
import SessionTypesManager from '@/components/SessionTypesManager'
import { isInWeek, getAvailableWeeks, addWeeks } from '@/lib/week'

type PlanningView = 'table' | 'calendar'

export default function PlanningPage() {
  const { role, loading: authLoading } = useAuth()
  const { sessions, loading, addSession, updateSession, deleteSession, duplicateWeek } = useSessions()
  const { sessionTypes, addType, toggleType } = useSessionTypes()
  const { weekStart, setWeekStart } = useWeekState()
  const [view, setView] = useState<PlanningView>('table')
  const [showTypes, setShowTypes] = useState(false)

  const weekSessions = useMemo(
    () => sessions.filter((s) => isInWeek(s.date, weekStart)),
    [sessions, weekStart]
  )

  const availableWeeks = useMemo(
    () => getAvailableWeeks(sessions.map((s) => s.date)),
    [sessions]
  )

  if (authLoading) return null
  if (role && role !== 'pm') redirect('/live-ops')

  const canEdit = role === 'pm'

  const handleCreateWeek = async () => {
    await duplicateWeek(weekStart)
    setWeekStart(addWeeks(weekStart, 1))
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Nav sessions={sessions} />
      <MetricsBar sessions={weekSessions} />

      <WeekSelector
        weekStart={weekStart}
        onChange={setWeekStart}
        availableWeeks={availableWeeks}
        onCreateWeek={canEdit ? handleCreateWeek : undefined}
        canCreate={canEdit}
      />

      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background">
        <h1 className="text-sm font-semibold">Session Planning</h1>
        <span className="text-xs text-muted-foreground">
          ({weekSessions.length} sessions this week)
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant={view === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('table')}
          >
            <TableIcon className="h-3.5 w-3.5 mr-1" />
            Table
          </Button>
          <Button
            variant={view === 'calendar' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('calendar')}
          >
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            Calendar
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTypes((s) => !s)}
            >
              <Settings2 className="h-3.5 w-3.5 mr-1" />
              Session Types
            </Button>
          )}
        </div>
      </div>

      {showTypes && (
        <SessionTypesManager
          sessionTypes={sessionTypes}
          onAdd={addType}
          onToggle={toggleType}
          onClose={() => setShowTypes(false)}
        />
      )}

      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading…
          </div>
        ) : view === 'table' ? (
          <SessionPlanningTable
            sessions={weekSessions}
            sessionTypes={sessionTypes}
            onAdd={addSession}
            onUpdate={updateSession}
            onDelete={deleteSession}
            canEdit={canEdit}
          />
        ) : (
          <CalendarView sessions={weekSessions} />
        )}
      </main>
    </div>
  )
}
