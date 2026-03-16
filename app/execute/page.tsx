'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface CurrentTask {
  id: string
  title: string
  description: string
  contextNotes?: string
  investigation: {
    category: string
    timeEstimateMinutes: number
    energyRequired: string
  }
  execution: {
    id: string
    status: string
    timeSpentMinutes: number
  }
}

export default function ExecutePage() {
  const [task, setTask] = useState<CurrentTask | null>(null)
  const [outcomeNotes, setOutcomeNotes] = useState('')
  const [timeSpent, setTimeSpent] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCurrentTask()
  }, [])

  async function fetchCurrentTask() {
    const res = await fetch('/api/execute/current')
    const data = await res.json()
    setTask(data)
  }

  async function completeTask() {
    if (!task) return

    setLoading(true)
    try {
      await fetch('/api/execute/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: task.id,
          outcomeNotes,
          timeSpentMinutes: timeSpent
        })
      })

      toast.success('Task completed!')

      setOutcomeNotes('')
      setTimeSpent(0)
      fetchCurrentTask()
    } catch {
      toast.error('Failed to complete task')
    } finally {
      setLoading(false)
    }
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">All Done!</h1>
        <p className="text-muted-foreground">
          No tasks left for today. Great work!
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">EXECUTE</h1>
        <p className="text-muted-foreground">Do The Work</p>
      </div>

      <Card className="p-8 space-y-6">
        <div>
          <Badge className="mb-4">
            {task.investigation.category === 'money_move' ? 'Money Move' : 'Focus Task'}
          </Badge>
          <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
          <p className="text-muted-foreground">{task.description}</p>
        </div>

        {task.contextNotes && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">{task.contextNotes}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Badge variant="outline">
            {task.investigation.timeEstimateMinutes} min
          </Badge>
          <Badge variant="outline">
            {task.investigation.energyRequired} energy
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Outcome notes (optional):
          </label>
          <Textarea
            placeholder="What happened? Any wins or learnings?"
            value={outcomeNotes}
            onChange={(e) => setOutcomeNotes(e.target.value)}
          />
        </div>

        <Button
          onClick={completeTask}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark Complete
        </Button>
      </Card>
    </div>
  )
}
