'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import InlineCell from '@/components/InlineCell'
import InlineSelect from '@/components/InlineSelect'
import { cn } from '@/lib/utils'
import type { TeamMember, UserRole, Session } from '@/lib/types'

interface Props {
  members: TeamMember[]
  sessions: Session[]
  onUpdate: (id: string, data: Partial<Omit<TeamMember, 'id' | 'created_at'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  canEdit: boolean
}

const ROLE_LABELS: Record<UserRole, string> = {
  pm: 'Program Manager',
  ops: 'Operations',
  leadership: 'Leadership',
}

function WorkloadBar({ assigned, capacity }: { assigned: number; capacity: number }) {
  const pct = Math.min(100, Math.round((assigned / Math.max(1, capacity)) * 100))
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-orange-400' : 'bg-green-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">
        {assigned}/{capacity}
      </span>
    </div>
  )
}

export default function TeamTable({
  members,
  sessions,
  onUpdate,
  onDelete,
  canEdit,
}: Props) {
  const [addingRow, setAddingRow] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('ops')
  const [newAvail, setNewAvail] = useState('')
  const [newCap, setNewCap] = useState('10')

  const weekSessions = sessions.filter((s) => s.final_confirmed || s.soft_confirmed)

  const assignedCount = (memberId: string) => {
    return weekSessions.filter(
      (s) =>
        s.ops_in_charge === memberId ||
        (s.additional_ops ?? []).some((a) => a.id === memberId)
    ).length
  }

  const columns = useMemo<ColumnDef<TeamMember>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: () => <span className="text-xs font-medium text-muted-foreground">Name</span>,
        cell: ({ row }) => (
          <InlineCell
            value={row.original.name}
            onSave={(v) => onUpdate(row.original.id, { name: v })}
            disabled={!canEdit}
            placeholder="Name"
            className="font-medium"
          />
        ),
      },
      {
        id: 'role',
        accessorKey: 'role',
        header: () => <span className="text-xs font-medium text-muted-foreground">Role</span>,
        cell: ({ row }) => (
          <InlineSelect
            value={row.original.role}
            options={['pm', 'ops', 'leadership']}
            onSave={(v) => onUpdate(row.original.id, { role: v as UserRole })}
            disabled={!canEdit}
          />
        ),
      },
      {
        id: 'availability',
        accessorKey: 'availability',
        header: () => <span className="text-xs font-medium text-muted-foreground">Availability</span>,
        cell: ({ row }) => (
          <InlineCell
            value={row.original.availability ?? ''}
            onSave={(v) => onUpdate(row.original.id, { availability: v || null })}
            disabled={!canEdit}
            placeholder="e.g. Mon–Fri"
          />
        ),
      },
      {
        id: 'weekly_capacity',
        accessorKey: 'weekly_capacity',
        header: () => <span className="text-xs font-medium text-muted-foreground">Weekly Cap.</span>,
        cell: ({ row }) => (
          <InlineCell
            value={String(row.original.weekly_capacity)}
            onSave={(v) =>
              onUpdate(row.original.id, { weekly_capacity: parseInt(v) || row.original.weekly_capacity })
            }
            disabled={!canEdit}
            placeholder="10"
            className="w-12"
          />
        ),
      },
      {
        id: 'assigned',
        header: () => <span className="text-xs font-medium text-muted-foreground">Workload</span>,
        cell: ({ row }) => {
          const assigned = assignedCount(row.original.id)
          return (
            <WorkloadBar
              assigned={assigned}
              capacity={row.original.weekly_capacity}
            />
          )
        },
      },
      {
        id: 'sessions_count',
        header: () => <span className="text-xs font-medium text-muted-foreground">Sessions</span>,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {assignedCount(row.original.id)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => null,
        cell: ({ row }) =>
          canEdit ? (
            <button
              onClick={() => onDelete(row.original.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null,
      },
    ],
    [canEdit, onUpdate, onDelete, assignedCount]
  )

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 border-b">
        <span className="text-sm text-muted-foreground">{members.length} members</span>
        <div className="ml-auto">
          {canEdit && !addingRow && (
            <Button size="sm" onClick={() => setAddingRow(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-background border-b">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group border-b hover:bg-accent/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {addingRow && (
              <tr className="border-b bg-blue-50/40">
                <td className="px-3 py-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Name *"
                    className="h-7 text-sm"
                    autoFocus
                  />
                </td>
                <td className="px-3 py-2">
                  <InlineSelect
                    value={newRole}
                    options={['pm', 'ops', 'leadership']}
                    onSave={(v) => setNewRole(v as UserRole)}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={newAvail}
                    onChange={(e) => setNewAvail(e.target.value)}
                    placeholder="Mon–Fri"
                    className="h-7 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    value={newCap}
                    onChange={(e) => setNewCap(e.target.value)}
                    placeholder="10"
                    className="h-7 text-sm w-16"
                  />
                </td>
                <td className="px-3 py-2" colSpan={3}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                    User must sign up first — paste their user ID or invite via Supabase.
                  </div>
                </td>
              </tr>
            )}

            {members.length === 0 && !addingRow && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-12 text-center text-muted-foreground text-sm">
                  No team members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
