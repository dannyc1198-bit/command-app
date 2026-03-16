# Command — AI-Powered ADHD Productivity System

> An AI executive assistant for ADHD entrepreneurs, built around the **NICE method**: Note, Investigate, Create, Execute.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Anthropic](https://img.shields.io/badge/Claude_Sonnet-D4A843?style=flat-square&logo=anthropic&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_+_SQLite-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## What It Does

Command is a single-app productivity system that acts as an AI executive assistant. Instead of requiring you to organize, categorize, or prioritize — the AI does all of that. You just dump your thoughts and execute.

### The NICE Method

| Stage | What Happens | Who Does It |
|-------|-------------|-------------|
| **N — Note** | Capture everything via text or voice | You |
| **I — Investigate** | AI categorizes, prioritizes, estimates effort | Claude |
| **C — Create** | AI builds your daily plan (money move + top 3) | Claude |
| **E — Execute** | Focused single-task workflow, one at a time | You |

### Design Principles

- **Zero friction capture** — No forms, just dump thoughts
- **AI does the thinking** — You don't categorize or organize
- **ADHD-optimized** — External accountability, clear structure, visual progress
- **Revenue-focused** — "Money moves" are first-class citizens
- **One thing at a time** — Execute stage shows a single task only

---

## Architecture

```
app/
├── note/page.tsx              # NOTE stage UI
├── investigate/page.tsx       # INVESTIGATE stage UI
├── create/page.tsx            # CREATE stage UI
├── execute/page.tsx           # EXECUTE stage UI
├── api/
│   ├── notes/                 # Create + list + get/delete notes
│   ├── investigate/           # Single + batch AI investigation
│   ├── plans/daily/           # Generate + fetch daily plans
│   ├── execute/               # Current task, complete, stuck
│   ├── coach/                 # AI coaching chat
│   ├── patterns/              # Pattern recognition
│   └── voice/transcribe/      # Whisper voice-to-text
components/
├── shared/NiceNav.tsx         # NICE stage navigation
└── ui/                        # shadcn/ui components
lib/
├── ai/investigate.ts          # AI note analysis logic
├── ai/plan.ts                 # AI daily planning logic
├── anthropic.ts               # Claude API client
├── openai.ts                  # Whisper API client
├── prisma.ts                  # Database client
├── types/index.ts             # TypeScript types
└── utils.ts                   # Utilities
prisma/
└── schema.prisma              # SQLite schema
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| **AI** | Anthropic Claude Sonnet (investigation + planning + coaching) |
| **Voice** | OpenAI Whisper (speech-to-text capture) |
| **Database** | SQLite via Prisma ORM |
| **UI** | shadcn/ui, Lucide icons, Sonner toasts |

---

## Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Install

```bash
git clone https://github.com/dannyc1198-bit/command-app.git
cd command-app
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

```env
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY="your-anthropic-key"
OPENAI_API_KEY="your-openai-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database

```bash
npx prisma generate
npx prisma db push
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to NOTE stage.

---

## Data Models

- **Note** — Raw captured thoughts with status tracking through NICE stages
- **Investigation** — AI analysis: type, category, priority, energy, time estimate
- **Plan** — Daily/weekly plans linking investigations to scheduled work
- **Execution** — Task progress: status, time spent, blockers, outcomes
- **NiceSession** — Daily stage progression and energy tracking
- **Pattern** — AI-detected behavioral patterns (procrastination, energy, etc.)
- **Win** — Positive reinforcement tracking
- **CoachingSession** — AI coaching conversation history

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET/POST` | `/api/notes` | List + create notes |
| `GET/DELETE` | `/api/notes/[id]` | Get + delete note |
| `POST` | `/api/investigate/single` | Investigate one note |
| `POST` | `/api/investigate/batch` | Batch investigate all |
| `GET/POST` | `/api/plans/daily` | Fetch + generate daily plan |
| `GET` | `/api/execute/current` | Get current task |
| `POST` | `/api/execute/complete` | Mark task complete |
| `POST` | `/api/execute/stuck` | Report blocker |
| `POST` | `/api/coach` | AI coaching chat |
| `GET` | `/api/patterns` | Get detected patterns |
| `POST` | `/api/voice/transcribe` | Voice-to-text |

---

## Built By

**Danny Ciampelletti** — [GitHub](https://github.com/dannyc1198-bit)
