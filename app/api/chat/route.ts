import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAgent } from "@/lib/agents/get-agent"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { agentId, title } = await req.json()
  const agent = getAgent(agentId)
  if (!agent) {
    return NextResponse.json({ error: "Invalid agent" }, { status: 400 })
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      agentId,
      title: title || `Chat with ${agent.name}`,
      model: agent.defaultModel,
    },
  })

  return NextResponse.json(conversation, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      agentId: true,
      title: true,
      isSwarm: true,
      model: true,
      updatedAt: true,
    },
  })

  return NextResponse.json(conversations)
}
