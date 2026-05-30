'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState<string>('initialising')
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    // Safety timeout — never get stuck on loading
    const timeout = setTimeout(() => {
      if (mounted) {
        setDebug((d) => `${d} | TIMEOUT after 5s`)
        setLoading(false)
      }
    }, 5000)

    const fetchRole = async (uid: string) => {
      setDebug((d) => `${d} | fetching role for ${uid.slice(0, 8)}`)
      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('id', uid)
        .maybeSingle()
      if (!mounted) return
      if (error) {
        setDebug((d) => `${d} | role ERROR: ${error.message}`)
        setRole(null)
      } else {
        setDebug((d) => `${d} | role: ${data?.role ?? 'NONE'}`)
        setRole((data?.role as UserRole | undefined) ?? null)
      }
    }

    const init = async () => {
      try {
        setDebug('calling getUser')
        const { data, error } = await supabase.auth.getUser()
        if (!mounted) return
        if (error) {
          setDebug((d) => `${d} | getUser ERROR: ${error.message}`)
        }
        setUser(data.user)
        setDebug((d) => `${d} | user: ${data.user?.email ?? 'NONE'}`)
        if (data.user) {
          await fetchRole(data.user.id)
        }
      } catch (e: any) {
        setDebug((d) => `${d} | EXCEPTION: ${e?.message ?? String(e)}`)
      } finally {
        if (mounted) setLoading(false)
        clearTimeout(timeout)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchRole(session.user.id)
        } else {
          setRole(null)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, role, loading, signOut, debug }
}
