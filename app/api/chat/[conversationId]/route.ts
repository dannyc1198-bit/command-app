import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { conversationId } = await params

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(conversation)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { conversationId } = await params
  const body = await req.json()

  const conversation = await prisma.conversation.updateMany({
    where: { id: conversationId, userId: session.user.id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.model && { model: body.model }),
    },
  })

  return NextResponse.json(conversation)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { conversationId } = await params

  await prisma.conversation.deleteMany({
    where: { id: conversationId, userId: session.user.id },
  })

  return NextResponse.json({ ok: true })
}
