'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SessionType } from '@/lib/types'

export function useSessionTypes() {
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([])
  const supabase = createClient()

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('session_types')
      .select('*')
      .eq('active', true)
      .order('name')
    setSessionTypes((data as SessionType[]) ?? [])
  }, [supabase])

  useEffect(() => {
    fetch()
  }, [fetch])

  const addType = useCallback(
    async (name: string) => {
      const { error } = await supabase.from('session_types').insert({ name })
      if (error) throw new Error(error.message)
      await fetch()
    },
    [fetch, supabase]
  )

  const toggleType = useCallback(
    async (id: string, active: boolean) => {
      await supabase.from('session_types').update({ active }).eq('id', id)
      await fetch()
    },
    [fetch, supabase]
  )

  return { sessionTypes, addType, toggleType, refetch: fetch }
}
