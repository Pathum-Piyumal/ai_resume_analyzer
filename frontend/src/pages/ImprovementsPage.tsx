import { useState } from 'react'
import { Clock, Sliders, CheckCircle2, Sparkles, BrainCircuit } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'

// Subcomponent: Glowing Neural Network SVG
function NeuralNetworkGraphic() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0C0F1E]/40 p-4 h-32 flex items-center justify-center relative overflow-hidden">
      {/* Absolute grid and glowing nodes */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(37,99,235,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
      
      <svg className="w-full h-full opacity-60 relative z-10" viewBox="0 0 300 100">
        {/* Connection Lines */}
        <line x1="50" y1="50" x2="100" y2="30" className="stroke-brand-blue/30" strokeWidth="1" />
        <line x1="50" y1="50" x2="100" y2="70" className="stroke-brand-blue/30" strokeWidth="1" />
        <line x1="100" y1="30" x2="180" y2="30" className="stroke-brand-blue/30" strokeWidth="1" />
        <line x1="100" y1="70" x2="180" y2="70" className="stroke-brand-blue/30" strokeWidth="1" />
        <line x1="180" y1="30" x2="250" y2="50" className="stroke-indigo-500/30" strokeWidth="1" />
        <line x1="180" y1="70" x2="250" y2="50" className="stroke-indigo-500/30" strokeWidth="1" />
        <line x1="100" y1="30" x2="180" y2="70" className="stroke-brand-blue/20" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Glowing Nodes */}
        <circle cx="50" cy="50" r="4" className="fill-brand-blue animate-pulse" />
        <circle cx="100" cy="30" r="3" className="fill-brand-lightBlue" />
        <circle cx="100" cy="70" r="3" className="fill-brand-lightBlue" />
        <circle cx="180" cy="30" r="3" className="fill-indigo-400" />
        <circle cx="180" cy="70" r="3" className="fill-indigo-400" />
        <circle cx="250" cy="50" r="5" className="fill-indigo-500 animate-pulse" />
      </svg>
    </div>
  )
}

interface ImprovementsPageProps {
  analysisResult?: any
  onNewAnalysis?: () => void
}

