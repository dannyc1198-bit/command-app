"use client"

import { useSession, signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"

export function Topbar() {
  const { data: session } = useSession()

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-[#0a0a0f]/80 px-4">
      <div />
      <div className="flex items-center gap-3">
        {session?.user && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
                {session.user.name?.[0]?.toUpperCase() || <User className="h-3 w-3" />}
              </div>
              <span className="text-sm text-gray-400">{session.user.name || session.user.email}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
