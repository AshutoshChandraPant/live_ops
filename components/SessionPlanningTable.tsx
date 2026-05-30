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
import { Plus, Trash2, ArrowUpDown, ExternalLink, ChevronRight, ChevronDown as ChevDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import InlineCell from '@/components/InlineCell'
import InlineSelect from '@/components/InlineSelect'
import InlineComboBox from '@/components/InlineComboBox'
import TableToolbar, { type GroupOption, type ColumnFilter } from '@/components/TableToolbar'
import { tagClass } from '@/lib/colors'
import { cn, formatDate, formatTimeRange, getSessionStatus, getDayOfWeek } from '@/lib/utils'
import type { Session, SessionInsert, SessionUpdate, SessionType } from '@/lib/types'

interface Props {
  sessions: Session[]
  sessionTypes: SessionType[]
  onAdd: (data: SessionInsert) => Promise<void>
  onUpdate: (id: string, data: SessionUpdate) => Promise<void>
  onDelete: (id: string) => Promise<void>
  canEdit: boolean
}

const EMPTY_ROW: SessionInsert = {
  program: '',
  cohort: '',
  session_type: 'Core Session',
  date: '',
  start_time: '',
  end_time: '',
}

function StatusBadge({ session }: { session: Session }) {
  const status = getSessionStatus(session)
  const variantMap: Record<string, 'draft' | 'soft' | 'confirmed' | 'cancelled'> = {
    Draft: 'draft',
    'Awaiting Final Confirmation': 'soft',
    Confirmed: 'confirmed',
    Cancelled: 'cancelled',
  }
  return <Badge variant={variantMap[status] ?? 'draft'}>{status}</Badge>
}

export default function SessionPlanningTable({
  sessions,
  sessionTypes,
  onAdd,
  onUpdate,
  onDelete,
  canEdit,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [addingRow, setAddingRow] = useState(false)
  const [newRow, setNewRow] = useState<SessionInsert>(EMPTY_ROW)
  const [saving, setSaving] = useState(false)
  const [groupBy, setGroupBy] = useState<string | null>('program')
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const filterDefinitions: ColumnFilter[] = useMemo(() => {
    const uniq = (key: keyof Session) =>
      Array.from(new Set(sessions.map((s) => String(s[key] ?? '')).filter(Boolean))).sort()
    return [
      { key: 'program', label: 'Program', options: uniq('program'), selected: columnFilters['program'] ?? [] },
      { key: 'session_type', label: 'Type', options: uniq('session_type'), selected: columnFilters['session_type'] ?? [] },
      {
        key: 'status',
        label: 'Status',
        options: ['Draft', 'Awaiting Final Confirmation', 'Confirmed', 'Cancelled'],
        selected: columnFilters['status'] ?? [],
      },
    ]
  }, [sessions, columnFilters])

  const groupOptions: GroupOption[] = [
    { key: 'date', label: 'Date' },
    { key: 'day', label: 'Day' },
    { key: 'program', label: 'Program' },
    { key: 'session_type', label: 'Type' },
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

  const typeOptions = sessionTypes.map((t) => t.name)
  const programOptions = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.program).filter(Boolean))).sort(),
    [sessions]
  )
  const cohortOptions = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.cohort).filter(Boolean))).sort(),
    [sessions]
  )

  const handleAdd = async () => {
    if (!newRow.program || !newRow.date || !newRow.start_time || !newRow.end_time) return
    setSaving(true)
    try {
      await onAdd(newRow)
      setNewRow(EMPTY_ROW)
      setAddingRow(false)
    } finally {
      setSaving(false)
    }
  }

  const update = (id: string, data: SessionUpdate) => onUpdate(id, data)

  const columns = useMemo<ColumnDef<Session>[]>(
    () => [
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
          <InlineComboBox
            value={row.original.program}
            options={programOptions}
            onSave={(v) => update(row.original.id, { program: v })}
            disabled={!canEdit}
            placeholder="Program"
            colored
          />
        ),
      },
      {
        id: 'cohort',
        accessorKey: 'cohort',
        header: () => <span className="text-xs font-medium text-muted-foreground">Cohort</span>,
        cell: ({ row }) => (
          <InlineComboBox
            value={row.original.cohort}
            options={cohortOptions}
            onSave={(v) => update(row.original.id, { cohort: v })}
            disabled={!canEdit}
            placeholder="Cohort"
            colored
          />
        ),
      },
      {
        id: 'session_type',
        accessorKey: 'session_type',
        header: () => <span className="text-xs font-medium text-muted-foreground">Type</span>,
        cell: ({ row }) => (
          <InlineSelect
            value={row.original.session_type}
            options={typeOptions}
            onSave={(v) => update(row.original.id, { session_type: v })}
            disabled={!canEdit}
          />
        ),
      },
      {
        id: 'day',
        header: () => <span className="text-xs font-medium text-muted-foreground">Day</span>,
        cell: ({ row }) =>
          row.original.date ? (
            <span className="text-sm font-medium text-muted-foreground">
              {getDayOfWeek(row.original.date)}
            </span>
          ) : null,
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
          <InlineCell
            value={row.original.date}
            onSave={(v) => update(row.original.id, { date: v })}
            disabled={!canEdit}
            type="date"
            placeholder="Date"
            className="min-w-[110px]"
          />
        ),
        sortingFn: 'alphanumeric',
      },
      {
        id: 'time',
        header: () => <span className="text-xs font-medium text-muted-foreground">Time</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 min-w-[130px]">
            <InlineCell
              value={row.original.start_time}
              onSave={(v) => update(row.original.id, { start_time: v })}
              disabled={!canEdit}
              type="time"
              className="w-16"
            />
            <span className="text-muted-foreground text-xs">–</span>
            <InlineCell
              value={row.original.end_time}
              onSave={(v) => update(row.original.id, { end_time: v })}
              disabled={!canEdit}
              type="time"
              className="w-16"
            />
          </div>
        ),
      },
      {
        id: 'instructor',
        accessorKey: 'instructor',
        header: () => <span className="text-xs font-medium text-muted-foreground">Instructor</span>,
        cell: ({ row }) => (
          <InlineCell
            value={row.original.instructor ?? ''}
            onSave={(v) => update(row.original.id, { instructor: v || null })}
            disabled={!canEdit}
            placeholder="Instructor"
          />
        ),
      },
      {
        id: 'meeting_link',
        accessorKey: 'meeting_link',
        header: () => <span className="text-xs font-medium text-muted-foreground">Link</span>,
        cell: ({ row }) => {
          const link = row.original.meeting_link
          return (
            <div className="flex items-center gap-1">
              <InlineCell
                value={link ?? ''}
                onSave={(v) => update(row.original.id, { meeting_link: v || null })}
                disabled={!canEdit}
                type="url"
                placeholder="Meeting link"
                className="max-w-[120px]"
              />
              {link && (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </a>
              )}
            </div>
          )
        },
      },
      {
        id: 'soft_confirmed',
        accessorKey: 'soft_confirmed',
        header: () => <span className="text-xs font-medium text-muted-foreground">SC</span>,
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.soft_confirmed}
            onCheckedChange={(v) =>
              update(row.original.id, {
                soft_confirmed: !!v,
                ...(v ? {} : { final_confirmed: false }),
              })
            }
            disabled={!canEdit || row.original.cancelled}
          />
        ),
      },
      {
        id: 'final_confirmed',
        accessorKey: 'final_confirmed',
        header: () => <span className="text-xs font-medium text-muted-foreground">FC</span>,
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.final_confirmed}
            onCheckedChange={(v) =>
              update(row.original.id, { final_confirmed: !!v })
            }
            disabled={!canEdit || !row.original.soft_confirmed || row.original.cancelled}
          />
        ),
      },
      {
        id: 'notes',
        accessorKey: 'notes',
        header: () => <span className="text-xs font-medium text-muted-foreground">Notes</span>,
        cell: ({ row }) => (
          <InlineCell
            value={row.original.notes ?? ''}
            onSave={(v) => update(row.original.id, { notes: v || null })}
            disabled={!canEdit}
            placeholder="Notes"
            className="max-w-[160px]"
          />
        ),
      },
      {
        id: 'status',
        header: () => <span className="text-xs font-medium text-muted-foreground">Status</span>,
        cell: ({ row }) => <StatusBadge session={row.original} />,
      },
      {
        id: 'actions',
        header: () => null,
        cell: ({ row }) =>
          canEdit ? (
            <button
              onClick={() => onDelete(row.original.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              title="Delete session"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null,
      },
    ],
    [canEdit, typeOptions, programOptions, cohortOptions, update, onDelete]
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
    if (status === 'Cancelled') return 'opacity-50 line-through'
    if (status === 'Draft') return 'text-muted-foreground'
    if (status === 'Awaiting Final Confirmation') return 'bg-yellow-50/60'
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
          canEdit && !addingRow ? (
            <Button size="sm" onClick={() => setAddingRow(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Session
            </Button>
          ) : null
        }
      />

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-background border-b">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left font-medium whitespace-nowrap border-r border-gray-200 last:border-r-0 bg-gray-50"
                  >
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
              if (!groupBy) {
                return rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'group border-b hover:bg-accent/30 transition-colors',
                      getRowClass(row.original)
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-1.5 align-middle border-r border-gray-200 last:border-r-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              }
              // Grouped mode
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
                    {!collapsed &&
                      groupRows.map((row) => (
                        <tr
                          key={row.id}
                          className={cn(
                            'group border-b hover:bg-accent/30 transition-colors',
                            getRowClass(row.original)
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-3 py-1.5 align-middle border-r border-gray-200 last:border-r-0">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </Fragment>
                )
              })
            })()}

            {/* Inline add row */}
            {addingRow && (
              <tr className="border-b bg-blue-50/40">
                <td className="px-3 py-1.5">
                  <Input
                    value={newRow.program}
                    onChange={(e) => setNewRow((r) => ({ ...r, program: e.target.value }))}
                    placeholder="Program *"
                    className="h-7 text-sm"
                    autoFocus
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    value={newRow.cohort}
                    onChange={(e) => setNewRow((r) => ({ ...r, cohort: e.target.value }))}
                    placeholder="Cohort *"
                    className="h-7 text-sm"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <InlineSelect
                    value={newRow.session_type}
                    options={typeOptions}
                    onSave={(v) => setNewRow((r) => ({ ...r, session_type: v }))}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="date"
                    value={newRow.date}
                    onChange={(e) => setNewRow((r) => ({ ...r, date: e.target.value }))}
                    className="h-7 text-sm w-36"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-1">
                    <Input
                      type="time"
                      value={newRow.start_time}
                      onChange={(e) => setNewRow((r) => ({ ...r, start_time: e.target.value }))}
                      className="h-7 text-sm w-20"
                    />
                    <span className="text-muted-foreground text-xs">–</span>
                    <Input
                      type="time"
                      value={newRow.end_time}
                      onChange={(e) => setNewRow((r) => ({ ...r, end_time: e.target.value }))}
                      className="h-7 text-sm w-20"
                    />
                  </div>
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    value={newRow.instructor ?? ''}
                    onChange={(e) => setNewRow((r) => ({ ...r, instructor: e.target.value }))}
                    placeholder="Instructor"
                    className="h-7 text-sm"
                  />
                </td>
                <td className="px-3 py-1.5" colSpan={6}>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleAdd} disabled={saving} className="h-7">
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAddingRow(false)
                        setNewRow(EMPTY_ROW)
                      }}
                      className="h-7"
                    >
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {table.getRowModel().rows.length === 0 && !addingRow && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-12 text-center text-muted-foreground text-sm"
                >
                  No sessions yet.{' '}
                  {canEdit && (
                    <button
                      className="underline hover:text-foreground"
                      onClick={() => setAddingRow(true)}
                    >
                      Add the first one.
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
