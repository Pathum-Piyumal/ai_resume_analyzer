import { useState, useEffect } from 'react'
import { 
  FileText, 
  Target, 
  Star, 
  TrendingUp,
  Award,
  ArrowRight,
  Plus,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Briefcase
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'
import { api, DashboardStats } from '../utils/api'

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
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; score: number; date: string } | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats()
        setStats(data)
      } catch (err) {
        console.error("Failed to load dashboard statistics", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  // --- SVG Chart Calculations ---
  const renderAreaChart = () => {
    if (!stats || stats.match_history.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 border border-white/5 border-dashed rounded-xl bg-slate-900/10 p-6 text-center">
          <TrendingUp className="h-8 w-8 text-slate-600 mb-2" />
          <p className="text-xs text-brand-textMuted font-sans">No analysis history yet to chart. Run your first analysis to see progress!</p>
        </div>
      )
    }

    const history = stats.match_history
    const chartHeight = 160
    const chartWidth = 500
    const padding = 25
    
    // Map points
    const points = history.map((pt, idx) => {
      const x = padding + (idx / Math.max(1, history.length - 1)) * (chartWidth - padding * 2)
      // Map score 0-100 to height (inverting y axis so high scores are high up)
      const y = chartHeight - padding - (pt.match_score / 100) * (chartHeight - padding * 2)
      return { x, y, score: pt.match_score, date: new Date(pt.scanned_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) }
    })

    // Construct SVG path for area fill
    let pathD = ""
    let areaD = ""
    if (points.length === 1) {
      // Single point fallback: draw straight line
      const pt = points[0]
      pathD = `M ${padding} ${pt.y} L ${chartWidth - padding} ${pt.y}`
      areaD = `M ${padding} ${pt.y} L ${chartWidth - padding} ${pt.y} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`
    } else {
      pathD = `M ${points[0].x} ${points[0].y} `
      for (let i = 1; i < points.length; i++) {
        pathD += `L ${points[i].x} ${points[i].y} `
      }
      areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    }

    return (
      <div className="relative w-full overflow-visible">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            {/* Area Gradient */}
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
            </linearGradient>
            {/* Line Gradient */}
            <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal helper indicators) */}
          <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />

          {/* Fill Area */}
          <path d={areaD} fill="url(#chart-area-grad)" />

          {/* Stroke Path */}
          <path d={pathD} fill="none" stroke="url(#chart-line-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points / Interactivity */}
          {points.map((pt, idx) => (
            <g key={idx}>
              {/* Invisible interactive trigger circle */}
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r="10" 
                fill="transparent" 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Visible Data Dot */}
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r="4.5" 
                fill="#0f1225" 
                stroke="#60a5fa" 
                strokeWidth="2.5"
                className="transition-transform duration-150 hover:scale-125"
              />
            </g>
          ))}

          {/* Hover highlight circle */}
          {hoveredPoint && (
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="8" fill="rgba(96, 165, 250, 0.15)" stroke="#60a5fa" strokeWidth="1.5" pointerEvents="none" />
          )}
        </svg>

        {/* Dynamic HTML Tooltip overlay */}
        {hoveredPoint && (
          <div 
            className="absolute z-20 bg-slate-950/90 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] font-sans text-white shadow-2xl pointer-events-none transition-all duration-100"
            style={{ 
              left: `${(hoveredPoint.x / chartWidth) * 100}%`,
              top: `${(hoveredPoint.y / chartHeight) * 100 - 32}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-bold text-brand-lightBlue">{hoveredPoint.score}% Match</div>
            <div className="text-[8px] text-slate-400 mt-0.5">{hoveredPoint.date}</div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
        <p className="text-xs text-brand-textMuted font-sans">Compiling analytical metrics dashboard...</p>
      </div>
    )
  }

  // Determine aggregate comparisons or values
  const hasHistory = stats && stats.total_scans > 0
  const avgScore = hasHistory ? Math.round(stats.avg_score) : 0
  
  // Calculate relative trend direction based on last two scans
  let scoreTrend: 'up' | 'down' | 'flat' = 'flat'
  let scoreDiff = 0
  if (stats && stats.match_history.length >= 2) {
    const len = stats.match_history.length
    const latest = stats.match_history[len - 1].match_score
    const prev = stats.match_history[len - 2].match_score
    scoreDiff = Math.round(latest - prev)
    if (scoreDiff > 0) scoreTrend = 'up'
    else if (scoreDiff < 0) scoreTrend = 'down'
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
          Overview
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Here's a comprehensive live overview of your job matching analytics.
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
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.07), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-sans mb-1 block">
                TOTAL RESUME SCANS
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={stats?.total_scans || 0} />
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
                {scoreTrend !== 'flat' && (
                  <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1 rounded ${scoreTrend === 'up' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                    {scoreTrend === 'up' ? <TrendingUp className="h-2 w-2" /> : <TrendingDown className="h-2 w-2" />}
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={avgScore} suffix="%" />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Star className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 3: Skills Matched */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden transition-colors hover:border-white/10"
        >
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
              <NumberTicker value={stats?.total_skills_matched || 0} />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Target className="h-5 w-5" />
          </div>
        </motion.div>

      </motion.div>

      {/* 3. Progress Area Chart Card */}
      <motion.div 
        variants={itemVariants}
        className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-white font-sans">ATS Score Progress</h3>
            <p className="text-[10px] text-brand-textMuted font-sans">Visual trend mapping of matching score growth over time</p>
          </div>
        </div>
        {renderAreaChart()}
      </motion.div>

      {/* 4. Skills Gaps & Application Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Widget 1: Skills Gap Aggregates */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-white font-sans mb-1">Top Skills Analytics</h3>
            <p className="text-[10px] text-brand-textMuted font-sans mb-6">Aggregated analysis of strengths and gaps across all resume scans</p>
            
            {hasHistory ? (
              <div className="space-y-6">
                {/* Strengths */}
                <div className="space-y-2.5 text-left">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Top Strengths</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stats?.skills_gap.top_strengths.length ? (
                      stats.skills_gap.top_strengths.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500 italic font-sans font-light">No matching skills recorded yet.</span>
                    )}
                  </div>
                </div>

                {/* Gaps */}
                <div className="space-y-2.5 text-left">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    <span>Top Missing Gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stats?.skills_gap.top_gaps.length ? (
                      stats.skills_gap.top_gaps.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-amber-500/10 text-[9px] font-bold text-amber-400 border border-amber-500/20">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500 italic font-sans font-light">No missing skills recorded. Excellent job!</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                <Target className="h-7 w-7 mb-2 text-slate-700" />
                <span className="text-[10px]">No skill analysis metrics available.</span>
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-white/5">
            <button 
              onClick={onViewInsights}
              className="w-full flex items-center justify-between text-[11px] font-bold text-brand-lightBlue hover:text-white transition-colors group focus:outline-none"
            >
              <span>Explore full career progression insights</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Widget 2: Jobs Application Pipeline status */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white font-sans">Application Pipeline</h3>
              <Briefcase className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-[10px] text-brand-textMuted font-sans mb-6">Status pipeline tracking of bookmarked jobs</p>

            <div className="space-y-4">
              {[
                { label: 'Saved Bookmarks', count: stats?.pipeline.saved || 0, color: 'bg-slate-600', valKey: 'saved' },
                { label: 'Applied', count: stats?.pipeline.applied || 0, color: 'bg-brand-blue', valKey: 'applied' },
                { label: 'Interviewing', count: stats?.pipeline.interviewing || 0, color: 'bg-amber-500', valKey: 'interviewing' },
                { label: 'Offer Received', count: stats?.pipeline.offer || 0, color: 'bg-emerald-500', valKey: 'offer' },
                { label: 'Rejected', count: stats?.pipeline.rejected || 0, color: 'bg-rose-500', valKey: 'rejected' }
              ].map((stage, idx) => {
                // calculate simple pipeline ratio
                const totalJobs = Object.values(stats?.pipeline || {}).reduce((a, b) => a + b, 0)
                const widthPercent = totalJobs > 0 ? (stage.count / totalJobs) * 100 : 0
                return (
                  <div key={idx} className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-300 font-sans">
                      <span>{stage.label}</span>
                      <span className="font-mono font-bold text-white">{stage.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5">
            <button 
              onClick={onNewAnalysis}
              className="w-full flex items-center justify-between text-[11px] font-bold text-brand-lightBlue hover:text-white transition-colors group focus:outline-none"
            >
              <span>Manage saved jobs & bookmarked listings</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 5. Quick Actions Row */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
      >
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
        >
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
              Upload a new resume and target job description to run a real-time compatibility scan.
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

      {/* Floating Plus button */}
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
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue hover:bg-blue-600 text-white shadow-xl shadow-brand-blue/30 transition-shadow duration-200 focus:outline-none"
          title="New Analysis"
          type="button"
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.button>
      </motion.div>

    </motion.div>
  )
}
