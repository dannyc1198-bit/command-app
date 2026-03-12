import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { investigateNote } from '@/lib/ai/investigate'

export async function POST() {
  try {
    // Get all uninvestigated notes
    const notes = await prisma.note.findMany({
      where: {
        status: 'captured'
      }
    })

    const results = []

    // Process each note
    for (const note of notes) {
      try {
        const result = await investigateNote(note.rawInput)

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

        await prisma.note.update({
          where: { id: note.id },
          data: {
            status: 'investigated',
            currentStage: 'investigate'
          }
        })

        results.push({ note, investigation, result })
      } catch (error) {
        console.error(`Failed to investigate note ${note.id}:`, error)
      }
    }

    return NextResponse.json({
      processed: results.length,
      results
    })
  } catch (error) {
    console.error('Error batch investigating:', error)
    return NextResponse.json(
      { error: 'Failed to batch investigate' },
      { status: 500 }
    )
  }
}
