'use client'

import { useState } from 'react'
import { ChevronDown, X, Filter, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface GroupOption {
  key: string
  label: string
}

export interface ColumnFilter {
  key: string
  label: string
  options: string[]
  selected: string[]
}

interface Props {
  search: string
  onSearchChange: (v: string) => void
  groupOptions: GroupOption[]
  groupBy: string | null
  onGroupByChange: (k: string | null) => void
  filters: ColumnFilter[]
  onFilterChange: (key: string, selected: string[]) => void
  extraActions?: React.ReactNode
}

export default function TableToolbar({
  search,
  onSearchChange,
  groupOptions,
  groupBy,
  onGroupByChange,
  filters,
  onFilterChange,
  extraActions,
}: Props) {
  const [groupOpen, setGroupOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState<string | null>(null)
  const activeFilterCount = filters.reduce((n, f) => n + f.selected.length, 0)

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
      <Input
        placeholder="Search…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-8 w-56"
      />

      {/* Group By */}
      <div className="relative">
        <Button
          variant={groupBy ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setGroupOpen((o) => !o)}
          className="h-8"
        >
          <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
          {groupBy ? `Grouped by ${groupOptions.find((g) => g.key === groupBy)?.label}` : 'Group by'}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
        {groupOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setGroupOpen(false)} />
            <div className="absolute left-0 top-9 z-50 w-48 rounded-md border border-gray-300 bg-white shadow-lg py-1">
              <button
                className={cn(
                  'w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50',
                  !groupBy && 'bg-blue-100 font-medium'
                )}
                onClick={() => {
                  onGroupByChange(null)
                  setGroupOpen(false)
                }}
              >
                None
              </button>
              {groupOptions.map((g) => (
                <button
                  key={g.key}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50',
                    groupBy === g.key && 'bg-blue-100 font-medium'
                  )}
                  onClick={() => {
                    onGroupByChange(g.key)
                    setGroupOpen(false)
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1">
        {filters.map((f) => (
          <div key={f.key} className="relative">
            <Button
              variant={f.selected.length > 0 ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilterOpen((o) => (o === f.key ? null : f.key))}
              className="h-8"
            >
              <Filter className="h-3 w-3 mr-1" />
              {f.label}
              {f.selected.length > 0 && (
                <span className="ml-1 text-xs bg-blue-500 text-white rounded-full px-1.5">
                  {f.selected.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            {filterOpen === f.key && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(null)} />
                <div className="absolute left-0 top-9 z-50 w-56 max-h-72 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg py-1">
                  {f.selected.length > 0 && (
                    <button
                      className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 border-b border-gray-200"
                      onClick={() => onFilterChange(f.key, [])}
                    >
                      Clear filter
                    </button>
                  )}
                  {f.options.map((opt) => {
                    const checked = f.selected.includes(opt)
                    return (
                      <label
                        key={opt}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-blue-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? f.selected.filter((s) => s !== opt)
                              : [...f.selected, opt]
                            onFilterChange(f.key, next)
                          }}
                          className="h-3.5 w-3.5"
                        />
                        <span className="truncate">{opt || '(empty)'}</span>
                      </label>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        ))}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => filters.forEach((f) => onFilterChange(f.key, []))}
            className="h-8 text-xs text-muted-foreground"
          >
            <X className="h-3 w-3 mr-0.5" />
            Clear all
          </Button>
        )}
      </div>

      <div className="ml-auto flex gap-2">{extraActions}</div>
    </div>
  )
}
