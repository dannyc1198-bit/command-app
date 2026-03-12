"use client"

import { create } from "zustand"

interface ConversationSummary {
  id: string
  agentId: string
  title: string
  isSwarm: boolean
  model: string | null
  updatedAt: string
}

interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system"
  content: string
  agentId?: string | null
  model?: string | null
  createdAt: string
}

interface ConversationDetail extends ConversationSummary {
  messages: Message[]
}

interface ChatStore {
  conversations: ConversationSummary[]
  currentConversation: ConversationDetail | null
  isStreaming: boolean
  streamingContent: string

  fetchConversations: () => Promise<void>
  fetchConversation: (id: string) => Promise<void>
  createConversation: (agentId: string) => Promise<string>
  deleteConversation: (id: string) => Promise<void>
  sendMessage: (conversationId: string, content: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  isStreaming: false,
  streamingContent: "",

  fetchConversations: async () => {
    try {
      const res = await fetch("/api/chat")
      if (res.ok) {
        const data = await res.json()
        set({ conversations: data })
      }
    } catch (e) {
      console.error("Failed to fetch conversations:", e)
    }
  },

  fetchConversation: async (id: string) => {
    try {
      const res = await fetch(`/api/chat/${id}`)
      if (res.ok) {
        const data = await res.json()
        set({ currentConversation: data })
      }
    } catch (e) {
      console.error("Failed to fetch conversation:", e)
    }
  },

  createConversation: async (agentId: string) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    })
    const data = await res.json()
    await get().fetchConversations()
    return data.id
  },

  deleteConversation: async (id: string) => {
    await fetch(`/api/chat/${id}`, { method: "DELETE" })
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      currentConversation:
        state.currentConversation?.id === id ? null : state.currentConversation,
    }))
  },

  sendMessage: async (conversationId: string, content: string) => {
    const state = get()

    // Optimistic add user message
    if (state.currentConversation?.id === conversationId) {
      set({
        currentConversation: {
          ...state.currentConversation,
          messages: [
            ...state.currentConversation.messages,
            {
              id: `temp-${Date.now()}`,
              conversationId,
              role: "user",
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        },
        isStreaming: true,
        streamingContent: "",
      })
    }

    try {
      const res = await fetch(`/api/chat/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          const lines = text.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullContent += parsed.content
                  set({ streamingContent: fullContent })
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
      }

      // Refresh conversation to get server-side messages
      await get().fetchConversation(conversationId)
      await get().fetchConversations()
    } catch (e) {
      console.error("Send message error:", e)
    } finally {
      set({ isStreaming: false, streamingContent: "" })
    }
  },
}))
