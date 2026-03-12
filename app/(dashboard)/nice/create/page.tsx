"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PlanItem {
  id: string
  title: string
  investigation: {
    category: string
    priority: string
    energyRequired: string
    timeEstimateMinutes: number
  }
}

export default function CreatePage() {
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [loading, setLoading] = useState(false)
  const [energyLevel, setEnergyLevel] = useState("medium")
  const router = useRouter()

  useEffect(() => { fetchPlans() }, [])

  async function fetchPlans() {
    const res = await fetch("/api/plans/daily")
    const data = await res.json()
    setPlans(data)
  }

  async function generatePlan() {
    setLoading(true)
    try {
      await fetch("/api/plans/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString(), energyLevel }),
      })
      await fetchPlans()
      toast.success("Plan created!")
    } catch {
      toast.error("Failed to create plan")
    } finally {
      setLoading(false)
    }
  }

  const moneyMove = plans.find((p) => p.investigation.category === "money_move")
  const focusTasks = plans.filter((p) => p.investigation.category !== "money_move" && p.investigation.category !== "boredom").slice(0, 3)
  const boredomTasks = plans.filter((p) => p.investigation.category === "boredom")

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">CREATE</h1>
        <p className="text-gray-400">Here&apos;s what we&apos;re doing with these</p>
      </div>
      {plans.length === 0 ? (
        <Card className="p-8 text-center space-y-4 bg-white/5 border-white/10">
          <p className="text-gray-400">No plan yet. Let&apos;s create one!</p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">What&apos;s your energy level today?</p>
            <div className="flex gap-2 justify-center">
              {["low", "medium", "high"].map((level) => (
                <Button key={level} variant={energyLevel === level ? "default" : "outline"} onClick={() => setEnergyLevel(level)}>
                  {level}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={generatePlan} disabled={loading}>{loading ? "Generating..." : "Generate Daily Plan"}</Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {moneyMove && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Money Move (Required)</h2>
              <Card className="p-4 bg-white/5 border-white/10">
                <p className="font-medium text-white">{moneyMove.title}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{moneyMove.investigation.timeEstimateMinutes} min</Badge>
                  <Badge variant="outline">{moneyMove.investigation.energyRequired} energy</Badge>
                </div>
              </Card>
            </div>
          )}
          {focusTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Focus Tasks</h2>
              <div className="space-y-2">
                {focusTasks.map((task, i) => (
                  <Card key={task.id} className="p-4 bg-white/5 border-white/10">
                    <p className="font-medium text-white">{i + 1}. {task.title}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{task.investigation.timeEstimateMinutes} min</Badge>
                      <Badge variant="outline">{task.investigation.category}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {boredomTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Boredom Tasks</h2>
              {boredomTasks.map((task) => (
                <Card key={task.id} className="p-3 text-sm text-gray-400 bg-white/5 border-white/10">{task.title}</Card>
              ))}
            </div>
          )}
          <Button onClick={() => router.push("/nice/execute")} className="w-full gap-2">
            Move to EXECUTE <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
