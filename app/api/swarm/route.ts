import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { runSwarm, type SwarmStrategy } from "@/lib/swarm/orchestrator"
import { checkUsageLimits } from "@/lib/billing/usage"
import { canUseSwarm, getMaxSwarmAgents } from "@/lib/billing/usage"
import type { AgentSlug } from "@/lib/agents"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Check usage
  const usage = await checkUsageLimits(session.user.id)
  if (!usage.allowed) {
    return new Response(JSON.stringify({ error: "Usage limit reached" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Check swarm permissions
  if (!canUseSwarm(usage.tier)) {
    return new Response(JSON.stringify({ error: "Swarm mode requires Pro or Team plan" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { agents, prompt, strategy = "sequential" } = await req.json()

  if (!agents?.length || !prompt) {
    return new Response(JSON.stringify({ error: "Agents and prompt required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const maxAgents = getMaxSwarmAgents(usage.tier)
  if (agents.length > maxAgents) {
    return new Response(
      JSON.stringify({ error: `Max ${maxAgents} agents on your plan` }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }

  // Create swarm conversation
  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      agentId: agents[0],
      title: `Swarm: ${prompt.slice(0, 40)}...`,
      isSwarm: true,
      swarmAgents: JSON.stringify(agents),
    },
  })

  // Save user message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: "user", content: prompt },
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const swarm = runSwarm({
          agents: agents as AgentSlug[],
          prompt,
          strategy: strategy as SwarmStrategy,
        })

        for await (const chunk of swarm) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
        }

        // Increment usage
        await prisma.user.update({
          where: { id: session.user!.id },
          data: { messagesThisMonth: { increment: agents.length } },
        })

        controller.close()
      } catch (error) {
        console.error("Swarm error:", error)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", content: "Swarm failed" })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Conversation-Id": conversation.id,
    },
  })
}
