import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, outcomeNotes, timeSpentMinutes } = body

    await prisma.execution.update({
      where: {
        planId
      },
      data: {
        status: 'completed',
        completedAt: new Date(),
        timeSpentMinutes: timeSpentMinutes || 0,
        outcomeNotes
      }
    })

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { investigation: true }
    })

    if (plan) {
      await prisma.note.update({
        where: {
          id: plan.investigation.noteId
        },
        data: {
          status: 'done',
          currentStage: 'execute'
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}
