'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface InlineSelectProps {
  value: string
  options: string[]
  onSave: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  colorMap?: Record<string, string>
}

export default function InlineSelect({
  value,
  options,
  onSave,
  disabled = false,
  placeholder = 'Select…',
  className,
  colorMap,
}: InlineSelectProps) {
  if (disabled) {
    const color = colorMap?.[value] ?? ''
    return (
      <span className={cn('text-sm text-muted-foreground', color, className)}>
        {value || placeholder}
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
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
