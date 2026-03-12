import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { openrouter } from "@/lib/openrouter"
import { getAgentOrThrow } from "@/lib/agents/get-agent"
import { checkUsageLimits } from "@/lib/billing/usage"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Check usage limits
  const usage = await checkUsageLimits(session.user.id)
  if (!usage.allowed) {
    return new Response(
      JSON.stringify({ error: "Usage limit reached", usage }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    )
  }

  const { conversationId } = await params
  const { content } = await req.json()

  if (!content?.trim()) {
    return new Response("Message content required", { status: 400 })
  }

  // Verify conversation ownership
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })

  if (!conversation) {
    return new Response("Not found", { status: 404 })
  }

  const agent = getAgentOrThrow(conversation.agentId)
  const model = conversation.model || agent.defaultModel

  // Save user message
  await prisma.message.create({
    data: {
      conversationId,
      role: "user",
      content,
    },
  })

  // Auto-title on first message
  if (conversation.messages.length === 0) {
    const titleSnippet = content.slice(0, 50) + (content.length > 50 ? "..." : "")
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title: titleSnippet },
    })
  }

  // Build message history for the AI
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: agent.systemPrompt },
    ...conversation.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content },
  ]

  // Stream response via SSE
  const stream = await openrouter.chat.completions.create({
    model,
    messages,
    stream: true,
    max_tokens: 4096,
  })

  let fullResponse = ""

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || ""
          if (delta) {
            fullResponse += delta
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`))
          }
        }

        // Save assistant message after streaming completes
        await prisma.message.create({
          data: {
            conversationId,
            role: "assistant",
            content: fullResponse,
            agentId: agent.slug,
            model,
          },
        })

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        })

        // Increment user's message count
        await prisma.user.update({
          where: { id: session.user!.id },
          data: { messagesThisMonth: { increment: 1 } },
        })

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
        controller.close()
      } catch (error) {
        console.error("Streaming error:", error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
