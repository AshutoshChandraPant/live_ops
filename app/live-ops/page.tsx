'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import MetricsBar from '@/components/MetricsBar'
import LiveOpsTable from '@/components/LiveOpsTable'
import CalendarView from '@/components/CalendarView'
import { useSessions } from '@/hooks/useSessions'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { TableIcon, CalendarDays } from 'lucide-react'

type LiveView = 'table' | 'calendar'

export default function LiveOpsPage() {
  const { role, loading: authLoading } = useAuth()
  const { sessions, loading, updateSession, addOpsM, removeOpsM } = useSessions(true)
  const { members } = useTeamMembers()
  const [view, setView] = useState<LiveView>('table')

  if (authLoading) return null

  const canEditOps = role === 'ops' || role === 'pm'

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Nav sessions={sessions} />
      <MetricsBar sessions={sessions} />

      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background">
        <h1 className="text-sm font-semibold">Live Ops</h1>
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
        </div>
      </div>

      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading…
          </div>
        ) : view === 'table' ? (
          <LiveOpsTable
            sessions={sessions}
            members={members}
            onUpdate={updateSession}
            onAddOpsM={addOpsM}
            onRemoveOpsM={removeOpsM}
            canEditOps={canEditOps}
          />
        ) : (
          <CalendarView sessions={sessions} />
        )}
      </main>
    </div>
  )
}
