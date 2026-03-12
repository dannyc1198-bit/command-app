"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { PLANS } from "@/lib/billing/plans"

interface PricingTableProps {
  currentTier?: string
  onSelectPlan?: (planId: string) => void
}

export function PricingTable({ currentTier, onSelectPlan }: PricingTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const plans = Object.values(PLANS)

  async function handleSelect(planId: string) {
    if (planId === "free" || planId === currentTier) return
    setLoading(planId)
    try {
      if (onSelectPlan) {
        onSelectPlan(planId)
      } else {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        })
        const data = await res.json()
        if (data.url) window.location.href = data.url
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentTier
        const isPopular = plan.id === "pro"

        return (
          <div
            key={plan.id}
            className={`relative rounded-xl border p-6 ${
              isPopular
                ? "border-[#00d4ff]/30 bg-[#00d4ff]/5"
                : "border-white/5 bg-white/[0.02]"
            }`}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] px-3 py-0.5 text-xs font-medium text-white">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-gray-400">/month</span>
                )}
              </div>
            </div>

            <ul className="mb-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00d4ff]" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan.id)}
              disabled={isCurrent || loading === plan.id || plan.id === "free"}
              className={`w-full rounded-lg py-2.5 text-sm font-medium transition-all ${
                isCurrent
                  ? "border border-white/10 bg-white/5 text-gray-400 cursor-default"
                  : isPopular
                    ? "bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90"
                    : plan.id === "free"
                      ? "border border-white/10 bg-white/5 text-gray-400 cursor-default"
                      : "border border-white/10 text-white hover:bg-white/5"
              } disabled:opacity-50`}
            >
              {isCurrent ? "Current Plan" : loading === plan.id ? "Loading..." : plan.id === "free" ? "Free" : `Upgrade to ${plan.name}`}
            </button>
          </div>
        )
      })}
    </div>
  )
}
