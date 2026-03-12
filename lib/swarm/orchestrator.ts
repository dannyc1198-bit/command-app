import { openrouter } from "@/lib/openrouter"
import { getAgentOrThrow } from "@/lib/agents/get-agent"
import type { AgentSlug } from "@/lib/agents"

export type SwarmStrategy = "sequential" | "parallel" | "debate"

export interface SwarmConfig {
  agents: AgentSlug[]
  prompt: string
  strategy: SwarmStrategy
}

export interface SwarmChunk {
  type: "agent_start" | "agent_token" | "agent_done" | "synthesis_start" | "synthesis_token" | "done"
  agentSlug?: string
  agentName?: string
  content?: string
}

export async function* runSwarm(config: SwarmConfig): AsyncGenerator<SwarmChunk> {
  const { agents, prompt, strategy } = config
  const agentResponses: Record<string, string> = {}

  if (strategy === "parallel") {
    // Run all agents in parallel, yield results as they come
    const promises = agents.map(async (slug) => {
      const agent = getAgentOrThrow(slug)
      const response = await openrouter.chat.completions.create({
        model: agent.defaultModel,
        messages: [
          { role: "system", content: agent.systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
      })
      return {
        slug,
        name: agent.name,
        content: response.choices[0]?.message?.content || "",
      }
    })

    for (const slug of agents) {
      yield { type: "agent_start", agentSlug: slug, agentName: getAgentOrThrow(slug).name }
    }

    const results = await Promise.all(promises)
    for (const result of results) {
      agentResponses[result.slug] = result.content
      yield { type: "agent_done", agentSlug: result.slug, agentName: result.name, content: result.content }
    }
  } else {
    // Sequential: run one after another, streaming each
    for (const slug of agents) {
      const agent = getAgentOrThrow(slug)
      yield { type: "agent_start", agentSlug: slug, agentName: agent.name }

      const previousContext = Object.entries(agentResponses)
        .map(([s, r]) => `[${getAgentOrThrow(s as AgentSlug).name}]: ${r}`)
        .join("\n\n")

      const contextPrompt = previousContext
        ? `Previous agent responses:\n${previousContext}\n\nUser's question: ${prompt}`
        : prompt

      const stream = await openrouter.chat.completions.create({
        model: agent.defaultModel,
        messages: [
          { role: "system", content: agent.systemPrompt },
          { role: "user", content: contextPrompt },
        ],
        stream: true,
        max_tokens: 2048,
      })

      let fullContent = ""
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ""
        if (delta) {
          fullContent += delta
          yield { type: "agent_token", agentSlug: slug, agentName: agent.name, content: delta }
        }
      }

      agentResponses[slug] = fullContent
      yield { type: "agent_done", agentSlug: slug, agentName: agent.name }
    }
  }

  // Synthesis step
  yield { type: "synthesis_start" }

  const synthesisPrompt = Object.entries(agentResponses)
    .map(([slug, response]) => `## ${getAgentOrThrow(slug as AgentSlug).name} (${getAgentOrThrow(slug as AgentSlug).title})\n${response}`)
    .join("\n\n---\n\n")

  const synthesisStream = await openrouter.chat.completions.create({
    model: "anthropic/claude-sonnet-4-6",
    messages: [
      {
        role: "system",
        content: "You are a synthesis agent. Multiple AI specialists have provided their perspectives. Create a unified, actionable summary that combines the best insights from each agent. Use clear headers and formatting.",
      },
      {
        role: "user",
        content: `Original question: ${prompt}\n\nAgent responses:\n\n${synthesisPrompt}\n\nProvide a synthesized response combining the best insights.`,
      },
    ],
    stream: true,
    max_tokens: 3000,
  })

  for await (const chunk of synthesisStream) {
    const delta = chunk.choices[0]?.delta?.content || ""
    if (delta) {
      yield { type: "synthesis_token", content: delta }
    }
  }

  yield { type: "done" }
}
