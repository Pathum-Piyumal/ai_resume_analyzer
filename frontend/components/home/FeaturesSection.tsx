import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Search, BarChart2, Brain, FileCheck, Rocket } from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Scoring',
    description: 'Get a comprehensive match in seconds. Understand exactly how your resume stacks up against target descriptions.',
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-amber-500/5',
    border: 'hover:border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.10)',
  },
  {
    icon: Search,
    title: 'Keyword Optimization',
    description: 'Extract and match critical keyphrases. Automatically scan and identify missing terms that matter to recruiters.',
    color: 'text-brand-lightBlue',
    bg: 'from-brand-blue/10 to-brand-blue/5',
    border: 'hover:border-brand-blue/30',
    glow: 'rgba(37, 99, 235, 0.10)',
  },
  {
    icon: BarChart2,
    title: 'Skill Gap Analysis',
    description: 'Receive actionable recommendations on skills to obtain and credentials to highlight for your target role.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-500/5',
    border: 'hover:border-emerald-500/30',
    glow: 'rgba(16, 185, 129, 0.10)',
  },
  {
    icon: Brain,
    title: 'AI Career Coaching',
    description: 'Personalized career path suggestions powered by GPT-4, tailored to your skills and industry trends.',
    color: 'text-violet-400',
    bg: 'from-violet-500/10 to-violet-500/5',
    border: 'hover:border-violet-500/30',
    glow: 'rgba(124, 58, 237, 0.10)',
  },
  {
    icon: FileCheck,
    title: 'ATS Formatting Check',
    description: 'Detect and fix formatting issues that break ATS parsing. Ensure clean, machine-readable structure every time.',
    color: 'text-rose-400',
    bg: 'from-rose-500/10 to-rose-500/5',
    border: 'hover:border-rose-500/30',
    glow: 'rgba(244, 63, 94, 0.10)',
  },
  {
    icon: Rocket,
    title: 'Job Match Engine',
    description: 'Paste any job description and instantly see your compatibility score with ranked improvement priorities.',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10 to-cyan-500/5',
    border: 'hover:border-cyan-500/30',
    glow: 'rgba(6, 182, 212, 0.10)',
  },
]

function FeatureCard({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feat.icon

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border border-white/5 p-8 transition-all duration-300 ${feat.border} hover:shadow-xl overflow-hidden cursor-default bg-brand-card`}
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(340px circle at var(--mouse-x,50%) var(--mouse-y,50%), ${feat.glow}, transparent 70%)` }}
      />

      {/* Top-right corner glow accent */}
      <div className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${feat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.12, rotate: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.bg} ${feat.color} mb-6 relative z-10`}
      >
        <Icon className="h-6 w-6" />
      </motion.div>

      <h3 className={`font-sans text-xl font-bold mb-3 group-hover:${feat.color} transition-colors duration-200 relative z-10 text-brand-textPrimary`}>
        {feat.title}
      </h3>
      <p className="text-sm font-sans font-light leading-relaxed text-brand-textMuted relative z-10">
        {feat.description}
      </p>

      {/* Bottom border glow on hover */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </motion.div>
  )
}

export default function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-brand-dark" id="solutions">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/3 -z-10 h-[350px] w-[500px] -translate-y-1/2 rounded-full bg-brand-blue/5 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block text-xs font-bold tracking-widest text-brand-lightBlue uppercase mb-3 px-3 py-1 rounded-full border border-brand-blue/20 bg-brand-blue/5"
          >
            What We Offer
          </motion.span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-sans mb-4 text-brand-textPrimary">
            Precision Engineered{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-lightBlue bg-clip-text text-transparent">
              for Excellence
            </span>
          </h2>
          <p className="text-base sm:text-lg text-brand-textMuted font-sans font-light leading-relaxed">
            Our AI analysis tool parses your professional history against thousands of successful industry benchmarks.
          </p>
        </motion.div>

        {/* 6-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => <FeatureCard key={feat.title} feat={feat} index={i} />)}
        </div>
      </div>
    </section>
  )
}
