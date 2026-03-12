export interface PlanDefinition {
  id: string
  name: string
  price: number
  messagesPerMonth: number
  maxSwarmAgents: number
  features: string[]
  stripePriceId?: string
}

export const PLANS: Record<string, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    messagesPerMonth: 25,
    maxSwarmAgents: 0,
    features: [
      "25 messages per month",
      "All 5 AI agents",
      "Conversation history",
      "Markdown rendering",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 19,
    messagesPerMonth: 1000,
    maxSwarmAgents: 3,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "1,000 messages per month",
      "All 5 AI agents",
      "Swarm Mode (up to 3 agents)",
      "Model selection",
      "Priority support",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    price: 49,
    messagesPerMonth: 5000,
    maxSwarmAgents: 5,
    stripePriceId: process.env.STRIPE_TEAM_PRICE_ID,
    features: [
      "5,000 messages per month",
      "All 5 AI agents",
      "Swarm Mode (up to 5 agents)",
      "Model selection",
      "Team collaboration",
      "Priority support",
    ],
  },
}

export function getPlan(tier: string): PlanDefinition {
  return PLANS[tier] || PLANS.free
}
