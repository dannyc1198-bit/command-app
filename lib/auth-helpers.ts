import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getServerUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      subscriptionTier: true,
      messagesThisMonth: true,
      usageResetDate: true,
      stripeCustomerId: true,
      createdAt: true,
    },
  })
}

export type ServerUser = NonNullable<Awaited<ReturnType<typeof getServerUser>>>
