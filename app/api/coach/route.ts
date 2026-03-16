import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionType = 'general', sessionId } = body

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      )
    }

    // Load existing conversation if sessionId provided
    let conversationHistory: { role: string; content: string }[] = []
    if (sessionId) {
      const session = await prisma.coachingSession.findUnique({
        where: { id: sessionId }
      })
      if (session) {
        conversationHistory = JSON.parse(session.conversation)
      }
    }

    // Add user message
    conversationHistory.push({ role: 'user', content: message })

    const systemPrompt = `You are an AI executive coach for an ADHD entrepreneur. Your role is to:
- Help them stay focused and motivated
- Celebrate wins, no matter how small
- Help them work through blockers without judgment
- Keep responses concise and actionable (ADHD-friendly)
- Use encouraging, direct language
- When they're stuck, help break tasks into smaller steps
- Remind them of their patterns and past wins when relevant

Session type: ${sessionType}
Keep responses under 200 words unless they ask for more detail.`

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    // Add assistant response to history
    conversationHistory.push({ role: 'assistant', content: assistantMessage })

    // Save or update coaching session
    let session
    if (sessionId) {
      session = await prisma.coachingSession.update({
        where: { id: sessionId },
        data: {
          conversation: JSON.stringify(conversationHistory)
        }
      })
    } else {
      session = await prisma.coachingSession.create({
        data: {
          sessionType,
          conversation: JSON.stringify(conversationHistory)
        }
      })
    }

    return NextResponse.json({
      sessionId: session.id,
      message: assistantMessage
    })
  } catch (error) {
    console.error('Error in coaching session:', error)
    return NextResponse.json(
      { error: 'Failed to process coaching message' },
      { status: 500 }
    )
  }
}
