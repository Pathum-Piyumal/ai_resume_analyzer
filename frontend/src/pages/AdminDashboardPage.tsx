import { 
  Users, 
  FileText, 
  Star, 
  Activity, 
  TrendingUp, 
  Cpu, 
  FileTerminal,
  Plus,
  Download,
  MoreVertical
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'

interface AdminDashboardPageProps {
  onNewAnalysis: () => void
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

export default function AdminDashboardPage({ onNewAnalysis }: AdminDashboardPageProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  // Mock recent analyses database
  const recentAnalyses = [
    {
      id: '1',
      userName: "Alex Rivera",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      fileName: "Alex_Rivera_CV.pdf",
      jobTitle: "Senior Dev",
      score: 85,
      date: "Oct 24, 2024"
    },
    {
      id: '2',
      userName: "Sophia Chen",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      fileName: "sophia_resume.pdf",
      jobTitle: "UX Designer",
      score: 72,
      date: "Oct 23, 2024"
    },
    {
      id: '3',
      userName: "Marcus Vance",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      fileName: "mv_product_manager.pdf",
      jobTitle: "Product Manager",
      score: 68,
      date: "Oct 22, 2024"
    }
  ]

  // Score bar helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  const getScoreText = (score: number) => {
    if (score >= 80) return 'text-emerald-400 font-mono font-semibold'
    if (score >= 60) return 'text-amber-400 font-mono font-semibold'
    return 'text-rose-400 font-mono font-semibold'
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
      </motion.div>

      {/* 2. Top Summary Metrics Row (4 Cards) */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        
        {/* Card 1: Total Users */}
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
                  TOTAL USERS
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                  <TrendingUp className="h-2 w-2" />
                  +12%
                </span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={12450} />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Users className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 2: Resumes Analyzed */}
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
                  RESUMES ANALYZED
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                  <TrendingUp className="h-2 w-2" />
                  +8.4%
                </span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={45200} />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <FileText className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 3: Avg Match Score */}
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
                AVG MATCH SCORE
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={68} suffix="%" />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Star className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Card 4: System Status */}
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
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.07), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <div className="flex items-center gap-1.5 mb-1 select-none">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                  SYSTEM STATUS
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-400 tracking-wider">Live</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight leading-none font-sans">
              ONLINE
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
        </motion.div>

      </motion.div>

      {/* 3. Mid Row Grid (Weekly Analysis Trends & AI Status) */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        
        {/* Weekly Analysis Trends Card (Span 2) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.005, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group lg:col-span-2 rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-6 transition-colors hover:border-white/10 relative overflow-hidden"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.04), transparent 80%)'
            }}
          />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-0.5">
                Weekly Analysis Trends
              </h3>
              <p className="text-[10px] text-brand-textMuted font-sans">
                Number of resumes processed per day
              </p>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-brand-textMuted select-none">
              <button className="px-2 py-1 hover:text-white rounded border border-transparent bg-white/5 text-white">W</button>
              <button className="px-2 py-1 hover:text-white rounded border border-transparent">M</button>
              <button className="px-2 py-1 hover:text-white rounded border border-transparent">All</button>
            </div>
          </div>

          {/* SVG line area chart */}
          <div className="h-44 flex items-center justify-center relative overflow-hidden pt-2 z-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />
            
            <svg className="w-full h-full opacity-70 relative z-10" viewBox="0 0 500 120">
              <defs>
                <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <motion.path
                d="M 20 100 Q 80 90 140 60 T 260 40 T 380 65 T 480 50 L 480 100 Z"
                fill="url(#trendGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              {/* Horizontal grid guide */}
              <line x1="20" y1="100" x2="480" y2="100" className="stroke-white/10" strokeWidth="1" />
              
              {/* Curve chart */}
              <motion.path
                d="M 20 100 Q 80 90 140 60 T 260 40 T 380 65 T 480 50"
                fill="none"
                className="stroke-brand-lightBlue"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
              />
              
              {/* Pulsing focal nodes */}
              <circle cx="260" cy="40" r="3" className="fill-brand-lightBlue animate-pulse" />
              <circle cx="480" cy="50" r="3" className="fill-brand-lightBlue animate-pulse" />
            </svg>
          </div>

          {/* X axis labels */}
          <div className="flex justify-between px-3 text-[9px] text-brand-textMuted font-sans relative z-10">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>

        {/* AI Status Monitoring Card (Span 1) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.005, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group lg:col-span-1 rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left flex flex-col justify-between space-y-6 transition-colors hover:border-white/10 relative overflow-hidden"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(260px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
            }}
          />
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white font-sans">
              <Cpu className="h-4.5 w-4.5 text-brand-lightBlue animate-pulse" />
              <span>AI Status</span>
            </div>
            
            <p className="text-[11px] text-brand-textMuted leading-relaxed font-sans font-light">
              System performance is optimal. AI models processed <span className="text-white font-semibold"><NumberTicker value={1240} /></span> requests in the last hour with an average latency of <span className="text-brand-lightBlue font-mono"><NumberTicker value={240} suffix="ms" /></span>.
            </p>
          </div>

          {/* CPU monitoring progress bar */}
          <div className="space-y-2 pt-2 border-t border-white/5 relative z-10">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
              <span className="font-sans">CPU Load</span>
              <span className="font-mono text-brand-lightBlue"><NumberTicker value={43} suffix="%" /></span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-brand-lightBlue rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: "43%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>

          {/* Button trigger */}
          <div className="pt-2 relative z-10">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full text-center rounded-xl border border-white/10 hover:border-white/20 bg-[#121626] hover:bg-slate-800/40 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
              type="button"
            >
              <FileTerminal className="h-3.5 w-3.5 text-brand-lightBlue" />
              <span>View System Logs</span>
            </motion.button>
          </div>
        </motion.div>

      </motion.div>

      {/* 4. Bottom Table Card: Recent Analyses */}
      <motion.div 
        variants={itemVariants}
        className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4"
      >
        
        {/* Table Header actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans">
            Recent Analyses
          </h3>
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-[#121626] hover:bg-slate-800/40 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all self-start sm:self-auto"
            type="button"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </motion.button>
        </div>

        {/* Table Viewport */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="pb-3 font-semibold">USER</th>
                <th className="pb-3 font-semibold">RESUME NAME</th>
                <th className="pb-3 font-semibold">JOB TITLE</th>
                <th className="pb-3 font-semibold">SCORE</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {recentAnalyses.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  {/* User Profile column */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.userAvatar}
                        alt={row.userName}
                        className="h-8 w-8 rounded-full border border-white/5 shrink-0"
                      />
                      <span className="font-bold text-white font-sans">{row.userName}</span>
                    </div>
                  </td>
                  
                  {/* Resume name column */}
                  <td className="py-3.5 pr-4 text-brand-textMuted font-mono select-all">
                    {row.fileName}
                  </td>
                  
                  {/* Job title column */}
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300 border border-white/5 select-none">
                      {row.jobTitle}
                    </span>
                  </td>
                  
                  {/* Score column */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3.5 w-40">
                      <div className="h-1.5 flex-grow bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className={`h-full rounded-full ${getScoreColor(row.score)}`} 
                          initial={{ width: 0 }}
                          animate={{ width: `${row.score}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                        />
                      </div>
                      <span className={`w-8 text-right ${getScoreText(row.score)}`}>
                        {row.score}%
                      </span>
                    </div>
                  </td>
                  
                  {/* Date column */}
                  <td className="py-3.5 pr-4 text-brand-textMuted font-sans font-light">
                    {row.date}
                  </td>
                  
                  {/* Action Menu column */}
                  <td className="py-3.5 text-right">
                    <button
                      className="p-1.5 rounded-lg text-brand-textMuted hover:text-white transition-all"
                      type="button"
                    >
                      <MoreVertical className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </motion.div>

      {/* 5. Floating circular Plus button at bottom right */}
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
