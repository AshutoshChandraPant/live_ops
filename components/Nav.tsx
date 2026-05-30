'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, Zap } from 'lucide-react'
import NotificationsBell from './NotificationsBell'
import type { Session } from '@/lib/types'

interface NavProps {
  sessions?: Session[]
}

const links = [
  { href: '/planning', label: 'Session Planning', roles: ['pm'] },
  { href: '/live-ops', label: 'Live Ops', roles: ['pm', 'ops', 'leadership'] },
  { href: '/team', label: 'Team', roles: ['pm', 'ops'] },
]

export default function Nav({ sessions = [] }: NavProps) {
  const pathname = usePathname()
  const { role, signOut } = useAuth()

  const visibleLinks = links.filter((l) => !role || l.roles.includes(role))

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-12 items-center px-4 gap-6">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Zap className="h-4 w-4 text-primary" />
          LiveOps
        </div>

        <nav className="flex items-center gap-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <NotificationsBell sessions={sessions} />
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
