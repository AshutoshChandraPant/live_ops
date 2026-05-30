'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import TeamTable from '@/components/TeamTable'
import { useTeamMembers } from '@/hooks/useTeamMembers'
import { useSessions } from '@/hooks/useSessions'
import { useAuth } from '@/hooks/useAuth'

export default function TeamPage() {
  const router = useRouter()
  const { role, loading: authLoading } = useAuth()
  const { members, loading, updateMember, deleteMember } = useTeamMembers()
  const { sessions } = useSessions()

  useEffect(() => {
    if (!authLoading && role === 'leadership') {
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
