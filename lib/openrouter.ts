import OpenAI from "openai"

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Wavelength AI",
  },
})

export const MODEL_MAP = {
  "anthropic/claude-sonnet-4-6": "Claude Sonnet 4.6",
  "openai/gpt-4o": "GPT-4o",
  "google/gemini-pro-1.5": "Gemini Pro",
} as const

export type ModelId = keyof typeof MODEL_MAP
