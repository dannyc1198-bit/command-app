"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./message-bubble"
import { ChatInput } from "./chat-input"
import { EmptyChat } from "./empty-chat"
import { StreamingIndicator } from "./streaming-indicator"
import { useChatStore } from "@/lib/stores/chat-store"
import { AGENTS, type AgentSlug } from "@/lib/agents/definitions"

interface ChatViewProps {
  conversationId: string
}

export function ChatView({ conversationId }: ChatViewProps) {
  const {
    currentConversation,
    fetchConversation,
    sendMessage,
    isStreaming,
    streamingContent,
  } = useChatStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversation(conversationId)
  }, [conversationId, fetchConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages, streamingContent])

  if (!currentConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00d4ff] border-t-transparent" />
      </div>
    )
  }

  const agent = AGENTS[currentConversation.agentId as AgentSlug]
  const messages = currentConversation.messages

  function handleSend(content: string) {
    sendMessage(conversationId, content)
  }

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 && !isStreaming ? (
        <EmptyChat agent={agent} onExampleClick={handleSend} />
      ) : (
        <div className="flex-1 overflow-y-auto wl-scrollbar">
          <div className="mx-auto max-w-3xl space-y-4 p-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role as "user" | "assistant"}
                content={msg.content}
                agentId={msg.agentId || currentConversation.agentId}
              />
            ))}

            {isStreaming && streamingContent && (
              <MessageBubble
                role="assistant"
                content={streamingContent}
                agentId={currentConversation.agentId}
              />
            )}

            {isStreaming && !streamingContent && (
              <div className="flex gap-3">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
                  style={{ background: `${agent?.color}20` }}
                >
                  {agent?.emoji || "🦞"}
                </div>
                <StreamingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
        placeholder={`Message ${agent?.name || "Clawdy"}...`}
      />
    </div>
  )
}
