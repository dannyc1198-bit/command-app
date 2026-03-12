"use client"

import { useRouter } from "next/navigation"
import { CORE_AGENTS, SPECIALIST_AGENTS } from "@/lib/agents/definitions"
import { Waves, Zap } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="text-center space-y-4">
          <Waves className="mx-auto h-12 w-12 text-[#00d4ff]" />
          <h1 className="text-3xl font-bold text-white">Welcome to Wavelength AI</h1>
          <p className="text-gray-400">
            Meet your team of 5 AI specialists. Each has a unique personality, expertise, and AI model.
          </p>
        </div>

        {/* Main Agent */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Zap className="h-4 w-4 text-[#00d4ff]" />
            Command Intelligence
          </h2>
          <div className="grid gap-3">
            {CORE_AGENTS.map((agent) => (
              <div
                key={agent.slug}
                className="flex items-center gap-4 rounded-xl border border-[#00d4ff]/20 bg-[#00d4ff]/[0.04] p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `${agent.color}15` }}
                >
                  {agent.emoji}
                </div>
                <div>
                  <p className="text-base font-medium text-white">{agent.name}</p>
                  <p className="text-sm text-gray-400">{agent.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialists */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Specialists</h2>
          <div className="grid grid-cols-2 gap-3">
            {SPECIALIST_AGENTS.map((agent) => (
              <div
                key={agent.slug}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                  style={{ background: `${agent.color}15` }}
                >
                  {agent.emoji}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{agent.name}</p>
                  <p className="text-xs text-gray-400">{agent.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/chat")}
            className="rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] px-8 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Start Chatting
          </button>
        </div>
      </div>
    </div>
  )
}
