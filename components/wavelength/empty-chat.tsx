"use client"

import { AgentAvatar } from "./agent-avatar"
import type { AgentDefinition } from "@/lib/agents"

interface EmptyChatProps {
  agent: AgentDefinition
  onExampleClick: (prompt: string) => void
}

export function EmptyChat({ agent, onExampleClick }: EmptyChatProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl mb-4"
        style={{ background: `${agent.color}15`, boxShadow: `0 0 30px ${agent.color}20` }}
      >
        {agent.emoji}
      </div>
      <h2 className="text-xl font-bold text-white">{agent.name}</h2>
      <p className="mb-1 text-sm" style={{ color: agent.color }}>{agent.title}</p>
      <p className="mb-8 max-w-md text-center text-sm text-gray-500 leading-relaxed">
        {agent.personality}
      </p>

      <div className="grid w-full max-w-lg gap-2">
        {agent.examplePrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onExampleClick(prompt)}
            className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
