import { 
  FileText, 
  Target, 
  Star, 
  TrendingUp,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'

interface UserDashboardPageProps {
  onNewAnalysis: () => void
  onViewInsights?: () => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 140, 
      damping: 18 
    } 
  }
}

export default function UserDashboardPage({ onNewAnalysis, onViewInsights }: UserDashboardPageProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 text-left relative min-h-[80vh]"
    >
      
      {/* 1. Header Overview title */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Welcome back, Alex!
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Here's a quick overview of your career progress.
        </p>
      </motion.div>

      {/* 2. Top Summary Metrics Row */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        
        {/* Card 1: Resumes Analyzed */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden transition-colors hover:border-white/10"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.07), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-sans mb-1 block">
                TOTAL ANALYSES
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={12} />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <FileText className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 2: Avg Score */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden transition-colors hover:border-white/10"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.07), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <div className="flex items-center gap-1.5 mb-1 select-none">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                  AVG ATS SCORE
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                  <TrendingUp className="h-2 w-2" />
                  +5%
                </span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={82} suffix="%" />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Star className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 3: Skill Gap */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden transition-colors hover:border-white/10"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.07), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-sans">
                SKILLS MASTERED
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={24} />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Target className="h-5 w-5" />
          </div>
        </motion.div>

      </motion.div>

      {/* 3. Action Cards */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
      >
        
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(37, 99, 235, 0.1), transparent 80%)'
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-brand-lightBlue" />
              <h3 className="text-sm font-bold text-white font-sans">Optimize New Resume</h3>
            </div>
            <p className="text-xs text-brand-textMuted font-sans mb-6">
              Upload a new resume and job description to get instant, AI-driven ATS optimization suggestions.
            </p>
          </div>
          <motion.button 
            onClick={onNewAnalysis}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue hover:bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-brand-blue/15 transition-all"
          >
            <span>Start Analysis</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between transition-colors hover:border-white/10 relative overflow-hidden"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.07), transparent 80%)'
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-sans">Career Path Insights</h3>
            </div>
            <p className="text-xs text-brand-textMuted font-sans mb-6">
              Review your personalized career progression map based on your latest resume data and industry trends.
            </p>
          </div>
          <motion.button 
            onClick={onViewInsights}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-bold text-white transition-all"
          >
            <span>View Insights</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>

      </motion.div>

      {/* Floating Plus */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        className="fixed bottom-6 right-6 z-45"
      >
        <motion.button
          onClick={onNewAnalysis}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue hover:bg-blue-600 text-white shadow-xl shadow-brand-blue/30 transition-shadow duration-200"
          title="New Analysis"
          type="button"
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.button>
      </motion.div>

    </motion.div>
  )
}
