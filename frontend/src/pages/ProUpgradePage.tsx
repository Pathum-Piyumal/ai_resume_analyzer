import { useState } from 'react'
import { CheckCircle2, Zap, Shield, User, CreditCard, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'
import { api } from '../utils/api'

interface ProUpgradePageProps {
  onUpgradeClick?: (plan: string) => void
}

export default function ProUpgradePage({ onUpgradeClick }: ProUpgradePageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('123')
  const [cardName, setCardName] = useState('Job Seeker')

  const handleUpgradeClick = (planName: string) => {
    const plan = plans.find(p => p.name === planName)
    setSelectedPlan(plan)
    setIsCheckoutOpen(true)
  }

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpgrading(true)
    try {
      await api.upgradeToPro()
      setUpgradeSuccess(true)
    } catch (err) {
      console.error("Upgrade failed", err)
      alert("Billing simulation failed. Please try again.")
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleCloseSuccess = () => {
    setIsCheckoutOpen(false)
    setUpgradeSuccess(false)
    if (selectedPlan && onUpgradeClick) {
      onUpgradeClick(selectedPlan.name)
    }
  }

  const plans = [
    {
      name: "Free",
      priceMonthly: "$0",
      priceAnnual: "$0",
      periodMonthly: "/month",
      periodAnnual: "/month",
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
      priceMonthly: "$15",
      priceAnnual: "$12",
      periodMonthly: "/month",
      periodAnnual: "/month, billed yearly",
      icon: Zap,
      description: "Ideal for active job seekers needing deep insights and custom cover letters.",
      features: [
        "Unlimited AI Resume Analyses",
        "Advanced ATS scoring algorithms",
        "Custom Cover Letter generation",
        "Mock Interview Q&A matching",
        "Priority email support"
      ],
      buttonText: "Upgrade Now",
      popular: true,
      color: "blue",
      available: true
    },
    {
      name: "Elite",
      priceMonthly: "$29",
      priceAnnual: "$23",
      periodMonthly: "/month",
      periodAnnual: "/month, billed yearly",
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
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto relative min-h-[80vh] text-left space-y-8"
    >
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-brand-blue/5 blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-12 left-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4 py-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Unlock Your Career Potential
        </h1>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-textMuted font-sans">
          Upgrade to a premium plan to gain access to advanced ATS algorithms, unlimited analyses, and personalized career pathing tools.
        </p>
      </motion.div>

      {/* Sliding Billing cycle Selector */}
      <motion.div variants={itemVariants} className="flex justify-center items-center relative z-10">
        <div className="relative flex rounded-full bg-[#121626] p-1 border border-white/5">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative rounded-full px-4 py-1.5 text-xs font-bold font-sans transition-all duration-300 focus:outline-none ${
              billingCycle === 'monthly' ? 'text-white' : 'text-brand-textMuted hover:text-white'
            }`}
          >
            {billingCycle === 'monthly' && (
              <motion.div
                layoutId="upgradeBillingPill"
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
                layoutId="upgradeBillingPill"
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
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isBlue = plan.color === 'blue'
          const isEmerald = plan.color === 'emerald'
          
          return (
            <motion.div 
              key={plan.name}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
              onMouseMove={handleMouseMove}
              className={`group relative rounded-3xl border flex flex-col p-8 transition-shadow duration-300 backdrop-blur-sm overflow-hidden ${
                isBlue 
                  ? 'bg-brand-card/60 border-brand-lightBlue/50 shadow-2xl shadow-brand-blue/20 ring-1 ring-brand-blue/50' 
                  : isEmerald
                    ? 'bg-brand-card/40 border-emerald-500/50 hover:border-emerald-400'
                    : 'bg-brand-card/40 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Mouse Spotlight */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: isBlue
                    ? 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(37, 99, 235, 0.15), transparent 80%)'
                    : isEmerald
                      ? 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.12), transparent 80%)'
                      : 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.06), transparent 80%)'
                }}
              />

              <div className="relative z-10 flex flex-col flex-grow">
                {plan.popular && (
                  <div className="absolute -top-12 inset-x-0 flex justify-center">
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
                  <motion.span 
                    key={billingCycle}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-5xl font-extrabold tracking-tight text-white font-sans"
                  >
                    {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                  </motion.span>
                  <motion.span 
                    key={billingCycle + '-period'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold text-brand-textMuted"
                  >
                    {billingCycle === 'monthly' ? plan.periodMonthly : plan.periodAnnual}
                  </motion.span>
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
                  onClick={() => plan.available !== false && plan.name !== 'Free' && handleUpgradeClick(plan.name)}
                  disabled={plan.available === false || plan.name === 'Free'}
                  className={`mt-10 block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold shadow-lg transition-all active:scale-[0.98] focus:outline-none ${
                    plan.name === 'Free'
                      ? 'bg-slate-800/40 border border-white/5 text-brand-textMuted cursor-default'
                      : plan.available === false
                        ? 'bg-brand-dark border border-white/10 text-brand-textMuted cursor-not-allowed'
                        : isBlue
                          ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-brand-blue/25'
                          : isEmerald
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {plan.name === 'Free' ? 'Current Plan' : plan.buttonText}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Checkout Simulation & Success Modals */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpgrading && !upgradeSuccess && setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-[#060814]/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1225] p-6 shadow-2xl z-10 space-y-6 text-left overflow-hidden"
            >
              {!upgradeSuccess ? (
                <>
                  {/* Close button */}
                  <button
                    onClick={() => !isUpgrading && setIsCheckoutOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors focus:outline-none"
                    disabled={isUpgrading}
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand-blue/15 text-brand-lightBlue">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-sans">Checkout Simulation</h3>
                        <p className="text-[11px] text-brand-textMuted font-sans">Simulate a payment to upgrade your subscription.</p>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      {/* Subscription Details summary */}
                      <div className="flex justify-between items-center bg-[#161b33] border border-white/5 rounded-2xl p-4 mb-4">
                        <div>
                          <p className="text-xs font-bold text-white">{selectedPlan?.name} Subscription</p>
                          <p className="text-[10px] text-brand-textMuted mt-0.5">Billed {billingCycle}</p>
                        </div>
                        <p className="text-lg font-extrabold text-brand-lightBlue">
                          {billingCycle === 'monthly' ? selectedPlan?.priceMonthly : selectedPlan?.priceAnnual}
                        </p>
                      </div>

                      {/* Payment Form */}
                      <form onSubmit={handleConfirmCheckout} className="space-y-4 font-sans">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full bg-[#121626]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 outline-none transition-all"
                            disabled={isUpgrading}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-[#121626]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 outline-none transition-all font-mono"
                            disabled={isUpgrading}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Expiration Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-[#121626]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 outline-none transition-all font-mono text-center"
                              disabled={isUpgrading}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">CVV</label>
                            <input
                              type="text"
                              required
                              maxLength={3}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full bg-[#121626]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 outline-none transition-all font-mono text-center"
                              disabled={isUpgrading}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isUpgrading}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue hover:bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-brand-blue/15 transition-all mt-6 active:scale-[0.98] disabled:opacity-50"
                        >
                          {isUpgrading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Processing transaction...</span>
                            </>
                          ) : (
                            <span>Simulate Checkout & Upgrade</span>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white tracking-tight font-sans">Upgrade Successful!</h3>
                    <p className="text-xs text-brand-textMuted font-sans max-w-xs mx-auto">
                      Congratulations! You have unlocked ResumeIQ Pro. Enjoy unlimited analyses, cover letters, and personalized roadmaps.
                    </p>
                  </div>

                  <button
                    onClick={handleCloseSuccess}
                    className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-colors mt-6"
                  >
                    Get Started with Pro
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
