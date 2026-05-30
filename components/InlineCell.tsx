'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface InlineCellProps {
  value: string
  onSave: (value: string) => void
  disabled?: boolean
  placeholder?: string
  type?: 'text' | 'date' | 'time' | 'url'
  className?: string
}

export default function InlineCell({
  value,
  onSave,
  disabled = false,
  placeholder = '—',
  type = 'text',
  className,
}: InlineCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = () => {
    setEditing(false)
    if (draft !== value) onSave(draft)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (disabled) {
    return (
      <span className={cn('block truncate text-sm text-muted-foreground', className)}>
        {value || placeholder}
      </span>
    )
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') cancel()
        }}
        className={cn(
          'w-full rounded border border-primary bg-background px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary',
          className
        )}
      />
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={cn(
        'block truncate text-sm cursor-text rounded px-1 -mx-1 hover:bg-accent/60 transition-colors',
        !value && 'text-muted-foreground',
        className
      )}
      title="Click to edit"
    >
      {value || placeholder}
    </span>
  )
}
