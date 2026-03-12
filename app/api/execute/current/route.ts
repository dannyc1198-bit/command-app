import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's plans
    const plans = await prisma.plan.findMany({
      where: {
        scheduledDate: {
          gte: today
        }
      },
      include: {
        investigation: true,
        execution: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Find current task (money move first, then first not_started)
    const moneyMove = plans.find(p =>
      p.investigation.category === 'money_move' &&
      p.execution?.status !== 'completed'
    )

    if (moneyMove) {
      return NextResponse.json(moneyMove)
    }

    const nextTask = plans.find(p =>
      p.execution?.status === 'not_started' ||
      p.execution?.status === 'in_progress'
    )

    return NextResponse.json(nextTask || null)
  } catch (error) {
    console.error('Error fetching current task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch current task' },
      { status: 500 }
    )
  }
}
