import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, BookOpen, Zap, Shield, TrendingUp } from 'lucide-react'
import dashboardMockup from '../../src/assets/dashboard_mockup.png'

interface HeroSectionProps {
  onNavigate?: (view: 'landing' | 'analyze') => void
}

const ROLES = [
  'Product Manager',
  'Software Engineer',
  'UX Designer',
  'Data Scientist',
  'Marketing Lead',
  'DevOps Engineer',
]

const HEADLINE_LINE1 = 'Unlock Your Career Potential'.split(' ')
const HEADLINE_LINE2 = ['with']

const wordVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

function Particle({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, backgroundColor: color }}
      animate={{ y: [0, -18, 0], opacity: [0.15, 0.45, 0.15], scale: [1, 1.3, 1] }}
      transition={{ duration: 3.5 + delay * 0.8, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

const PARTICLES = [
  { x: '8%',  y: '25%', size: 4, delay: 0,    color: '#60A5FA' },
  { x: '15%', y: '65%', size: 3, delay: 0.8,  color: '#818CF8' },
  { x: '78%', y: '20%', size: 5, delay: 1.2,  color: '#60A5FA' },
  { x: '88%', y: '55%', size: 3, delay: 0.4,  color: '#A78BFA' },
  { x: '22%', y: '80%', size: 4, delay: 1.6,  color: '#34D399' },
  { x: '65%', y: '75%', size: 3, delay: 0.9,  color: '#818CF8' },
  { x: '45%', y: '12%', size: 3, delay: 2.0,  color: '#60A5FA' },
  { x: '92%', y: '30%', size: 4, delay: 1.4,  color: '#34D399' },
]

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const mockupY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(id)
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-brand-dark">
      {/* Aurora glows */}
      <motion.div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 -z-10 h-[520px] w-[820px] rounded-full bg-brand-blue/12 blur-[130px] pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[20%] left-[5%] -z-10 h-[260px] w-[320px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none"
        animate={{ x: [0, 20, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-[30%] right-[5%] -z-10 h-[220px] w-[280px] rounded-full bg-emerald-500/6 blur-[90px] pointer-events-none"
        animate={{ x: [0, -15, 0], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      />

      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/8 px-4 py-2 text-xs font-semibold text-brand-lightBlue shadow-lg shadow-brand-blue/10 mb-8 backdrop-blur-sm"
        >
          <motion.span
            className="flex h-1.5 w-1.5 rounded-full bg-brand-lightBlue"
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <Sparkles className="h-3 w-3" />
          <span>Powered by GPT-4 · ATS Optimized · Trusted by 50k+ users</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-[64px] font-sans leading-[1.05] mb-5 text-brand-textPrimary"
        >
          <span className="block">
            {HEADLINE_LINE1.map((word, i) => (
              <motion.span key={word + i} custom={i} variants={wordVariants as any} className="inline-block mr-[0.28em]">
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block mt-1">
            {HEADLINE_LINE2.map((word, i) => (
              <motion.span key={word} custom={HEADLINE_LINE1.length + i} variants={wordVariants as any} className="inline-block mr-[0.28em]">
                {word}
              </motion.span>
            ))}
            <motion.span custom={HEADLINE_LINE1.length + HEADLINE_LINE2.length} variants={wordVariants as any} className="inline-block relative">
              <span className="bg-gradient-to-r from-brand-blue via-violet-400 to-brand-lightBlue bg-clip-text text-transparent">AI</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              />
            </motion.span>
          </span>
        </motion.h1>

        {/* Cycling roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6 text-sm sm:text-base font-medium text-brand-textMuted"
        >
          <span>Perfect for</span>
          <span className="inline-flex items-center h-7 overflow-hidden relative w-40 sm:w-48">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ y: 22, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -22, opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="absolute left-0 font-bold whitespace-nowrap"
              >
                <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                  {ROLES[roleIndex]}
                </span>
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.55, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-brand-textMuted font-sans font-light leading-relaxed mb-10"
        >
          Professional resume analysis and ATS optimization at your fingertips.{' '}
          Stand out to recruiters with <span className="font-medium text-brand-textPrimary">data-driven insights</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          {/* Primary */}
          <motion.button
            onClick={() => onNavigate?.('analyze')}
            whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(37,99,235,0.45)' }}
            whileTap={{ scale: 0.97 }}
            className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/25 transition-all duration-200 relative overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
            <Zap className="h-4 w-4 shrink-0" />
            <span>Analyze My Resume</span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>

          {/* Secondary — "Explore Features" replacing "Watch Demo" */}
          <motion.button
            onClick={() => {
              const el = document.getElementById('solutions')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-blue/40 px-8 py-3.5 text-sm font-bold backdrop-blur-sm transition-all duration-200 text-brand-textMuted"
          >
            <BookOpen className="h-4 w-4 shrink-0 text-brand-lightBlue group-hover:scale-110 transition-transform duration-200" />
            <span>Explore Features</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-brand-lightBlue text-base leading-none"
            >↓</motion.span>
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-16 text-xs text-brand-textMuted"
        >
          {[
            { icon: Shield, label: 'Privacy First' },
            { icon: TrendingUp, label: '94% ATS Pass Rate' },
            { icon: Zap, label: 'Results in < 30s' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-brand-lightBlue" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ y: mockupY, opacity: mockupOpacity }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-brand-blue/20 blur-2xl rounded-full pointer-events-none" />
          <div className="relative rounded-2xl border border-white/10 bg-brand-card/40 p-2 backdrop-blur-sm shadow-[0_24px_80px_rgba(0,0,0,0.55)] overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <span className="mx-auto text-[10px] text-slate-500 font-mono tracking-wide">resumeiq.ai/dashboard</span>
            </div>
            <img src={dashboardMockup} alt="ResumeIQ Dashboard" className="w-full rounded-b-xl border border-white/5 object-cover object-top" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-brand-dark/60 to-transparent rounded-b-2xl pointer-events-none" />
            <motion.div
              className="absolute top-16 right-6 rounded-xl border border-white/10 bg-brand-card/80 backdrop-blur-md px-3 py-2 shadow-xl text-left hidden sm:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
            >
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium mb-1">ATS Score</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold text-emerald-400 leading-none">92</span>
                <span className="text-xs text-slate-400 mb-0.5">/ 100</span>
              </div>
              <div className="mt-1.5 h-1 w-24 bg-slate-700 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ delay: 2.5, duration: 1, ease: 'easeOut' }} />
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-6 rounded-xl border border-white/10 bg-brand-card/80 backdrop-blur-md px-3 py-2 shadow-xl text-left hidden sm:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.4, duration: 0.5 }}
            >
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium mb-1">Skills Matched</p>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-brand-lightBlue leading-none">14</span>
                <span className="text-xs text-slate-400">/ 18 required</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
