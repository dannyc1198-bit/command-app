import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'

export interface InvestigationResult {
  aiInterpretation: string
  itemType: 'task' | 'idea' | 'question' | 'reference' | 'problem'
  category: 'money_move' | 'outreach' | 'build' | 'admin' | 'boredom' | 'someday'
  priority: 'critical' | 'high' | 'medium' | 'low'
  complexity: 'simple' | 'moderate' | 'complex'
  energyRequired: 'high' | 'medium' | 'low'
  timeEstimateMinutes: number
  needsBreakdown: boolean
  extractedDueDate?: string
  contextNotes?: string
}

export async function investigateNote(rawInput: string): Promise<InvestigationResult> {
  const prompt = `You are an AI executive assistant helping an ADHD entrepreneur organize their thoughts.

Analyze this captured note and provide structured insights:

"${rawInput}"

Determine:
1. What type of item is this? (task, idea, question, reference, or problem)
2. If it's a task, what category? (money_move for revenue-generating, outreach for contacting people, build for creating things, admin for operational work, boredom for low-energy tasks, someday for future ideas)
3. Priority level (critical/high/medium/low)
4. Complexity (simple/moderate/complex)
5. Energy required (high/medium/low)
6. Time estimate in minutes
7. Does this need to be broken down into smaller steps?
8. Extract any mentioned due dates or timeframes
9. Add contextual insights about why this matters

Respond ONLY with valid JSON in this exact format:
{
  "aiInterpretation": "Clean summary of what this is",
  "itemType": "task|idea|question|reference|problem",
  "category": "money_move|outreach|build|admin|boredom|someday",
  "priority": "critical|high|medium|low",
  "complexity": "simple|moderate|complex",
  "energyRequired": "high|medium|low",
  "timeEstimateMinutes": <number>,
  "needsBreakdown": <boolean>,
  "extractedDueDate": "YYYY-MM-DD or null",
  "contextNotes": "Why this matters, patterns noticed, etc"
}`

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : ''

  // Parse JSON response - try direct parse first, then regex extraction
  try {
    return JSON.parse(responseText)
  } catch {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response: no JSON found')
    }
    return JSON.parse(jsonMatch[0])
  }
}
