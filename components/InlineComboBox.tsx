'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { tagClass } from '@/lib/colors'

interface Props {
  value: string
  options: string[]               // existing values across the dataset
  onSave: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  colored?: boolean               // render as colored chip
}

export default function InlineComboBox({
  value,
  options,
  onSave,
  disabled = false,
  placeholder = '—',
  className,
  colored = false,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [showMenu, setShowMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => setDraft(value), [value])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
      setShowMenu(true)
    }
  }, [editing])

  const filtered = useMemo(() => {
    const q = draft.toLowerCase().trim()
    const uniq = Array.from(new Set(options)).filter(Boolean).sort()
    if (!q) return uniq.slice(0, 12)
    return uniq.filter((o) => o.toLowerCase().includes(q)).slice(0, 12)
  }, [draft, options])

  const commit = (val?: string) => {
    const next = val ?? draft
    setEditing(false)
    setShowMenu(false)
    if (next !== value) onSave(next)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
    setShowMenu(false)
  }

  const display = (
    <span
      className={cn(
        'inline-block truncate rounded px-1.5 py-0.5 text-xs font-medium',
        colored && value ? tagClass(value) : 'text-sm',
        !value && 'text-muted-foreground',
        className
      )}
      title={disabled ? value : 'Click to edit'}
    >
      {value || placeholder}
    </span>
  )

  if (disabled) return display

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="block w-full text-left rounded -mx-1 px-1 hover:bg-accent/60 transition-colors"
      >
        {display}
      </button>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value)
          setShowMenu(true)
        }}
        onBlur={() => {
          setTimeout(() => commit(), 150)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') cancel()
        }}
        className={cn(
          'w-full rounded border border-primary bg-background px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary',
          className
        )}
        placeholder={placeholder}
      />
      {showMenu && filtered.length > 0 && (
        <div className="absolute left-0 top-full mt-1 z-[100] min-w-full w-max max-w-xs rounded-md border border-gray-300 bg-white shadow-lg py-1 max-h-56 overflow-auto">
          {filtered.map((opt) => (
            <button
              key={opt}
              onMouseDown={(e) => {
                e.preventDefault()
                commit(opt)
              }}
              className="w-full text-left px-2.5 py-1 text-xs hover:bg-blue-50 flex items-center gap-2"
            >
              <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', tagClass(opt))}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
