import { computeMetrics } from '@/lib/utils'
import type { Session } from '@/lib/types'

export default function MetricsBar({ sessions }: { sessions: Session[] }) {
  const m = computeMetrics(sessions)

  const stats = [
    { label: 'Today', value: m.today },
    { label: 'This Week', value: m.thisWeek },
    { label: 'Pending Confirmation', value: m.pendingConfirmations, warn: m.pendingConfirmations > 0 },
    { label: 'Unassigned', value: m.unassigned, warn: m.unassigned > 0 },
  ]

  return (
    <div className="flex gap-4 px-4 py-2 border-b bg-muted/30">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{s.label}:</span>
          <span
            className={
              s.warn
                ? 'font-semibold text-orange-600'
                : 'font-semibold text-foreground'
            }
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}
