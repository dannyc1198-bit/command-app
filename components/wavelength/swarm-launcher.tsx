"use client"

import { useState } from "react"
import { AGENT_LIST } from "@/lib/agents/definitions"
import { AgentAvatar } from "./agent-avatar"
import type { AgentSlug } from "@/lib/agents"
import type { SwarmStrategy } from "@/lib/swarm/orchestrator"

interface SwarmLauncherProps {
  onLaunch: (agents: AgentSlug[], prompt: string, strategy: SwarmStrategy) => void
  maxAgents: number
  disabled?: boolean
}

export function SwarmLauncher({ onLaunch, maxAgents, disabled }: SwarmLauncherProps) {
  const [selectedAgents, setSelectedAgents] = useState<AgentSlug[]>([])
  const [prompt, setPrompt] = useState("")
  const [strategy, setStrategy] = useState<SwarmStrategy>("sequential")

  function toggleAgent(slug: AgentSlug) {
    setSelectedAgents((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < maxAgents
          ? [...prev, slug]
          : prev
    )
  }

  function handleLaunch() {
    if (selectedAgents.length < 2 || !prompt.trim()) return
    onLaunch(selectedAgents, prompt.trim(), strategy)
  }

  return (
    <div className="space-y-6">
      {/* Agent Selection */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-400">
          Select Agents ({selectedAgents.length}/{maxAgents})
        </h3>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {AGENT_LIST.map((agent) => {
            const selected = selectedAgents.includes(agent.slug)
            return (
              <button
                key={agent.slug}
                onClick={() => toggleAgent(agent.slug)}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-3 text-center transition-all ${
                  selected
                    ? "bg-white/10 border border-white/20"
                    : "border border-transparent hover:bg-white/5"
                }`}
              >
                <AgentAvatar name={agent.name} color={agent.color} emoji={agent.emoji} size="md" />
                <span className="text-xs text-gray-400">{agent.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Strategy */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Strategy</h3>
        <div className="flex gap-2">
          {(["sequential", "parallel"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                strategy === s
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              {s === "sequential" ? "Sequential" : "Parallel"}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {strategy === "sequential"
            ? "Agents respond one after another, building on previous answers"
            : "All agents respond simultaneously, then results are synthesized"}
        </p>
      </div>

      {/* Prompt */}
      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What should the swarm work on?"
          className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/50"
          rows={4}
        />
      </div>

      {/* Launch */}
      <button
        onClick={handleLaunch}
        disabled={disabled || selectedAgents.length < 2 || !prompt.trim()}
        className="w-full rounded-lg bg-gradient-to-r from-[#00d4ff] via-[#8b5cf6] to-[#d946ef] py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-30"
      >
        Launch Swarm ({selectedAgents.length} agents)
      </button>
    </div>
  )
}
