'use client'

import { useState, useMemo, Fragment } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, X, Plus, ChevronRight, ChevronDown as ChevDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import InlineSelect from '@/components/InlineSelect'
import TableToolbar, { type GroupOption, type ColumnFilter } from '@/components/TableToolbar'
import { cn, formatDate, formatTimeRange, getDayOfWeek, getSessionStatus } from '@/lib/utils'
import type {
  Session,
  SessionUpdate,
  TeamMember,
  Published,
  DeckStatus,
  InstructorConnect,
} from '@/lib/types'

interface Props {
  sessions: Session[]
  members: TeamMember[]
  onUpdate: (id: string, data: SessionUpdate) => Promise<void>
  onAddOpsM: (sessionId: string, memberId: string, memberName: string) => Promise<void>
  onRemoveOpsM: (sessionId: string, memberId: string) => Promise<void>
  canEditOps: boolean
}

const DECK_COLORS: Record<string, string> = {
  'Not Started': 'text-gray-500',
  Pending: 'text-orange-600',
  'In Progress': 'text-blue-600',
  Ready: 'text-green-600',
  Shared: 'text-green-800',
}

const IC_COLORS: Record<string, string> = {
  Pending: 'text-orange-600',
  Scheduled: 'text-blue-600',
  Completed: 'text-green-600',
}

