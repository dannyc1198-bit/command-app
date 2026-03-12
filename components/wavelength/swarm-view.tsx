"use client"

import { useState, useEffect, useRef } from "react"
import { AgentAvatar } from "./agent-avatar"
import { MarkdownRenderer } from "./markdown-renderer"
import { StreamingIndicator } from "./streaming-indicator"
import { AGENTS, type AgentSlug } from "@/lib/agents/definitions"
import type { SwarmChunk } from "@/lib/swarm/orchestrator"

interface AgentResponse {
  slug: string
  name: string
  content: string
  done: boolean
}

interface SwarmViewProps {
  agents: AgentSlug[]
  prompt: string
  strategy: string
  onDone?: () => void
}

export function SwarmView({ agents, prompt, strategy, onDone }: SwarmViewProps) {
  const [agentResponses, setAgentResponses] = useState<Record<string, AgentResponse>>({})
  const [synthesis, setSynthesis] = useState("")
  const [phase, setPhase] = useState<"agents" | "synthesis" | "done">("agents")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const res = await fetch("/api/swarm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agents, prompt, strategy }),
      })

      if (!res.ok || !res.body) return

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done || cancelled) break

        const text = decoder.decode(value)
        const lines = text.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const chunk: SwarmChunk = JSON.parse(line.slice(6))

            if (chunk.type === "agent_start" && chunk.agentSlug) {
              setAgentResponses((prev) => ({
                ...prev,
                [chunk.agentSlug!]: {
                  slug: chunk.agentSlug!,
                  name: chunk.agentName || "",
                  content: "",
                  done: false,
                },
              }))
            } else if (chunk.type === "agent_token" && chunk.agentSlug) {
              setAgentResponses((prev) => ({
                ...prev,
                [chunk.agentSlug!]: {
                  ...prev[chunk.agentSlug!],
                  content: (prev[chunk.agentSlug!]?.content || "") + (chunk.content || ""),
                },
              }))
            } else if (chunk.type === "agent_done" && chunk.agentSlug) {
              setAgentResponses((prev) => ({
                ...prev,
                [chunk.agentSlug!]: {
                  ...prev[chunk.agentSlug!],
                  content: chunk.content || prev[chunk.agentSlug!]?.content || "",
                  done: true,
                },
              }))
            } else if (chunk.type === "synthesis_start") {
              setPhase("synthesis")
            } else if (chunk.type === "synthesis_token") {
              setSynthesis((prev) => prev + (chunk.content || ""))
            } else if (chunk.type === "done") {
              setPhase("done")
              onDone?.()
            }
          } catch {
            // skip
          }
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [agents, prompt, strategy, onDone])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [agentResponses, synthesis])

  return (
    <div className="space-y-6">
      {/* Agent Responses */}
      {Object.values(agentResponses).map((resp) => {
        const agent = AGENTS[resp.slug as AgentSlug]
        return (
          <div
            key={resp.slug}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
            style={{ borderColor: `${agent?.color}20` }}
          >
            <div className="mb-3 flex items-center gap-2">
              <AgentAvatar name={agent?.name || resp.name} color={agent?.color || "#00d4ff"} emoji={agent?.emoji} size="sm" />
              <span className="text-sm font-medium" style={{ color: agent?.color }}>
                {agent?.name || resp.name}
              </span>
              <span className="text-xs text-gray-500">{agent?.title}</span>
              {!resp.done && <StreamingIndicator />}
            </div>
            <div className="text-sm text-gray-200">
              {resp.content ? <MarkdownRenderer content={resp.content} /> : <StreamingIndicator />}
            </div>
          </div>
        )
      })}

      {/* Synthesis */}
      {(phase === "synthesis" || phase === "done") && (
        <div className="rounded-xl border border-[#00d4ff]/20 bg-[#00d4ff]/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-[10px] font-bold text-white">
              S
            </div>
            <span className="text-sm font-medium text-[#00d4ff]">Synthesis</span>
            {phase === "synthesis" && <StreamingIndicator />}
          </div>
          <div className="text-sm text-gray-200">
            {synthesis ? <MarkdownRenderer content={synthesis} /> : <StreamingIndicator />}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
