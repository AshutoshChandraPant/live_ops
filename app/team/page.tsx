'use client'

import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import TeamTable from '@/components/TeamTable'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { useSessions } from '@/hooks/useSessions'
import { useAuth } from '@/hooks/useAuth'

export default function TeamPage() {
  const { role, loading: authLoading } = useAuth()
  const { members, loading, updateMember, deleteMember } = useTeamMembers()
  const { sessions } = useSessions()

  if (authLoading) return null
  if (role === 'leadership') redirect('/live-ops')

  const canEdit = role === 'pm'

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Nav sessions={sessions} />

      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background">
        <h1 className="text-sm font-semibold">Team Management</h1>
        <span className="text-xs text-muted-foreground">({members.length} members)</span>
      </div>

      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading…
          </div>
        ) : (
          <TeamTable
            members={members}
            sessions={sessions}
            onUpdate={updateMember}
            onDelete={deleteMember}
            canEdit={canEdit}
          />
        )}
      </main>
    </div>
  )
}
