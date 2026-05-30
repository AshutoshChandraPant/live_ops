'use client'

import { useState, useEffect } from 'react'
import { getMondayOf, toISODate } from '@/lib/week'
import { parseISO } from 'date-fns'

const STORAGE_KEY = 'liveops:selected-week'

export function useWeekState() {
  const [weekStart, setWeekStartState] = useState<Date>(() => getMondayOf(new Date()))

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const date = parseISO(stored)
        if (!isNaN(date.getTime())) {
          setWeekStartState(getMondayOf(date))
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  const setWeekStart = (d: Date) => {
    const monday = getMondayOf(d)
    setWeekStartState(monday)
    try {
      localStorage.setItem(STORAGE_KEY, toISODate(monday))
    } catch {
      /* ignore */
    }
  }

  return { weekStart, setWeekStart }
}
