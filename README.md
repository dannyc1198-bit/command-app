# Wavelength AI — Multi-Agent Command Intelligence Platform

> 5 specialist AI agents. One interface. Chat one-on-one or launch **Swarm Mode** for multi-agent collaboration on complex problems.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Coming_Soon-blue?style=for-the-badge)](#live-demo)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Anthropic](https://img.shields.io/badge/Anthropic_Claude-D4A843?style=flat-square&logo=anthropic&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-6366F1?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand_5-433D3C?style=flat-square)

---

## What It Does

Wavelength AI is a full-stack SaaS platform that orchestrates multiple AI agents — each with a distinct personality, specialty, and underlying model — through a real-time streaming chat interface. Users interact with individual agents for focused tasks, or activate **Swarm Mode** to have multiple agents collaborate on complex, multi-dimensional problems with automatic synthesis of their responses.

The platform handles authentication, usage-based billing, conversation persistence, and real-time token-by-token streaming — all in a production-ready architecture.

---

## The Agents

| Agent | Specialty | Model |
|-------|-----------|-------|
| 🦞 **Clawdy** | Command intelligence — strategic thinking, task orchestration, multi-domain analysis | Claude Sonnet 4.6 |
| 🔍 **Hunter** | Lead generation — prospect research, cold outreach, pipeline building, CRM optimization | Claude via OpenRouter |
| 📝 **Content** | Content & copy — blog posts, social media, email campaigns, brand voice | Claude via OpenRouter |
| 🔨 **Builder** | Code & architecture — full-stack development, system design, database architecture | Claude via OpenRouter |
| 🎵 **Vibration** | Frequencies & flow — mindset coaching, flow states, energy management | GPT-4o |

---

## Key Features

### Multi-Agent Chat
- **Real-time streaming** — Token-by-token SSE responses with auto-save to database
- **Markdown rendering** — Full GFM support with syntax-highlighted code blocks
- **Conversation history** — Persistent chat sessions with auto-generated titles
- **Model flexibility** — Agents route through OpenRouter for multi-model support (Claude, GPT-4o, Gemini)

### Swarm Mode
- Select 2–5 agents to collaboratively solve complex problems
- **Sequential strategy** — Agents respond in order, each building on previous context
- **Parallel strategy** — All agents respond simultaneously, then a synthesis agent unifies insights
- Gated by subscription tier (Pro: 3 agents, Team: 5 agents)

### Billing & Usage
- Three subscription tiers: **Free** (25 msgs/mo), **Pro** (1,000 msgs/mo), **Team** (5,000 msgs/mo)
- Stripe integration with checkout, customer portal, and webhook-driven subscription management
- Visual usage meter with monthly auto-reset

### Authentication
- NextAuth v5 with credentials provider (email/password + bcrypt)
- Optional OAuth (Google, GitHub)
- JWT sessions with Prisma adapter

### NICE Method (Productivity Framework)
- **Note** → Capture raw thoughts and ideas
- **Investigate** → AI categorizes, prioritizes, and estimates effort
- **Create** → Generate structured action plans
- **Execute** → Track progress, blockers, and outcomes

---

## Architecture

```
app/
├── (auth)/                 # Login, signup, onboarding
├── (marketing)/            # Landing page, pricing
├── (dashboard)/
│   ├── chat/               # Agent selection + conversation UI
│   ├── swarm/              # Multi-agent collaboration
│   ├── settings/billing/   # Usage metrics + plan management
│   └── nice/               # Note → Investigate → Create → Execute
├── api/
│   ├── chat/               # Conversations + streaming messages (SSE)
│   ├── swarm/              # Multi-agent orchestration
│   ├── stripe/             # Checkout, portal, webhooks
│   ├── auth/               # NextAuth + signup
│   └── user/               # Current user data
components/
├── wavelength/             # App-specific (ChatView, SwarmLauncher, AgentGrid, etc.)
└── ui/                     # Reusable primitives (Radix-based)
lib/
├── agents/                 # Agent definitions & system prompts
├── ai/                     # Anthropic SDK + OpenRouter integration
├── stores/                 # Zustand state (chat)
├── billing/                # Usage tracking, plan limits
└── swarm/                  # Swarm orchestration logic
prisma/
└── schema.prisma           # SQLite schema (users, conversations, messages, billing, NICE)
```

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Zustand 5, Radix UI |
| **AI** | Anthropic Claude SDK, OpenRouter API (multi-model), OpenAI SDK |
| **Backend** | Next.js API Routes, Server-Sent Events (SSE), NextAuth v5 |
| **Database** | SQLite via Prisma ORM |
| **Payments** | Stripe (subscriptions, webhooks, customer portal) |
| **UI** | Lucide icons, React Markdown + rehype-highlight, Sonner toasts |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dannyc1198-bit/command-app.git
cd command-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
AUTH_SECRET="your-generated-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI
OPENROUTER_API_KEY="your-openrouter-key"
ANTHROPIC_API_KEY="your-anthropic-key"        # Optional: direct Claude access

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
STRIPE_PRO_PRICE_ID="your-pro-price-id"
STRIPE_TEAM_PRICE_ID="your-team-price-id"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-publishable-key"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

---

## Live Demo

> 🚀 **Coming soon** — deployment in progress.

<!-- Replace with live URL when deployed -->
<!-- [wavelength.ai](https://wavelength.ai) -->

---

## Built By

**Danny Ciampelletti** — [GitHub](https://github.com/dannyc1198-bit)

---

<p align="center">
  <sub>Built with Next.js, Claude, and an unreasonable amount of caffeine.</sub>
</p>
