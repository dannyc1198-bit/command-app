import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { investigateNote } from '@/lib/ai/investigate'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { noteId } = body

    if (!noteId) {
      return NextResponse.json(
        { error: 'noteId is required' },
        { status: 400 }
      )
    }

    // Get the note
    const note = await prisma.note.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    // Investigate with AI
    const result = await investigateNote(note.rawInput)

    // Save investigation
    const investigation = await prisma.investigation.create({
      data: {
        noteId: note.id,
        aiInterpretation: result.aiInterpretation,
        itemType: result.itemType,
        category: result.category,
        priority: result.priority,
        complexity: result.complexity,
        energyRequired: result.energyRequired,
        timeEstimateMinutes: result.timeEstimateMinutes,
        needsBreakdown: result.needsBreakdown
      }
    })

    // Update note status
    await prisma.note.update({
      where: { id: note.id },
      data: {
        status: 'investigated',
        currentStage: 'investigate'
      }
    })

    return NextResponse.json({
      note,
      investigation,
      result
    })
  } catch (error) {
    console.error('Error investigating note:', error)
    return NextResponse.json(
      { error: 'Failed to investigate note' },
      { status: 500 }
    )
  }
}
