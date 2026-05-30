'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import MetricsBar from '@/components/MetricsBar'
import SessionPlanningTable from '@/components/SessionPlanningTable'
import CalendarView from '@/components/CalendarView'
import { useSessions } from '@/hooks/useSessions'
import { useSessionTypes } from '@/hooks/useSessionTypes'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { TableIcon, CalendarDays, Settings2 } from 'lucide-react'
import SessionTypesManager from '@/components/SessionTypesManager'

type PlanningView = 'table' | 'calendar'

export default function PlanningPage() {
  const router = useRouter()
  const { role, loading: authLoading } = useAuth()
  const { sessions, loading, addSession, updateSession, deleteSession } = useSessions()
  const { sessionTypes, addType, toggleType } = useSessionTypes()
  const [view, setView] = useState<PlanningView>('table')
  const [showTypes, setShowTypes] = useState(false)

  useEffect(() => {
    if (!authLoading && role && role !== 'pm') {
      router.replace('/live-ops')
    }
  }, [authLoading, role, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        Loading…
      </div>
    )
  }

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2 text-sm">
        <p className="text-foreground font-medium">Account not provisioned</p>
        <p className="text-muted-foreground">
          Your user has not been added to the team yet. Contact the admin.
        </p>
      </div>
    )
  }

  if (role !== 'pm') {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        Redirecting…
      </div>
    )
  }

  const canEdit = role === 'pm'

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Nav sessions={sessions} />
      <MetricsBar sessions={sessions} />

      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background">
        <h1 className="text-sm font-semibold">Session Planning</h1>
        <span className="text-xs text-muted-foreground">
          ({sessions.length} sessions)
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
            sessions={sessions}
            sessionTypes={sessionTypes}
            onAdd={addSession}
            onUpdate={updateSession}
            onDelete={deleteSession}
            canEdit={canEdit}
          />
        ) : (
          <CalendarView sessions={sessions} />
        )}
      </main>
    </div>
  )
}
