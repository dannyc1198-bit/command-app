'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Investigation {
  id: string
  aiInterpretation: string
  itemType: string
  category: string
  priority: string
  energyRequired: string
  timeEstimateMinutes: number
}

interface NoteWithInvestigation {
  id: string
  rawInput: string
  investigation?: Investigation
}

export default function InvestigatePage() {
  const [notes, setNotes] = useState<NoteWithInvestigation[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const res = await fetch('/api/notes')
    const data = await res.json()
    setNotes(data)
  }

  async function processCurrent() {
    const note = notes[currentIndex]
    if (!note) return

    setProcessing(true)
    try {
      await fetch('/api/investigate/single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: note.id })
      })

      await fetchNotes()

      if (currentIndex < notes.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    } catch {
      toast.error('Failed to process note')
    } finally {
      setProcessing(false)
    }
  }

  async function processAll() {
    setProcessing(true)
    try {
      await fetch('/api/investigate/batch', {
        method: 'POST'
      })

      await fetchNotes()
      toast.success('All notes processed!')
    } catch {
      toast.error('Failed to process notes')
    } finally {
      setProcessing(false)
    }
  }

  const currentNote = notes[currentIndex]
  const uninvestigated = notes.filter(n => !n.investigation).length

  if (uninvestigated === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h1 className="text-4xl font-bold">All Caught Up!</h1>
        <p className="text-muted-foreground">All notes have been investigated</p>
        <Button onClick={() => router.push('/create')} className="gap-2">
          Move to CREATE
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">INVESTIGATE</h1>
        <p className="text-muted-foreground">Let me figure out what these mean</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Processing note {currentIndex + 1} of {notes.length}
        </span>
        <Button
          onClick={processAll}
          variant="outline"
          disabled={processing}
        >
          Auto-process remaining {uninvestigated}
        </Button>
      </div>

      {currentNote && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Your Note:
            </h3>
            <p className="text-lg">{currentNote.rawInput}</p>
          </div>

          {currentNote.investigation && (
            <div className="space-y-4 bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium">AI Investigation:</h3>

              <div className="space-y-2">
                <p>{currentNote.investigation.aiInterpretation}</p>

                <div className="flex gap-2 flex-wrap">
                  <Badge>{currentNote.investigation.itemType}</Badge>
                  <Badge variant="outline">{currentNote.investigation.category}</Badge>
                  <Badge variant="outline">{currentNote.investigation.priority}</Badge>
                  <Badge variant="outline">
                    {currentNote.investigation.timeEstimateMinutes} min
                  </Badge>
                  <Badge variant="outline">
                    {currentNote.investigation.energyRequired} energy
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={processCurrent}
              disabled={processing}
              className="flex-1"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process This Note'
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
