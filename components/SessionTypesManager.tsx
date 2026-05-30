'use client'

import { useState } from 'react'
import { Plus, X, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SessionType } from '@/lib/types'

interface Props {
  sessionTypes: SessionType[]
  onAdd: (name: string) => Promise<void>
  onToggle: (id: string, active: boolean) => Promise<void>
  onClose: () => void
}

export default function SessionTypesManager({ sessionTypes, onAdd, onToggle, onClose }: Props) {
  const [newType, setNewType] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!newType.trim()) return
    setSaving(true)
    try {
      await onAdd(newType.trim())
      setNewType('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border-b bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Session Types
        </span>
        <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {sessionTypes.map((t) => (
          <span
            key={t.id}
            className="inline-flex items-center gap-1 bg-background border rounded-md px-2 py-1 text-xs"
          >
            {t.name}
            <button
              onClick={() => onToggle(t.id, !t.active)}
              className="text-muted-foreground hover:text-foreground"
              title={t.active ? 'Deactivate' : 'Activate'}
            >
              {t.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1">
          <Input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="New type…"
            className="h-7 text-xs w-36"
          />
          <Button size="sm" variant="ghost" onClick={handleAdd} disabled={saving} className="h-7">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
