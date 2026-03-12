"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import { SwarmLauncher } from "@/components/wavelength/swarm-launcher"
import { SwarmView } from "@/components/wavelength/swarm-view"
import type { AgentSlug } from "@/lib/agents"
import type { SwarmStrategy } from "@/lib/swarm/orchestrator"

export default function SwarmPage() {
  const [userTier, setUserTier] = useState<string>("free")
  const [swarmState, setSwarmState] = useState<{
    agents: AgentSlug[]
    prompt: string
    strategy: SwarmStrategy
  } | null>(null)

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => setUserTier(data?.subscriptionTier || "free"))
  }, [])

  const isPaidUser = userTier === "pro" || userTier === "team"
  const maxAgents = userTier === "team" ? 5 : userTier === "pro" ? 3 : 0

  function handleLaunch(agents: AgentSlug[], prompt: string, strategy: SwarmStrategy) {
    setSwarmState({ agents, prompt, strategy })
  }

  if (!isPaidUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Users className="h-16 w-16 text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Swarm Mode</h1>
        <p className="text-gray-400 mb-6 max-w-md">
          Launch multiple AI agents to collaborate on complex problems. Each agent brings their unique expertise.
        </p>
        <a
          href="/settings/billing"
          className="rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Upgrade to Pro to unlock
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Swarm Mode</h1>
        <p className="mt-1 text-gray-400">
          Select 2-{maxAgents} agents to collaborate on your problem
        </p>
      </div>

      {!swarmState ? (
        <SwarmLauncher onLaunch={handleLaunch} maxAgents={maxAgents} />
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-sm text-gray-300">{swarmState.prompt}</p>
          </div>
          <SwarmView
            agents={swarmState.agents}
            prompt={swarmState.prompt}
            strategy={swarmState.strategy}
            onDone={() => {}}
          />
          <button
            onClick={() => setSwarmState(null)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:bg-white/5"
          >
            New Swarm
          </button>
        </div>
      )}
    </div>
  )
}
