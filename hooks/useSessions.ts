'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session, SessionInsert, SessionUpdate } from '@/lib/types'

export function useSessions(onlyConfirmed = false) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSessions = useCallback(async () => {
    let query = supabase
      .from('sessions_with_status')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (onlyConfirmed) {
      query = query.eq('soft_confirmed', true).eq('cancelled', false)
    }

    const { data, error } = await query
    if (error) {
      setError(error.message)
    } else {
      setSessions(data as Session[])
    }
    setLoading(false)
  }, [onlyConfirmed, supabase])

  // Debounce realtime-triggered refetches to avoid thrashing while typing
  const scheduleRefetch = useCallback(() => {
    if (refetchTimer.current) clearTimeout(refetchTimer.current)
    refetchTimer.current = setTimeout(() => fetchSessions(), 800)
  }, [fetchSessions])

  useEffect(() => {
    fetchSessions()

    const channel = supabase
      .channel('sessions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions' },
        scheduleRefetch
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'session_ops_members' },
        scheduleRefetch
      )
      .subscribe()

    return () => {
      if (refetchTimer.current) clearTimeout(refetchTimer.current)
      supabase.removeChannel(channel)
    }
  }, [fetchSessions, scheduleRefetch, supabase])

  const addSession = useCallback(
    async (data: SessionInsert) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('sessions').insert({
        ...data,
        created_by: user?.id,
      })
      if (error) throw new Error(error.message)
      await fetchSessions()
    },
    [fetchSessions, supabase]
  )

  // Optimistic update — patches local state immediately, then writes to DB
  const updateSession = useCallback(
    async (id: string, data: SessionUpdate) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } as Session : s))
      )
      const { error } = await supabase.from('sessions').update(data).eq('id', id)
      if (error) {
        // Rollback by refetching
        await fetchSessions()
        throw new Error(error.message)
      }
    },
    [fetchSessions, supabase]
  )

  const deleteSession = useCallback(
    async (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id))
      const { error } = await supabase.from('sessions').delete().eq('id', id)
      if (error) {
        await fetchSessions()
        throw new Error(error.message)
      }
    },
    [fetchSessions, supabase]
  )

  const addOpsM = useCallback(
    async (sessionId: string, memberId: string, memberName: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                additional_ops: [
                  ...(s.additional_ops ?? []),
                  { id: memberId, name: memberName },
                ],
              }
            : s
        )
      )
      const { error } = await supabase.from('session_ops_members').insert({
        session_id: sessionId,
        member_id: memberId,
      })
      if (error) {
        await fetchSessions()
        throw new Error(error.message)
      }
    },
    [fetchSessions, supabase]
  )

  const removeOpsM = useCallback(
    async (sessionId: string, memberId: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                additional_ops: (s.additional_ops ?? []).filter(
                  (a) => a.id !== memberId
                ),
              }
            : s
        )
      )
      const { error } = await supabase
        .from('session_ops_members')
        .delete()
        .eq('session_id', sessionId)
        .eq('member_id', memberId)
      if (error) {
        await fetchSessions()
        throw new Error(error.message)
      }
    },
    [fetchSessions, supabase]
  )

  return {
    sessions,
    loading,
    error,
    addSession,
    updateSession,
    deleteSession,
    addOpsM,
    removeOpsM,
    refetch: fetchSessions,
  }
}
