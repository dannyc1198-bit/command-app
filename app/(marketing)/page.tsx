import Link from "next/link"
import { ArrowRight, Sparkles, Zap, Shield, Users, MessageSquare, Brain } from "lucide-react"

const agents = [
  { name: "Clawdy", emoji: "🦞", title: "Command Intelligence", color: "#00d4ff" },
  { name: "Hunter", emoji: "🔍", title: "Lead Generation", color: "#f59e0b" },
  { name: "Content", emoji: "📝", title: "Content & Copy", color: "#ec4899" },
  { name: "Builder", emoji: "🔨", title: "Code & Architecture", color: "#8b5cf6" },
  { name: "Vibration", emoji: "🎵", title: "Frequencies & Flow", color: "#10b981" },
]

const features = [
  { icon: Brain, title: "5 Specialist Agents", desc: "Each with unique expertise, personality, and AI model" },
  { icon: MessageSquare, title: "Real-time Streaming", desc: "Token-by-token responses with markdown rendering" },
  { icon: Users, title: "Swarm Mode", desc: "Multiple agents collaborate on complex problems" },
  { icon: Zap, title: "Multi-Model AI", desc: "Claude, GPT-4o, and Gemini via OpenRouter" },
  { icon: Shield, title: "Usage Controls", desc: "Free tier, Pro, and Team plans with fair limits" },
  { icon: Sparkles, title: "Cosmic UX", desc: "Dark theme with agent-colored glows and gradients" },
]

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-32 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/5 via-[#8b5cf6]/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-4 py-1.5 text-sm text-[#00d4ff]">
            <Sparkles className="h-4 w-4" />
            Your command intelligence hub
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-7xl">
            Meet your{" "}
            <span className="bg-gradient-to-r from-[#00d4ff] via-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">
              AI command team
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            5 expert AI agents — each with a unique personality, specialty, and AI model.
            Chat one-on-one or launch Swarm Mode for multi-agent collaboration.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Agent Showcase */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Meet the Squad</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="group rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `${agent.color}15` }}
                >
                  {agent.emoji}
                </div>
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <p className="text-sm text-gray-400">{agent.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Built Different</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <f.icon className="mb-3 h-8 w-8 text-[#00d4ff]" />
                <h3 className="mb-1 text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-4xl font-bold text-white">Ready to get started?</h2>
          <p className="text-gray-400">25 free messages per month. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] px-8 py-4 text-lg font-medium text-white hover:opacity-90 transition-opacity"
          >
            Start Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Wavelength Solutions. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
