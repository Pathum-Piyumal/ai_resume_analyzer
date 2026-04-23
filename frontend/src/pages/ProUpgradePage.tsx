import { CheckCircle2, Sparkles, Zap, Shield, User } from 'lucide-react'

interface ProUpgradePageProps {
  onUpgradeClick?: (plan: string) => void
}

export default function ProUpgradePage({ onUpgradeClick }: ProUpgradePageProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "",
      icon: User,
      description: "Perfect for testing the waters and optimizing your first resume.",
      features: [
        "10 AI Resume Analyses per month",
        "Basic ATS keyword matching",
        "Standard formatting suggestions",
        "Export to PDF"
      ],
      buttonText: "Current Plan",
      popular: false,
      color: "slate",
      available: true
    },
    {
      name: "Pro",
      price: "$15",
      period: "/month",
      icon: Zap,
      description: "Ideal for active job seekers needing deep insights and custom cover letters.",
      features: [
        "Unlimited AI Resume Analyses",
        "Advanced ATS scoring algorithms",
        "Custom Cover Letter generation",
        "Mock Interview Q&A matching",
        "Priority email support"
      ],
      buttonText: "Join Waitlist",
      popular: true,
      color: "blue",
      available: false
    },
    {
      name: "Elite",
      price: "$29",
      period: "/month",
      icon: Shield,
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
      color: "emerald",
      available: false
    }
  ]

  return (
    <div className="max-w-5xl mx-auto animate-fade-in text-left space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-lightBlue border border-brand-blue/20 shadow-lg shadow-brand-blue/10">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Unlock Your Career Potential
        </h1>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-textMuted font-sans">
          Upgrade to a premium plan to gain access to advanced ATS algorithms, unlimited analyses, and personalized career pathing tools.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isBlue = plan.color === 'blue'
          const isEmerald = plan.color === 'emerald'
          
          return (
            <div 
              key={plan.name}
              className={`relative rounded-3xl border flex flex-col p-8 transition-transform duration-300 hover:-translate-y-2 backdrop-blur-sm ${
                isBlue 
                  ? 'bg-brand-card/60 border-brand-lightBlue/50 shadow-2xl shadow-brand-blue/20 ring-1 ring-brand-blue/50' 
                  : isEmerald
                    ? 'bg-brand-card/40 border-emerald-500/50 hover:border-emerald-400'
                    : 'bg-brand-card/40 border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-lightBlue to-brand-blue px-4 py-1 text-[10px] font-extrabold text-white uppercase tracking-widest shadow-lg shadow-brand-blue/30">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl shrink-0 ${isBlue ? 'bg-brand-blue/15 text-brand-lightBlue' : isEmerald ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">{plan.name} Plan</h3>
                </div>
              </div>
              
              <p className="mt-2 text-sm text-brand-textMuted h-10 font-sans">
                {plan.description}
              </p>
              
              <div className="mt-6 flex items-baseline gap-x-1 border-b border-white/5 pb-8">
                <span className="text-5xl font-extrabold tracking-tight text-white font-sans">{plan.price}</span>
                <span className="text-sm font-semibold text-brand-textMuted">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-slate-300 font-sans">
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${isBlue ? 'text-brand-lightBlue' : isEmerald ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.available !== false && onUpgradeClick?.(plan.name)}
                disabled={plan.available === false}
                className={`mt-10 block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold shadow-lg transition-all active:scale-[0.98] ${
                  plan.available === false
                    ? 'bg-brand-dark border border-white/10 text-brand-textMuted cursor-not-allowed'
                    : isBlue
                      ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-brand-blue/25'
                      : isEmerald
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          )
        })}
      </div>

    </div>
  )
}
