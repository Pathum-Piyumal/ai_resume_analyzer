import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'

interface CTASectionProps {
  onNavigate?: (view: 'landing' | 'analyze') => void
}

const STEPS = [
  { label: 'Upload your resume' },
  { label: 'Paste the job description' },
  { label: 'Get your ATS score instantly' },
]

export default function CTASection({ onNavigate }: CTASectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-brand-dark">
      {/* Background aurora */}
      <motion.div
        className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/70 via-indigo-950/60 to-brand-dark px-6 py-16 sm:px-16 md:py-20 lg:px-24 backdrop-blur-md shadow-2xl text-center"
        >
          {/* Animated border shimmer */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, transparent 0%, rgba(37,99,235,0.12) 40%, transparent 80%)',
            }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner glow corners */}
          <div className="absolute top-0 left-0 h-48 w-48 bg-brand-blue/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 h-48 w-48 bg-violet-600/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-lightBlue mb-6"
          >
            <Sparkles className="h-3 w-3" />
            <span>Free to start — no credit card required</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl font-sans mb-4 text-brand-textPrimary"
          >
            Ready to land your{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-lightBlue bg-clip-text text-transparent">
              dream job?
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="mx-auto max-w-xl text-sm sm:text-base text-brand-textMuted font-sans font-light leading-relaxed mb-8"
          >
            Join over 100,000 professionals who have optimized their resumes with ResumeIQ.
          </motion.p>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.38, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-sm text-brand-textMuted"
          >
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{step.label}</span>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600 hidden sm:block shrink-0" />
                )}
              </div>
            ))}
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => onNavigate?.('analyze')}
              whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(37,99,235,0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-blue hover:bg-blue-700 text-white px-10 py-4 text-sm font-bold shadow-lg shadow-brand-blue/25 transition-all duration-200 relative overflow-hidden"
            >
              {/* Shine sweep */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <span>Start Your Free Analysis</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
