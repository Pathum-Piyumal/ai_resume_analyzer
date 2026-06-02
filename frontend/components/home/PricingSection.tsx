import { CheckCircle2 } from 'lucide-react'

interface PricingSectionProps {
  onNavigate?: (view: 'landing' | 'analyze' | 'signup') => void
}

export default function PricingSection({ onNavigate }: PricingSectionProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for testing the waters and optimizing your first resume.",
      features: [
        "10 AI Resume Analyses per month",
        "Basic ATS keyword matching",
        "Standard formatting suggestions",
        "Export to PDF"
      ],
      buttonText: "Get Started",
      popular: false,
      available: true
    },
    {
      name: "Pro",
      price: "$15",
      period: "/month",
      description: "Ideal for active job seekers needing deep insights and cover letters.",
      features: [
        "Unlimited AI Resume Analyses",
        "Advanced ATS scoring algorithms",
        "Custom Cover Letter generation",
        "Mock Interview Q&A matching",
        "Priority email support"
      ],
      buttonText: "Join Waitlist",
      popular: true,
      available: false
    },
    {
      name: "Elite",
      price: "$29",
      period: "/month",
      description: "The ultimate career intelligence suite for senior roles and management.",
      features: [
        "Everything in Pro",
        "1-on-1 AI Career Coaching",
        "Direct LinkedIn Profile Sync",
        "Recruiter Outreach Automation",
        "Salary Negotiation Scripts"
      ],
      buttonText: "Coming Soon",
      popular: false,
      available: false
    }
  ]

  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden bg-brand-dark">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 flex justify-center pt-24 pointer-events-none">
        <div className="w-full max-w-3xl h-[400px] bg-brand-blue/10 blur-[100px] rounded-full opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        
        <div className="mx-auto max-w-2xl">
          <h2 className="text-sm font-bold tracking-widest text-brand-lightBlue uppercase font-sans">
            Simple Pricing
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-sans">
            Choose the plan that fits your career goals
          </p>
          <p className="mt-4 text-lg text-brand-textMuted font-sans">
            Unlock the full potential of AI-driven career intelligence.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 sm:px-6 md:px-0 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-3xl border flex flex-col p-8 text-left transition-transform duration-300 hover:-translate-y-2 backdrop-blur-sm ${
                plan.popular 
                  ? 'bg-brand-blue/10 border-brand-lightBlue shadow-2xl shadow-brand-blue/20 ring-1 ring-brand-blue' 
                  : 'bg-[#121626]/80 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white font-sans">{plan.name}</h3>
                {plan.popular && (
                  <span className="inline-flex items-center rounded-full bg-brand-lightBlue/20 px-2.5 py-1 text-[10px] font-bold text-brand-lightBlue uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-brand-textMuted h-10 font-sans">{plan.description}</p>
              
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-extrabold tracking-tight text-white font-sans">{plan.price}</span>
                {plan.period && <span className="text-sm font-semibold text-brand-textMuted">{plan.period}</span>}
              </div>

              <ul className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-slate-300 font-sans">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-lightBlue" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.available !== false && onNavigate?.('signup')}
                disabled={plan.available === false}
                className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-bold shadow-lg transition-all active:scale-[0.98] ${
                  plan.available === false
                    ? 'bg-brand-dark border border-white/10 text-brand-textMuted cursor-not-allowed'
                    : plan.popular
                      ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-brand-blue/25'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
