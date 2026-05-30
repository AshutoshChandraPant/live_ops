'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type InlineSelectOption = string | { value: string; label: string }

interface InlineSelectProps {
  value: string
  options: InlineSelectOption[]
  onSave: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  colorMap?: Record<string, string>
}

const normalize = (o: InlineSelectOption) =>
  typeof o === 'string' ? { value: o, label: o } : o

export default function InlineSelect({
  value,
  options,
  onSave,
  disabled = false,
  placeholder = 'Select…',
  className,
  colorMap,
}: InlineSelectProps) {
  const normalized = options.map(normalize)
  const label = normalized.find((o) => o.value === value)?.label ?? value

  if (disabled) {
    const color = colorMap?.[value] ?? ''
    return (
      <span className={cn('text-sm text-muted-foreground', color, className)}>
        {label || placeholder}
      </span>
    )
  }

  const color = colorMap?.[value] ?? ''

  return (
    <Select value={value} onValueChange={onSave}>
      <SelectTrigger
        className={cn(
          'h-7 border-0 bg-transparent px-1 text-sm shadow-none focus:ring-1 hover:bg-accent/60',
          color,
          className
        )}
      >
        <SelectValue placeholder={placeholder}>{label || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {normalized.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
