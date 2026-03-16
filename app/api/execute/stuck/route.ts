import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, blockerDescription } = body

    if (!planId || !blockerDescription) {
      return NextResponse.json(
        { error: 'planId and blockerDescription are required' },
        { status: 400 }
      )
    }

    await prisma.execution.update({
      where: { planId },
      data: {
        status: 'blocked',
        blockerDescription
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking task as stuck:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}
