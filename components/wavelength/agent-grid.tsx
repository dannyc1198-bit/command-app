"use client"

import { useRouter } from "next/navigation"
import { AgentCard } from "./agent-card"
import { useChatStore } from "@/lib/stores/chat-store"
import { CORE_AGENTS, SPECIALIST_AGENTS } from "@/lib/agents/definitions"
import { Waves, Zap } from "lucide-react"

export function AgentGrid() {
  const router = useRouter()
  const { createConversation } = useChatStore()

  async function handleSelect(slug: string) {
    const id = await createConversation(slug)
    router.push(`/chat/${id}`)
  }

  const mainAgent = CORE_AGENTS[0]

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Waves className="h-5 w-5 text-[#00d4ff]" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
            Wavelength Command
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">
          What are we building today?
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Choose your agent. Each one brings a different superpower to the table.
        </p>
      </div>

      {/* Main Agent — Clawdy */}
      {mainAgent && (
        <button
          onClick={() => handleSelect(mainAgent.slug)}
          className="group relative w-full rounded-2xl border border-[#00d4ff]/20 bg-gradient-to-br from-[#00d4ff]/[0.06] to-[#8b5cf6]/[0.04] p-6 text-left transition-all hover:border-[#00d4ff]/40 hover:shadow-[0_0_40px_rgba(0,212,255,0.12)]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00d4ff]/10 text-3xl shadow-[0_0_20px_rgba(0,212,255,0.2)]">
              {mainAgent.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{mainAgent.name}</h2>
                <span className="flex items-center gap-1 rounded-full bg-[#00d4ff]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#00d4ff]">
                  <Zap className="h-2.5 w-2.5" />
                  Main AI
                </span>
              </div>
              <p className="text-sm text-gray-400">{mainAgent.title}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {mainAgent.personality}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {mainAgent.examplePrompts.map((prompt) => (
              <span
                key={prompt}
                className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400"
              >
                {prompt}
              </span>
            ))}
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
            style={{ boxShadow: "inset 0 0 40px rgba(0,212,255,0.06)" }}
          />
        </button>
      )}

      {/* Specialist Agents */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-600">
            Specialists
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {SPECIALIST_AGENTS.map((agent) => (
            <AgentCard
              key={agent.slug}
              agent={agent}
              onClick={() => handleSelect(agent.slug)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
