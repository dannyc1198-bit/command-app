import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      where: {
        status: {
          in: ['captured', 'investigated']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        investigation: true
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rawInput, inputType = 'text' } = body

    if (!rawInput) {
      return NextResponse.json(
        { error: 'rawInput is required' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        rawInput,
        inputType,
        status: 'captured',
        currentStage: 'note'
      }
    })

    // Update today's session
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.niceSession.upsert({
      where: { date: today },
      update: {
        noteCount: { increment: 1 }
      },
      create: {
        date: today,
        noteCount: 1,
        currentStage: 'note'
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
