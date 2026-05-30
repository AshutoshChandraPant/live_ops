'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { buildNotifications } from '@/lib/utils'
import type { Session } from '@/lib/types'
import { Button } from './ui/button'

const iconMap: Record<string, string> = {
  missing_instructor: '👤',
  missing_moderator: '🎙️',
  pending_confirmation: '⏳',
  deck_pending: '📄',
  starting_soon: '🔔',
}

export default function NotificationsBell({ sessions }: { sessions: Session[] }) {
  const [open, setOpen] = useState(false)
  const notifications = buildNotifications(sessions)
  const count = notifications.length

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        className="relative"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground font-bold">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border bg-background shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-sm font-semibold">Notifications</span>
              <span className="text-xs text-muted-foreground">{count} alerts</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                  All clear
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-3 px-4 py-2.5 border-b last:border-0 hover:bg-accent/50"
                  >
                    <span className="text-base leading-none mt-0.5">
                      {iconMap[n.type]}
                    </span>
                    <span className="text-xs text-foreground leading-relaxed">
                      {n.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
