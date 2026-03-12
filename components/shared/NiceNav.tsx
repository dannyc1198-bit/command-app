'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FileText, Search, Sparkles, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const stages = [
  {
    name: 'NOTE',
    path: '/note',
    icon: FileText,
    description: 'Capture'
  },
  {
    name: 'INVESTIGATE',
    path: '/investigate',
    icon: Search,
    description: 'Process'
  },
  {
    name: 'CREATE',
    path: '/create',
    icon: Sparkles,
    description: 'Plan'
  },
  {
    name: 'EXECUTE',
    path: '/execute',
    icon: Target,
    description: 'Do'
  },
]

export default function NiceNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Command</h1>
          </div>

          <div className="flex items-center gap-1">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              const isActive = pathname === stage.path

              return (
                <div key={stage.path} className="flex items-center">
                  <Link
                    href={stage.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{stage.name}</span>
                      <span className="text-xs opacity-70">{stage.description}</span>
                    </div>
                  </Link>

                  {index < stages.length - 1 && (
                    <span className="mx-2 text-muted-foreground">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
