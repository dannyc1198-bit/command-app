import { prisma } from "@/lib/prisma"
import { getPlan } from "./plans"

interface UsageCheckResult {
  allowed: boolean
  remaining: number
  limit: number
  used: number
  tier: string
}

export async function checkUsageLimits(userId: string): Promise<UsageCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      messagesThisMonth: true,
      usageResetDate: true,
    },
  })

  if (!user) {
    return { allowed: false, remaining: 0, limit: 0, used: 0, tier: "free" }
  }

  // Check if we need to reset monthly usage
  const now = new Date()
  const resetDate = new Date(user.usageResetDate)
  if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
    await prisma.user.update({
      where: { id: userId },
      data: { messagesThisMonth: 0, usageResetDate: now },
    })
    user.messagesThisMonth = 0
  }

  const plan = getPlan(user.subscriptionTier)
  const remaining = Math.max(0, plan.messagesPerMonth - user.messagesThisMonth)

  return {
    allowed: remaining > 0,
    remaining,
    limit: plan.messagesPerMonth,
    used: user.messagesThisMonth,
    tier: user.subscriptionTier,
  }
}

export function canUseSwarm(tier: string): boolean {
  return tier === "pro" || tier === "team"
}

export function getMaxSwarmAgents(tier: string): number {
  const plan = getPlan(tier)
  return plan.maxSwarmAgents
}
