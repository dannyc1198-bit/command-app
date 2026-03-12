import { prisma } from '@/lib/prisma'
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'

export async function generateDailyPlan(date: Date, energyLevel: string = 'medium') {
  // Get all investigated items that haven't been planned
  const investigations = await prisma.investigation.findMany({
    where: {
      note: {
        status: 'investigated'
      }
    },
    include: {
      note: true
    }
  })

  if (investigations.length === 0) {
    return null
  }

  // Prepare context for AI
  const investigationsSummary = investigations.map(inv => ({
    id: inv.id,
    interpretation: inv.aiInterpretation,
    type: inv.itemType,
    category: inv.category,
    priority: inv.priority,
    energy: inv.energyRequired,
    time: inv.timeEstimateMinutes
  }))

  const prompt = `You are planning tomorrow's work for an ADHD entrepreneur. Their energy level is: ${energyLevel}

Available tasks to choose from:
${JSON.stringify(investigationsSummary, null, 2)}

Rules:
1. Select ONE "money_move" task (highest revenue impact)
2. Select 3 additional tasks for focus (diverse categories, realistic time total)
3. Suggest 2-3 "boredom tasks" for low-energy moments
4. Total planned time should not exceed 4 hours (realistic for ADHD)
5. Match task energy requirements to user's stated energy level

Respond ONLY with valid JSON:
{
  "moneyMoveId": "investigation_id",
  "top3Ids": ["id1", "id2", "id3"],
  "boredomTaskIds": ["id4", "id5"],
  "reasoning": "Brief explanation of selections",
  "totalEstimatedMinutes": <number>
}`

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : ''

  let plan
  try {
    plan = JSON.parse(responseText)
  } catch {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI plan: no JSON found')
    }
    plan = JSON.parse(jsonMatch[0])
  }

  // Create Plan records
  const allTaskIds = [
    plan.moneyMoveId,
    ...plan.top3Ids,
    ...plan.boredomTaskIds
  ].filter(Boolean)

  for (const invId of allTaskIds) {
    const investigation = investigations.find(i => i.id === invId)
    if (!investigation) continue

    const createdPlan = await prisma.plan.create({
      data: {
        investigationId: invId,
        title: investigation.aiInterpretation,
        description: investigation.note.rawInput,
        planType: 'daily',
        scheduledDate: date,
        contextNotes: plan.reasoning
      }
    })

    // Update note status
    await prisma.note.update({
      where: { id: investigation.noteId },
      data: {
        status: 'planned',
        currentStage: 'create'
      }
    })

    // Create execution record
    await prisma.execution.create({
      data: {
        planId: createdPlan.id,
        status: 'not_started'
      }
    })
  }

  return plan
}
