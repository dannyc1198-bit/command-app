"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Waves, Plus, Settings, Users, FileText,
  ChevronDown, ChevronRight, Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/stores/chat-store"
import { AGENTS, type AgentSlug } from "@/lib/agents/definitions"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { conversations, fetchConversations, deleteConversation } = useChatStore()
  const [niceOpen, setNiceOpen] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-[#0d0d14]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/5 px-4">
        <Waves className="h-6 w-6 text-[#00d4ff]" />
        <span className="text-lg font-bold text-white">Wavelength</span>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <Link
          href="/chat"
          className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Link>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 wl-scrollbar">
        <div className="mb-1 px-2 pt-2 text-xs font-medium uppercase text-gray-500">
          Chats
        </div>
        {conversations.map((conv) => {
          const agent = AGENTS[conv.agentId as AgentSlug]
          const isActive = pathname === `/chat/${conv.id}`
          return (
            <div key={conv.id} className="group relative">
              <Link
                href={`/chat/${conv.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="shrink-0 text-xs">{agent?.emoji || "🦞"}</span>
                <span className="truncate">{conv.title}</span>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  deleteConversation(conv.id)
                  if (isActive) router.push("/chat")
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden rounded p-1 text-gray-500 hover:bg-white/10 hover:text-red-400 group-hover:block"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Bottom nav */}
      <div className="border-t border-white/5 p-2 space-y-0.5">
        <Link
          href="/swarm"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname.startsWith("/swarm")
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:bg-white/5"
          )}
        >
          <Users className="h-4 w-4" />
          Swarm Mode
        </Link>

        <button
          onClick={() => setNiceOpen(!niceOpen)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 transition-colors"
        >
          <FileText className="h-4 w-4" />
          NICE Method
          {niceOpen ? (
            <ChevronDown className="ml-auto h-3 w-3" />
          ) : (
            <ChevronRight className="ml-auto h-3 w-3" />
          )}
        </button>
        {niceOpen && (
          <div className="ml-6 space-y-0.5">
            {["note", "investigate", "create", "execute"].map((stage) => (
              <Link
                key={stage}
                href={`/nice/${stage}`}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-xs transition-colors",
                  pathname.includes(stage)
                    ? "text-white bg-white/5"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                {stage.toUpperCase()}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/settings/billing"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname.startsWith("/settings")
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:bg-white/5"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
