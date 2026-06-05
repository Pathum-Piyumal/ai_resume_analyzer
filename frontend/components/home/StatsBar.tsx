import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItemProps {
  value: number
  suffix: string
  label: string
  delay?: number
  color?: string
}

function StatItem({ value, suffix, label, delay = 0, color = 'text-brand-lightBlue' }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center p-6 text-center group"
    >
      <div className="flex items-baseline font-sans text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, rgb(var(--brand-text-primary)), #CBD5E1)' }}>
          {value}
        </span>
        <motion.span
          className={`${color} ml-0.5`}
          animate={inView ? { scale: [1, 1.3, 1] } : {}}
          transition={{ delay: delay + 0.3, duration: 0.4 }}
        >
          {suffix}
        </motion.span>
      </div>
      <p className="text-xs sm:text-sm font-semibold tracking-wide text-brand-textMuted uppercase">{label}</p>
    </motion.div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className="relative border-y border-white/5 py-8 overflow-hidden bg-brand-dark">
      {/* Animated gradient sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/5 to-transparent pointer-events-none"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <StatItem value={98}  suffix="%" label="ATS Match Rate"       delay={0}   color="text-emerald-400" />
          <StatItem value={1.2} suffix="M+" label="Resumes Optimized"   delay={0.1} color="text-brand-lightBlue" />
          <StatItem value={42}  suffix="%" label="Higher Callback Rate"  delay={0.2} color="text-violet-400" />
          <StatItem value={10}  suffix="x" label="Faster Application"   delay={0.3} color="text-amber-400" />
        </div>
      </div>
    </div>
  )
}
