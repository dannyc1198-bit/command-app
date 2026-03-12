import { cn } from "@/lib/utils"

interface AgentAvatarProps {
  name: string
  color: string
  emoji?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-12 w-12 text-xl",
}

export function AgentAvatar({ name, color, emoji, size = "md", className }: AgentAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold",
        sizes[size],
        className
      )}
      style={{
        background: `${color}20`,
        color,
        boxShadow: `0 0 12px ${color}30`,
      }}
    >
      {emoji || name[0]}
    </div>
  )
}
