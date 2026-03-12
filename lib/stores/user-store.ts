"use client"

import { create } from "zustand"

interface UserInfo {
  id: string
  email: string
  name: string | null
  subscriptionTier: string
  messagesThisMonth: number
  usageResetDate: string
}

interface UserStore {
  user: UserInfo | null
  loading: boolean
  fetchUser: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    set({ loading: true })
    try {
      const res = await fetch("/api/user")
      if (res.ok) {
        const data = await res.json()
        set({ user: data })
      }
    } catch (e) {
      console.error("Failed to fetch user:", e)
    } finally {
      set({ loading: false })
    }
  },
}))
