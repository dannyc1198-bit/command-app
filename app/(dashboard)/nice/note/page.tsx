"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Mic, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Note {
  id: string
  rawInput: string
  inputType: string
  createdAt: string
}

export default function NotePage() {
  const [input, setInput] = useState("")
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => { fetchNotes() }, [])

  async function fetchNotes() {
    const res = await fetch("/api/notes")
    const data = await res.json()
    setNotes(data)
  }

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: input, inputType: "text" }),
      })
      setInput("")
      fetchNotes()
      toast.success("Note captured")
    } catch {
      toast.error("Failed to save note")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">NOTE</h1>
        <p className="text-gray-400">Dump it here, I&apos;ll handle the rest</p>
      </div>
      <Card className="p-6 space-y-4 bg-white/5 border-white/10">
        <Textarea
          placeholder="Type whatever's on your mind..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit() }}
          className="min-h-[120px] text-lg bg-transparent border-white/10 text-white"
        />
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={loading || !input.trim()} className="flex-1">
            Dump It (Cmd + Enter)
          </Button>
          <Button variant="outline" size="icon"><Mic className="w-4 h-4" /></Button>
        </div>
      </Card>
      {notes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Today&apos;s Captures ({notes.length})</h2>
            <Button onClick={() => router.push("/nice/investigate")} className="gap-2">
              Move to INVESTIGATE <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {notes.slice(0, 5).map((note) => (
              <Card key={note.id} className="p-4 bg-white/5 border-white/10">
                <p className="text-sm text-gray-400">{note.rawInput}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
