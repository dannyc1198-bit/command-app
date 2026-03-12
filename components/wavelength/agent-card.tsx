"use client"

import type { AgentDefinition } from "@/lib/agents"

interface AgentCardProps {
  agent: AgentDefinition
  onClick: () => void
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-5 text-left transition-all hover:border-white/10 hover:bg-white/[0.04]"
      style={{
        boxShadow: `inset 0 1px 0 0 ${agent.color}10`,
      }}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"
        style={{
          boxShadow: `0 0 20px ${agent.color}15, inset 0 0 20px ${agent.color}05`,
        }}
      />
      <div className="relative flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
          style={{ background: `${agent.color}15` }}
        >
          {agent.emoji}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{agent.name}</h3>
          <p className="text-sm text-gray-400">{agent.title}</p>
        </div>
      </div>
      <p className="relative text-xs text-gray-500 line-clamp-2 leading-relaxed">{agent.personality}</p>
    </button>
  )
}
