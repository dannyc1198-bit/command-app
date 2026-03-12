"use client"

interface UsageMeterProps {
  used: number
  limit: number
  tier: string
}

export function UsageMeter({ used, limit, tier }: UsageMeterProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Messages this month</span>
        <span className={isAtLimit ? "text-red-400" : isNearLimit ? "text-amber-400" : "text-gray-300"}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all ${
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
                ? "bg-amber-500"
                : "bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6]"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 capitalize">{tier} plan</p>
    </div>
  )
}
