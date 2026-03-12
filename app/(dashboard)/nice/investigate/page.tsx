"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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

  useEffect(() => { fetchNotes() }, [])

  async function fetchNotes() {
    const res = await fetch("/api/notes")
    const data = await res.json()
    setNotes(data)
  }

  async function processCurrent() {
    const note = notes[currentIndex]
    if (!note) return
    setProcessing(true)
    try {
      await fetch("/api/investigate/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: note.id }),
      })
      await fetchNotes()
      if (currentIndex < notes.length - 1) setCurrentIndex(currentIndex + 1)
    } catch {
      toast.error("Failed to process note")
    } finally {
      setProcessing(false)
    }
  }

  async function processAll() {
    setProcessing(true)
    try {
      await fetch("/api/investigate/batch", { method: "POST" })
      await fetchNotes()
      toast.success("All notes processed!")
    } catch {
      toast.error("Failed to process notes")
    } finally {
      setProcessing(false)
    }
  }

  const currentNote = notes[currentIndex]
  const uninvestigated = notes.filter((n) => !n.investigation).length

  if (uninvestigated === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-8 text-center">
        <h1 className="text-4xl font-bold text-white">All Caught Up!</h1>
        <p className="text-gray-400">All notes have been investigated</p>
        <Button onClick={() => router.push("/nice/create")} className="gap-2">
          Move to CREATE <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">INVESTIGATE</h1>
        <p className="text-gray-400">Let me figure out what these mean</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Processing note {currentIndex + 1} of {notes.length}</span>
        <Button onClick={processAll} variant="outline" disabled={processing}>
          Auto-process remaining {uninvestigated}
        </Button>
      </div>
      {currentNote && (
        <Card className="p-6 space-y-6 bg-white/5 border-white/10">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Your Note:</h3>
            <p className="text-lg text-white">{currentNote.rawInput}</p>
          </div>
          {currentNote.investigation && (
            <div className="space-y-4 bg-white/5 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-white">AI Investigation:</h3>
              <p className="text-gray-300">{currentNote.investigation.aiInterpretation}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge>{currentNote.investigation.itemType}</Badge>
                <Badge variant="outline">{currentNote.investigation.category}</Badge>
                <Badge variant="outline">{currentNote.investigation.priority}</Badge>
                <Badge variant="outline">{currentNote.investigation.timeEstimateMinutes} min</Badge>
              </div>
            </div>
          )}
          <Button onClick={processCurrent} disabled={processing} className="w-full">
            {processing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>) : "Process This Note"}
          </Button>
        </Card>
      )}
    </div>
  )
}
