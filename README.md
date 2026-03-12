# Command App — AI Agent Platform

A full-stack AI agent orchestration platform built with Next.js 16, Prisma, and the Anthropic Claude API. Run, track, and manage AI agents through a clean, production-ready interface.

## Tech Stack

![Next.js](https://img.shields.io/badge/-Next.js%2016-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Anthropic](https://img.shields.io/badge/-Anthropic%20Claude-D4A843?style=flat)
![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/-Radix%20UI-161618?style=flat)

## Key Features

- **AI Agent Runner** — Execute, monitor, and manage agents via the Claude API
- **Full Auth System** — NextAuth v5 with Prisma adapter, bcrypt password hashing, session management
- **Subscription Tiers** — Free / Pro / Team tiers with Stripe customer ID tracking
- **Voice Transcription** — `/api/voice/transcribe` endpoint for speech-to-text input
- **Investigation Mode** — Single and batch investigation endpoints for multi-step reasoning
- **Daily Plans** — AI-powered daily planning API
- **Persistent Conversations** — Full conversation history stored in SQLite via Prisma
- **Modern UI** — shadcn/ui components, Sonner toasts, responsive layout

## Project Structure

```
app/
  api/
    execute/        # Agent execution endpoints (current, complete)
    investigate/    # Single + batch investigation
    voice/          # Transcription
    plans/          # Daily planning
    notes/          # Note management
  globals.css
  layout.tsx
components/
  ui/               # shadcn/ui component library
  shared/           # Shared layout components (NiceNav, etc.)
lib/
  ai/               # AI logic (investigate, etc.)
prisma/
  schema.prisma     # SQLite DB schema
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, ANTHROPIC_API_KEY, NEXTAUTH_SECRET, STRIPE_SECRET_KEY

# Run database migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path (e.g. `file:./prisma/dev.db`) |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session signing |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | Stripe secret for subscription management |

## Built By

[Daniel Ciampelletti](https://github.com/dannyc1198-bit) — Founder, [Wavelength AI](https://github.com/dannyc1198-bit)
