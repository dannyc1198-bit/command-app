import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Get started with AI agents",
    features: [
      "25 messages per month",
      "All 12 AI agents",
      "Conversation history",
      "Markdown rendering",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: 19,
    description: "For power users and professionals",
    features: [
      "1,000 messages per month",
      "All 12 AI agents",
      "Swarm Mode (up to 3 agents)",
      "Model selection",
      "Priority support",
    ],
    cta: "Get Pro",
    href: "/signup",
    popular: true,
  },
  {
    name: "Team",
    price: 49,
    description: "For teams and businesses",
    features: [
      "5,000 messages per month",
      "All 12 AI agents",
      "Swarm Mode (up to 5 agents)",
      "Model selection",
      "Team collaboration",
      "Priority support",
    ],
    cta: "Get Team",
    href: "/signup",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-8 ${
                plan.popular
                  ? "border-[#00d4ff]/30 bg-[#00d4ff]/5"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] px-3 py-0.5 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                {plan.price > 0 && <span className="text-gray-400">/month</span>}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00d4ff]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
