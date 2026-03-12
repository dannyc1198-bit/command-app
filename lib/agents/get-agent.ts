import { AGENTS, AGENT_LIST } from "./definitions"
import type { AgentSlug, AgentDefinition } from "./index"

export function getAgent(slug: string): AgentDefinition | undefined {
  return AGENTS[slug as AgentSlug]
}

export function getAgentOrThrow(slug: string): AgentDefinition {
  const agent = getAgent(slug)
  if (!agent) throw new Error(`Unknown agent: ${slug}`)
  return agent
}

export function getAgentsBySquad(squad: "core" | "specialist"): AgentDefinition[] {
  return AGENT_LIST.filter((a) => a.squad === squad)
}

export function getAllAgents(): AgentDefinition[] {
  return AGENT_LIST
}

export function getDefaultAgent(): AgentDefinition {
  return AGENTS.clawdy
}
