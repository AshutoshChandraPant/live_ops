'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TeamMember } from '@/lib/types'

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('name')
    setMembers((data as TeamMember[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const addMember = useCallback(
    async (data: Omit<TeamMember, 'id' | 'created_at'> & { id: string }) => {
      const { error } = await supabase.from('team_members').insert(data)
      if (error) throw new Error(error.message)
      await fetchMembers()
    },
    [fetchMembers, supabase]
  )

  const updateMember = useCallback(
    async (id: string, data: Partial<Omit<TeamMember, 'id' | 'created_at'>>) => {
      const { error } = await supabase
        .from('team_members')
        .update(data)
        .eq('id', id)
      if (error) throw new Error(error.message)
      await fetchMembers()
    },
    [fetchMembers, supabase]
  )

  const deleteMember = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('team_members').delete().eq('id', id)
      if (error) throw new Error(error.message)
      await fetchMembers()
    },
    [fetchMembers, supabase]
  )

  return { members, loading, addMember, updateMember, deleteMember, refetch: fetchMembers }
}
