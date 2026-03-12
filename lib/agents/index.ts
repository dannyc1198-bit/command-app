export type AgentSlug =
  | "clawdy" | "hunter" | "content" | "builder" | "vibration"

export type AgentSquad = "core" | "specialist"

export interface AgentDefinition {
  slug: AgentSlug
  name: string
  title: string
  squad: AgentSquad
  color: string
  gradient: string
  icon: string
  emoji: string
  personality: string
  systemPrompt: string
  defaultModel: string
  examplePrompts: string[]
}