function OpsMultiSelect({
  session,
  members,
  onAdd,
  onRemove,
  disabled,
}: {
  session: Session
  members: TeamMember[]
  onAdd: (memberId: string, memberName: string) => void
  onRemove: (memberId: string) => void
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const assigned = session.additional_ops ?? []
  const assignedIds = new Set(assigned.map((a) => a.id))
  const available = members.filter((m) => m.role === 'ops' && !assignedIds.has(m.id))

  return (
    <div className="flex flex-wrap gap-1 items-center min-w-[120px]">
      {assigned.map((a) => (
        <span
          key={a.id}
          className="inline-flex items-center gap-0.5 bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs"
        >
          {a.name}
          {!disabled && (
            <button onClick={() => onRemove(a.id)} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      {!disabled && available.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute left-0 top-5 z-50 w-40 rounded-md border bg-background shadow-lg py-1">
                {available.map((m) => (
                  <button
                    key={m.id}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent"
                    onClick={() => {
                      onAdd(m.id, m.name)
                      setOpen(false)
                    }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function StatusCell({ session }: { session: Session }) {
  const status = getSessionStatus(session)
  const variantMap: Record<string, 'draft' | 'soft' | 'confirmed' | 'cancelled'> = {
    Draft: 'draft',
    'Awaiting Final Confirmation': 'soft',
    Confirmed: 'confirmed',
    Cancelled: 'cancelled',
  }
  return <Badge variant={variantMap[status] ?? 'draft'}>{status}</Badge>
}

export default function LiveOpsTable({
  sessions,
  members,
  onUpdate,
  onAddOpsM,
  onRemoveOpsM,
  canEditOps,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [groupBy, setGroupBy] = useState<string | null>('date')
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const opsMembers = members.filter((m) => m.role === 'ops')

  const filterDefinitions: ColumnFilter[] = useMemo(() => {
    const uniq = (key: keyof Session) =>
      Array.from(new Set(sessions.map((s) => String(s[key] ?? '')).filter(Boolean))).sort()
    return [
      { key: 'program', label: 'Program', options: uniq('program'), selected: columnFilters['program'] ?? [] },
      { key: 'session_type', label: 'Type', options: uniq('session_type'), selected: columnFilters['session_type'] ?? [] },
      { key: 'deck_status', label: 'Deck', options: ['Not Started', 'Pending', 'In Progress', 'Ready', 'Shared'], selected: columnFilters['deck_status'] ?? [] },
      { key: 'published', label: 'Published', options: ['Yes', 'No'], selected: columnFilters['published'] ?? [] },
      { key: 'instructor_connect', label: 'Inst. Connect', options: ['Pending', 'Scheduled', 'Completed'], selected: columnFilters['instructor_connect'] ?? [] },
      { key: 'status', label: 'Status', options: ['Awaiting Final Confirmation', 'Confirmed', 'Cancelled'], selected: columnFilters['status'] ?? [] },
    ]
  }, [sessions, columnFilters])

  const groupOptions: GroupOption[] = [
    { key: 'date', label: 'Date' },
    { key: 'day', label: 'Day' },
    { key: 'program', label: 'Program' },
    { key: 'session_type', label: 'Type' },
    { key: 'deck_status', label: 'Deck Status' },
    { key: 'status', label: 'Status' },
  ]

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      for (const [key, vals] of Object.entries(columnFilters)) {
        if (!vals.length) continue
        const v = key === 'status' ? getSessionStatus(s) : (s as any)[key]
        if (!vals.includes(String(v))) return false
      }
      return true
    })
  }, [sessions, columnFilters])

  const columns = useMemo<ColumnDef<Session>[]>(
    () => [
      {
        id: 'day',
        header: () => <span className="text-xs font-medium text-muted-foreground">Day</span>,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-muted-foreground">
            {getDayOfWeek(row.original.date)}
          </span>
        ),
      },
      {
        id: 'date',
        accessorKey: 'date',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={() => column.toggleSorting()}
          >
            Date <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap">{formatDate(row.original.date)}</span>
        ),
        sortingFn: 'alphanumeric',
      },
      {
        id: 'time',
        header: () => <span className="text-xs font-medium text-muted-foreground">Time</span>,
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {formatTimeRange(row.original.start_time, row.original.end_time)}
          </span>
        ),
      },
      {
        id: 'program',
        accessorKey: 'program',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={() => column.toggleSorting()}
          >
            Program <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <span className="text-sm font-medium">{row.original.program}</span>
            <span className="text-xs text-muted-foreground ml-1">{row.original.cohort}</span>
          </div>
        ),
      },
      {
        id: 'session_type',
        accessorKey: 'session_type',
        header: () => <span className="text-xs font-medium text-muted-foreground">Type</span>,
        cell: ({ row }) => (
          <span className="text-sm">{row.original.session_type}</span>
        ),
      },
      {
        id: 'instructor',
        accessorKey: 'instructor',
        header: () => <span className="text-xs font-medium text-muted-foreground">Instructor</span>,
        cell: ({ row }) => (
          <span className={cn('text-sm', !row.original.instructor && 'text-orange-500 font-medium')}>
            {row.original.instructor ?? '⚠ Missing'}
          </span>
        ),
      },
      {
        id: 'ops_in_charge',
        header: () => <span className="text-xs font-medium text-muted-foreground">Ops Lead</span>,
        cell: ({ row }) => (
          <InlineSelect
            value={row.original.ops_in_charge ?? ''}
            options={opsMembers.map((m) => m.id)}
            onSave={(v) => onUpdate(row.original.id, { ops_in_charge: v || null })}
            disabled={!canEditOps}
            placeholder="Assign…"
            className={cn(
              'min-w-[100px]',
              !row.original.ops_in_charge && 'text-orange-500'
            )}
            colorMap={Object.fromEntries(opsMembers.map((m) => [m.id, '']))}
          />
        ),
      },
      {
        id: 'additional_ops',
        header: () => <span className="text-xs font-medium text-muted-foreground">Add. Ops</span>,
        cell: ({ row }) => (
          <OpsMultiSelect
            session={row.original}
            members={members}
            onAdd={(mid, mname) => onAddOpsM(row.original.id, mid, mname)}
            onRemove={(mid) => onRemoveOpsM(row.original.id, mid)}
            disabled={!canEditOps}
          />
        ),
      },
      {
        id: 'published',
        accessorKey: 'published',
        header: () => <span className="text-xs font-medium text-muted-foreground">Published</span>,
        cell: ({ row }) => (
          <InlineSelect
            value={row.original.published}
            options={['Yes', 'No']}
            onSave={(v) => onUpdate(row.original.id, { published: v as Published })}
            disabled={!canEditOps}
            colorMap={{ Yes: 'text-green-600 font-medium', No: 'text-muted-foreground' }}
          />
        ),
      },
      {
        id: 'deck_status',
        accessorKey: 'deck_status',
        header: () => <span className="text-xs font-medium text-muted-foreground">Deck</span>,
        cell: ({ row }) => (
          <InlineSelect
            value={row.original.deck_status}
            options={['Not Started', 'Pending', 'In Progress', 'Ready', 'Shared']}
            onSave={(v) => onUpdate(row.original.id, { deck_status: v as DeckStatus })}
            disabled={!canEditOps}
            colorMap={DECK_COLORS}
          />
        ),
      },
      {
        id: 'instructor_connect',
        accessorKey: 'instructor_connect',
        header: () => <span className="text-xs font-medium text-muted-foreground">Inst. Connect</span>,
        cell: ({ row }) => (
          <InlineSelect
            value={row.original.instructor_connect}
            options={['Pending', 'Scheduled', 'Completed']}
            onSave={(v) =>
              onUpdate(row.original.id, { instructor_connect: v as InstructorConnect })
            }
            disabled={!canEditOps}
            colorMap={IC_COLORS}
          />
        ),
      },
      {
        id: 'session_status',
        header: () => <span className="text-xs font-medium text-muted-foreground">Status</span>,
        cell: ({ row }) => <StatusCell session={row.original} />,
      },
    ],
    [canEditOps, members, opsMembers, onUpdate, onAddOpsM, onRemoveOpsM]
  )

  const table = useReactTable({
    data: filteredSessions,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const getRowClass = (session: Session) => {
    const status = getSessionStatus(session)
    if (status === 'Cancelled') return 'opacity-40'
    if (status === 'Awaiting Final Confirmation') return 'bg-yellow-50/70 text-muted-foreground'
    return ''
  }

  return (
    <div className="flex flex-col h-full">
      <TableToolbar
        search={globalFilter}
        onSearchChange={setGlobalFilter}
        groupOptions={groupOptions}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        filters={filterDefinitions}
        onFilterChange={(k, v) => setColumnFilters((p) => ({ ...p, [k]: v }))}
        extraActions={
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-yellow-200 border border-yellow-300" />
              Awaiting
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-white border border-gray-300" />
              Confirmed
            </span>
          </div>
        }
      />

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-background border-b">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left whitespace-nowrap border-r border-gray-200 last:border-r-0 bg-gray-50">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {(() => {
              const rows = table.getRowModel().rows
              const renderRow = (row: typeof rows[number]) => (
                <tr
                  key={row.id}
                  className={cn(
                    'group border-b hover:bg-accent/20 transition-colors',
                    getRowClass(row.original)
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-1.5 align-middle border-r border-gray-200 last:border-r-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
              if (!groupBy) return rows.map(renderRow)
              const groupKeyFor = (s: Session): string => {
                if (groupBy === 'day') return s.date ? getDayOfWeek(s.date) : '—'
                if (groupBy === 'date') return s.date ? formatDate(s.date) : '—'
                if (groupBy === 'status') return getSessionStatus(s)
                return String((s as any)[groupBy] ?? '—')
              }
              const groups = new Map<string, typeof rows>()
              for (const row of rows) {
                const k = groupKeyFor(row.original)
                if (!groups.has(k)) groups.set(k, [])
                groups.get(k)!.push(row)
              }
              const colCount = table.getAllColumns().length
              return Array.from(groups.entries()).map(([key, groupRows]) => {
                const collapsed = collapsedGroups.has(key)
                return (
                  <Fragment key={`grp-${key}`}>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <td colSpan={colCount} className="px-3 py-1.5">
                        <button
                          onClick={() =>
                            setCollapsedGroups((prev) => {
                              const next = new Set(prev)
                              next.has(key) ? next.delete(key) : next.add(key)
                              return next
                            })
                          }
                          className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
                        >
                          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevDown className="h-3 w-3" />}
                          {key}
                          <span className="text-gray-500 font-normal">({groupRows.length})</span>
                        </button>
                      </td>
                    </tr>
                    {!collapsed && groupRows.map(renderRow)}
                  </Fragment>
                )
              })
            })()}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-12 text-center text-muted-foreground text-sm"
                >
                  No confirmed or soft-confirmed sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
