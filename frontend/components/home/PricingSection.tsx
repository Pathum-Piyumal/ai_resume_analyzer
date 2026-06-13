import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

interface PricingSectionProps {
  onNavigate?: (view: 'landing' | 'analyze' | 'signup') => void
}

export default function PricingSection({ onNavigate }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      name: "Free",
      priceMonthly: "$0",
      priceAnnual: "$0",
      periodMonthly: "/month",
      periodAnnual: "/month",
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
      priceMonthly: "$15",
      priceAnnual: "$12",
      periodMonthly: "/month",
      periodAnnual: "/month, billed yearly",
      description: "Ideal for active job seekers needing deep insights and cover letters.",
      features: [
        "Unlimited AI Resume Analyses",
        "Advanced ATS scoring algorithms",
        "Custom Cover Letter generation",
        "Mock Interview Q&A matching",
        "Priority email support"
      ],
      buttonText: "Upgrade Now",
      popular: true,
      available: true
    },
    {
      name: "Elite",
      priceMonthly: "$29",
      priceAnnual: "$23",
      periodMonthly: "/month",
      periodAnnual: "/month, billed yearly",
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 18 
      } 
    }
  }

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
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl font-sans text-brand-textPrimary">
            Choose the plan that fits your career goals
          </p>
          <p className="mt-4 text-lg text-brand-textMuted font-sans">
            Unlock the full potential of AI-driven career intelligence.
          </p>
        </div>

        {/* Sliding Billing cycle Selector */}
        <div className="mt-10 flex justify-center items-center">
          <div className="relative flex rounded-full p-1 border border-white/5 bg-brand-card">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative rounded-full px-4 py-1.5 text-xs font-bold font-sans transition-all duration-300 focus:outline-none ${
                billingCycle === 'monthly' ? 'text-white' : 'text-brand-textMuted hover:text-brand-textPrimary'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div
                  layoutId="billingPill"
                  className="absolute inset-0 rounded-full bg-brand-blue shadow-lg shadow-brand-blue/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`relative rounded-full px-4 py-1.5 text-xs font-bold font-sans transition-all duration-300 focus:outline-none ${
                billingCycle === 'annual' ? 'text-white' : 'text-brand-textMuted hover:text-white'
              }`}
            >
              {billingCycle === 'annual' && (
                <motion.div
                  layoutId="billingPill"
                  className="absolute inset-0 rounded-full bg-brand-blue shadow-lg shadow-brand-blue/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                Annually
                <span className="rounded-full bg-emerald-500/25 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-400 border border-emerald-500/10">
                  Save 20%
                </span>
              </span>
            </button>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 sm:px-6 md:px-0 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div 
              key={plan.name}
              variants={itemVariants}
              whileHover={plan.available !== false || plan.popular ? { y: -8, scale: 1.015, transition: { duration: 0.2 } } : {}}
              onMouseMove={handleMouseMove}
              className={`group rounded-3xl border flex flex-col p-8 text-left backdrop-blur-sm transition-shadow duration-300 relative overflow-hidden ${
                plan.popular 
                  ? 'bg-brand-blue/10 border-brand-lightBlue/80 shadow-xl shadow-brand-blue/10 hover:shadow-brand-blue/20 ring-1 ring-brand-blue/30' 
                  : 'bg-brand-card/80 border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-brand-dark/30'
              }`}
            >
              {/* Mouse Spotlight */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: plan.popular
                    ? 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(37, 99, 235, 0.15), transparent 80%)'
                    : 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.08), transparent 80%)'
                }}
              />

              <div className="relative z-10 flex flex-col flex-grow">
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`text-xl font-bold font-sans ${ plan.popular ? 'text-white' : 'text-brand-textPrimary'}`}>{plan.name}</h3>
                  {plan.popular && (
                    <span className="inline-flex items-center rounded-full bg-brand-lightBlue/20 px-2.5 py-1 text-[10px] font-bold text-brand-lightBlue uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-brand-textMuted h-10 font-sans">{plan.description}</p>
                
                <div className="mt-6 flex items-baseline gap-x-1">
                  <motion.span 
                    key={billingCycle}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-4xl font-extrabold tracking-tight font-sans text-brand-textPrimary"
                  >
                    {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                  </motion.span>
                  <motion.span 
                    key={billingCycle + '-period'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-semibold text-brand-textMuted"
                  >
                    {billingCycle === 'monthly' ? plan.periodMonthly : plan.periodAnnual}
                  </motion.span>
                </div>

                <ul className="mt-8 space-y-4 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm font-sans text-brand-textMuted">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-lightBlue" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => plan.available !== false && onNavigate?.('signup')}
                  disabled={plan.available === false}
                  whileTap={plan.available !== false ? { scale: 0.97 } : {}}
                  className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-bold shadow-lg transition-all ${
                    plan.available === false
                      ? 'bg-brand-dark border border-white/10 text-brand-textMuted cursor-not-allowed'
                      : plan.popular
                        ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-brand-blue/25'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
