# Wavelength AI — MVP TODO (Prioritized)

> Generated 2026-02-10 after full codebase audit

## 🔴 CRITICAL — App Won't Run Without These

1. **Create `lib/stores/chat-store.ts`** — Zustand store for conversations (sidebar imports it, app crashes without it)
2. **Create `lib/agents/definitions.ts`** — Agent roster with slugs, names, colors, system prompts, model assignments (sidebar imports `AGENTS` + `AgentSlug`)
3. **Create `app/(dashboard)/chat/page.tsx`** — Main chat page (new conversation selector / agent picker)
4. **Create `app/(dashboard)/chat/[conversationId]/page.tsx`** — Chat conversation view with message history + input

## 🟠 HIGH — Core Chat MVP

5. **Create chat API routes:**
   - `api/chat/route.ts` — Create conversation
   - `api/chat/[conversationId]/route.ts` — GET messages, POST new message
   - `api/chat/[conversationId]/stream/route.ts` — SSE/streaming responses via OpenRouter
6. **Create `lib/openrouter.ts`** — OpenRouter client (multi-model: Claude, GPT-4o, Gemini) to replace direct SDK calls
7. **Wire auth to API routes** — All chat/note APIs are currently unprotected (no `auth()` checks, no userId filtering)
8. **Create `app/api/auth/[...nextauth]/route.ts`** — Verify it exports handlers correctly (file exists but not checked)

## 🟡 MEDIUM — Feature Completion

9. **Create `app/(dashboard)/swarm/page.tsx`** — Swarm mode: multi-agent collaboration UI
10. **Create `app/(dashboard)/swarm/[swarmId]/page.tsx`** — Active swarm session view
11. **Create `app/(dashboard)/settings/billing/page.tsx`** — Subscription management + Stripe checkout
12. **Create `app/(marketing)/pricing/page.tsx`** — Pricing tiers (free/pro/team)
13. **Create `app/(auth)/onboarding/page.tsx`** — Post-signup onboarding flow
14. **Implement usage tracking** — Enforce `messagesThisMonth` limits per tier (free=25, pro=unlimited, etc.)
15. **Voice transcription** — `api/voice/transcribe/route.ts` exists but needs OpenAI Whisper integration
16. **NICE method auth** — Notes/investigations are global (no userId on Note model). Add user scoping.

## 🟢 LOW — Polish & Launch

17. **Add middleware.ts** — Protect dashboard routes, redirect unauthenticated users
18. **Stripe webhooks** — Handle subscription events, update user tier
19. **Message streaming UI** — Token-by-token rendering with react-markdown
20. **Mobile responsive** — Sidebar collapse, touch-friendly
21. **Error boundaries** — `global-error.tsx` exists but per-route error handling needed
22. **Rate limiting** — API route protection
23. **Pattern/Win/Coaching models** — Schema exists, no UI or API routes

## Architecture Notes

- **Stack:** Next.js 16 + React 19 + Prisma (SQLite) + NextAuth v5 + Tailwind v4
- **DB:** SQLite (fine for MVP, migrate to Postgres for prod)
- **AI:** Anthropic SDK + OpenAI SDK installed; plan is OpenRouter for multi-model
- **State:** Zustand (installed but store not created yet)
- **UI:** shadcn/ui components (card, button, badge, dialog, tabs, etc.)
- **Payments:** Stripe SDK installed, env vars templated, no implementation

## Quick Start (to make it runnable)

```bash
# 1. Copy env
cp .env.example .env
# 2. Add ANTHROPIC_API_KEY to .env
# 3. Generate auth secret
npx auth secret
# 4. Push schema to DB
npx prisma db push
# 5. Generate client
npx prisma generate
# 6. Create the 4 critical missing files (items 1-4 above)
# 7. Run
npm run dev
```

The NICE method pages (note/investigate/create/execute) will work once the DB is set up.
The chat system needs items 1-6 before it's functional.
