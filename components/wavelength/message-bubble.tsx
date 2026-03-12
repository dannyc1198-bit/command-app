import { AgentAvatar } from "./agent-avatar"
import { MarkdownRenderer } from "./markdown-renderer"
import { AGENTS, type AgentSlug } from "@/lib/agents/definitions"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  agentId?: string | null
}

export function MessageBubble({ role, content, agentId }: MessageBubbleProps) {
  const agent = agentId ? AGENTS[agentId as AgentSlug] : null

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#00d4ff]/10 border border-[#00d4ff]/20 px-4 py-3 text-sm text-white">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {agent ? (
        <AgentAvatar
          name={agent.name}
          color={agent.color}
          emoji={agent.emoji}
          size="sm"
          className="mt-1"
        />
      ) : (
        <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-white/10" />
      )}
      <div className="min-w-0 flex-1 text-sm text-gray-200">
        {agent && (
          <span className="mb-1 block text-xs font-medium" style={{ color: agent.color }}>
            {agent.emoji} {agent.name}
          </span>
        )}
        <MarkdownRenderer content={content} />
      </div>
    </div>
  )
}
