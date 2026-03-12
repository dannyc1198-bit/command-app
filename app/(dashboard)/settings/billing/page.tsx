"use client"

import { useState, useEffect } from "react"
import { PricingTable } from "@/components/wavelength/pricing-table"
import { UsageMeter } from "@/components/wavelength/usage-meter"

interface UserData {
  subscriptionTier: string
  messagesThisMonth: number
}

export default function BillingPage() {
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUser)
  }, [])

  async function handleManageBilling() {
    const res = await fetch("/api/stripe/portal", { method: "POST" })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  const limits: Record<string, number> = { free: 25, pro: 1000, team: 5000 }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
        <p className="mt-1 text-gray-400">Manage your subscription and monitor usage</p>
      </div>

      {user && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <UsageMeter
            used={user.messagesThisMonth}
            limit={limits[user.subscriptionTier] || 25}
            tier={user.subscriptionTier}
          />

          {user.subscriptionTier !== "free" && (
            <button
              onClick={handleManageBilling}
              className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
            >
              Manage Billing
            </button>
          )}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Plans</h2>
        <PricingTable currentTier={user?.subscriptionTier} />
      </div>
    </div>
  )
}
