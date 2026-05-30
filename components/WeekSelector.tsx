'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Plus, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  addWeeks,
  formatWeekLabel,
  isCurrentWeek,
  getMondayOf,
  toISODate,
} from '@/lib/week'

interface Props {
  weekStart: Date
  onChange: (newWeekStart: Date) => void
  availableWeeks: Date[]
  onCreateWeek?: () => Promise<void>
  canCreate?: boolean
}

export default function WeekSelector({
  weekStart,
  onChange,
  availableWeeks,
  onCreateWeek,
  canCreate = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const isCurrent = isCurrentWeek(weekStart)

  const handleCreate = async () => {
    if (!onCreateWeek) return
    setCreating(true)
    try {
      await onCreateWeek()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex items-center gap-1 px-4 py-1.5 border-b bg-blue-50/50">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(addWeeks(weekStart, -1))}
        title="Previous week"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white text-sm font-medium min-w-[200px] justify-center"
        >
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{formatWeekLabel(weekStart)}</span>
          {isCurrent && (
            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
              This Week
            </span>
          )}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-9 z-50 w-72 rounded-md border border-gray-300 bg-white shadow-lg py-1 max-h-80 overflow-auto">
              {availableWeeks.map((w) => {
                const selected = toISODate(w) === toISODate(weekStart)
                const cur = isCurrentWeek(w)
                return (
                  <button
                    key={toISODate(w)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between',
                      selected && 'bg-blue-100 font-medium'
                    )}
                    onClick={() => {
                      onChange(w)
                      setOpen(false)
                    }}
                  >
                    <span>{formatWeekLabel(w)}</span>
                    {cur && (
                      <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                        Now
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(addWeeks(weekStart, 1))}
        title="Next week"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onChange(getMondayOf(new Date()))}
        >
          Jump to current week
        </Button>
      )}

      {canCreate && onCreateWeek && (
        <div className="ml-auto">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={handleCreate}
            disabled={creating}
            title="Duplicate this week's sessions into next week (resets all confirmations and statuses)"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {creating ? 'Creating…' : 'Duplicate to Next Week'}
          </Button>
        </div>
      )}
    </div>
  )
}