export default function ImprovementsPage({ analysisResult, onNewAnalysis }: ImprovementsPageProps) {
  const [appliedRecs, setAppliedRecs] = useState<number[]>([])
  const [appliedKeywords, setAppliedKeywords] = useState<string[]>([])

  if (!analysisResult) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center space-y-6 rounded-2xl border border-white/5 bg-brand-card/45 p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute inset-0 bg-[radial-gradient(180px circle at 50% 50%, rgba(245,158,11,0.05), transparent 85%)]" />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/5 text-brand-lightBlue border border-brand-blue/10 relative z-10">
          <BrainCircuit className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-extrabold text-white tracking-tight font-sans">
            No Active Optimizations
          </h3>
          <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed font-sans font-light">
            Analyze your resume and job description to view dynamic optimization suggestions, bullet point rewrites, and missing keywords.
          </p>
        </div>
        <div className="pt-2 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewAnalysis}
            className="rounded-xl bg-brand-blue px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-blue/20 transition-all focus:outline-none"
          >
            Start Analysis
          </motion.button>
        </div>
      </div>
    )
  }

  const recommendations: any[] = [];

  // 1. Add formatting issues
  (analysisResult.formatting_issues || []).forEach((issue: string, idx: number) => {
    recommendations.push({
      id: idx + 1,
      title: "Formatting & Style Optimization",
      tag: "HIGH PRIORITY",
      tagColor: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      desc: issue,
      actionText: "Fix Layout"
    })
  });

  // 2. Add bullet point recommendations
  (analysisResult.bullet_points_improvements || []).forEach((bullet: any, idx: number) => {
    recommendations.push({
      id: idx + 100,
      title: "Strengthen Bullet Point Achievement",
      tag: "MEDIUM PRIORITY",
      tagColor: "bg-brand-blue/10 border-brand-blue/20 text-brand-lightBlue",
      desc: `Before: "${bullet.before}" | Proposed Rewrite: "${bullet.after}"`,
      actionText: "Accept Rewrite"
    })
  })

  const keywords: string[] = analysisResult.missing_skills || []

  const handleApplyKeyword = (kw: string) => {
    if (appliedKeywords.includes(kw)) {
      setAppliedKeywords(prev => prev.filter(k => k !== kw))
    } else {
      setAppliedKeywords(prev => [...prev, kw])
    }
  }

  const getRelativeTime = (isoString: string) => {
    if (!isoString) return 'recently'
    const scanDate = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - scanDate.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'just now'
    if (diffMins === 1) return '1 minute ago'
    if (diffMins < 60) return `${diffMins} minutes ago`
    
    const diffHours = Math.round(diffMins / 60)
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    
    return scanDate.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})
  }

  const scanTimeText = getRelativeTime(analysisResult.scanned_at)

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

  // --- Dynamic calculations for progress indicator & Circular score gauge ---
  const currentScore = analysisResult ? Math.round(analysisResult.match_score) : 82
  const maxProjectedScore = analysisResult ? Math.min(currentScore + 10, 100) : 94
  const potentialBoost = maxProjectedScore - currentScore

  const totalOptimizations = recommendations.length + keywords.length
  const totalApplied = appliedRecs.length + appliedKeywords.length

  const dynamicScore = totalOptimizations > 0 
    ? Math.min(currentScore + Math.round((totalApplied / totalOptimizations) * potentialBoost), 100)
    : currentScore

  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (dynamicScore / 100) * circumference

  // Dynamic progress sub-indicators
  const keywordsBase = 60
  const keywordsProgress = keywords.length > 0 
    ? Math.min(keywordsBase + Math.round((appliedKeywords.length / keywords.length) * 40), 100)
    : 100

  const formattingIssues = recommendations.filter(r => r.id < 100)
  const appliedFormatting = appliedRecs.filter(id => id < 100)
  const formattingBase = 70
  const formattingProgress = formattingIssues.length > 0
    ? Math.min(formattingBase + Math.round((appliedFormatting.length / formattingIssues.length) * 30), 100)
    : 100

  const bulletIssues = recommendations.filter(r => r.id >= 100)
  const appliedBullets = appliedRecs.filter(id => id >= 100)
  const impactBase = 50
  const impactProgress = bulletIssues.length > 0
    ? Math.min(impactBase + Math.round((appliedBullets.length / bulletIssues.length) * 50), 100)
    : 100

  const isAllApplied = totalApplied === totalOptimizations && totalOptimizations > 0

  const handleApplyAllToggle = () => {
    if (isAllApplied) {
      setAppliedKeywords([])
      setAppliedRecs([])
    } else {
      setAppliedKeywords(keywords)
      setAppliedRecs(recommendations.map(r => r.id))
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 text-left relative min-h-[80vh]"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-brand-blue/5 blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-12 left-1/4 h-80 w-80 rounded-full bg-indigo-500/5 blur-[95px] pointer-events-none z-0" />

      {/* 1. Top Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mb-1.5">
            Suggestions & Improvement
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted font-sans font-light">
            AI-driven optimizations to increase your interview success rate.
          </p>
        </div>
        
        {/* Time Stamp Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121626] border border-white/5 text-[10px] text-brand-textMuted font-medium self-start sm:self-auto select-none">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          <span>Last analyzed {scanTimeText}</span>
        </div>
      </motion.div>

      {/* 2. Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative z-10">
        
        {/* Left Side: Recommendations and Keywords (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Actionable Recommendations */}
          <motion.div 
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-5 relative overflow-hidden transition-colors hover:border-white/10"
          >
            {/* Mouse Spotlight */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.04), transparent 80%)'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-brand-lightBlue shrink-0" />
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                    Actionable Recommendations
                  </h3>
                </div>
                <span className="text-[10px] text-brand-textMuted font-sans">
                  {recommendations.length - appliedRecs.length} items pending
                </span>
              </div>

              {/* List entries */}
              <div className="space-y-4 pt-4">
                {recommendations.map((item) => {
                  const isApplied = appliedRecs.includes(item.id)
                  return (
                    <div 
                      key={item.id} 
                      className={`rounded-xl border p-5 space-y-3 transition-colors ${
                        isApplied 
                          ? 'border-emerald-500/30 bg-emerald-500/5' 
                          : 'border-white/5 bg-[#121626]/50 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                          {item.title}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border tracking-wider select-none shrink-0 ${
                          isApplied 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : item.tagColor
                        }`}>
                          {isApplied ? 'APPLIED' : item.tag}
                        </span>
                      </div>
                      
                      <p className={`text-[11px] leading-relaxed font-sans font-light transition-colors ${
                        isApplied ? 'text-slate-400 line-through opacity-60' : 'text-brand-textMuted'
                      }`}>
                        {item.desc}
                      </p>

                      <div className="flex items-center gap-4 pt-1">
                        <button
                          onClick={() => {
                            if (isApplied) {
                              setAppliedRecs(prev => prev.filter(id => id !== item.id))
                            } else {
                              setAppliedRecs(prev => [...prev, item.id])
                            }
                          }}
                          className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-[10px] font-bold transition-all active:scale-[0.98] focus:outline-none ${
                            isApplied 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-[#1D243F] border-white/5 hover:border-brand-blue/30 text-slate-300 hover:text-white'
                          }`}
                          type="button"
                        >
                          {isApplied ? 'Undo Optimization' : item.actionText}
                        </button>
                        {item.id === 1 && !isApplied && (
                          <button 
                            className="text-[10px] text-brand-textMuted hover:text-slate-300 font-semibold transition-colors focus:outline-none"
                            type="button"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Card: Add These Keywords */}
          <motion.div 
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 relative overflow-hidden transition-colors hover:border-white/10"
          >
            {/* Mouse Spotlight */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.04), transparent 80%)'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-brand-lightBlue shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  Add These Keywords
                </h3>
              </div>
              <p className="text-[11px] text-brand-textMuted leading-relaxed font-sans font-light max-w-2xl mb-4">
                These industry-standard terms were found in your target job descriptions but are missing from your profile. Click to add them:
              </p>

              {/* Keyword badges wrapper */}
              <div className="flex flex-wrap gap-2.5">
                {keywords.map((kw, index) => {
                  const isAdded = appliedKeywords.includes(kw)
                  return (
                    <button
                      key={index}
                      onClick={() => handleApplyKeyword(kw)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 select-none focus:outline-none ${
                        isAdded 
                          ? 'bg-brand-blue/15 border-brand-blue/30 text-brand-lightBlue shadow-lg shadow-brand-blue/5' 
                          : 'border-white/10 hover:border-white/20 text-slate-300 hover:text-white bg-[#121626]'
                      }`}
                      type="button"
                    >
                      <span>{kw}</span>
                      {isAdded ? (
                        <CheckCircle2 className="h-3 w-3 text-brand-lightBlue" />
                      ) : (
                        <span className="text-[10px] text-brand-textMuted shrink-0">+</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Side: Score Impact and Insights (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card: Score Impact */}
          <motion.div 
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left space-y-5 relative overflow-hidden transition-colors hover:border-white/10"
          >
            {/* Mouse Spotlight */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
              }}
            />
            
            <div className="relative z-10 flex flex-col space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-0.5">
                  Score Impact
                </h3>
                <p className="text-[10px] text-brand-textMuted font-sans">
                  Projected compatibility match after optimization
                </p>
              </div>

              {/* Projected Gauge Progress */}
              <div className="relative flex items-center justify-center py-2">
                {/* Glow filter behind circle */}
                <div className="absolute inset-0 rounded-full blur-2xl opacity-15 bg-brand-blue" />
                
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={radius}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className="stroke-brand-lightBlue"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
                    <NumberTicker value={dynamicScore} suffix="%" />
                  </span>
                  <span className="text-[9px] text-brand-textMuted font-semibold uppercase tracking-wider mt-0.5 select-none">
                    {totalApplied === totalOptimizations && totalOptimizations > 0 
                      ? 'OPTIMIZED' 
                      : totalApplied > 0 
                        ? 'OPTIMIZING' 
                        : 'CURRENT'}
                  </span>
                </div>
              </div>

              {/* Split Comparison Matrix */}
              <div className="grid grid-cols-2 gap-3 border-y border-white/5 py-4">
                <div className="text-center border-r border-white/5 py-1">
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest font-sans mb-1">
                    CURRENT MATCH
                  </p>
                  <p className="text-sm font-extrabold text-slate-300 font-sans">
                    <NumberTicker value={currentScore} suffix="%" />
                  </p>
                </div>
                <div className="text-center py-1">
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest font-sans mb-1">
                    POTENTIAL MATCH
                  </p>
                  <p className="text-sm font-extrabold text-emerald-400 font-sans">
                    {maxProjectedScore}%
                  </p>
                </div>
              </div>

              {/* Progress indicators */}
              <div className="space-y-3 pt-1">
                {/* Keywords */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span className="font-sans">Keywords</span>
                    <span className="font-mono text-brand-lightBlue">
                      <NumberTicker value={keywordsProgress} suffix="%" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-brand-lightBlue rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${keywordsProgress}%` }} 
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Formatting */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span className="font-sans">Formatting</span>
                    <span className="font-mono text-brand-lightBlue">
                      <NumberTicker value={formattingProgress} suffix="%" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-brand-lightBlue rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${formattingProgress}%` }} 
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Impact Phrases */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300">
                    <span className="font-sans">Impact Phrases</span>
                    <span className="font-mono text-amber-500">
                      <NumberTicker value={impactProgress} suffix="%" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-amber-500 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${impactProgress}%` }} 
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA Apply button */}
              <div className="pt-2">
                <button
                  onClick={handleApplyAllToggle}
                  className={`w-full text-center rounded-xl py-3 text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 focus:outline-none ${
                    isAllApplied 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/15'
                      : 'bg-brand-blue hover:bg-blue-600 text-white shadow-lg shadow-brand-blue/15'
                  }`}
                  type="button"
                >
                  <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
                  <span>{isAllApplied ? 'Reset All Optimizations' : 'Apply All Optimization'}</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card: AI Insights Engine */}
          <motion.div 
            variants={itemVariants}
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl text-left space-y-3.5"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-white font-sans">
              <BrainCircuit className="h-5 w-5 text-brand-lightBlue animate-pulse" />
              <span>AI Insights Engine</span>
            </div>
            
            <p className="text-[10px] text-brand-textMuted leading-relaxed font-sans font-light">
              Our models simulate 50+ ATS screening algorithms to provide prioritized recommendations.
            </p>

            <NeuralNetworkGraphic />
          </motion.div>

        </div>

      </div>

    </motion.div>
  )
}
