import { useState, useEffect } from 'react'
import { 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Eye, 
  Trash2, 
  Code2, 
  Briefcase, 
  PenTool,
  Sparkles,
  Download
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'

export interface HistoryRow {
  id: string
  jobTitle: string
  date: string
  score: number
  fileName: string
  matched: string[]
  missing: string[]
  iconType: 'code' | 'manager' | 'frontend'
  parsed_data?: any
  scanned_at?: string
}

interface HistoryPageProps {
  onViewAnalysis: (row: HistoryRow) => void
  onNewAnalysis: () => void
}

import { api } from '../utils/api'

export default function HistoryPage({ onViewAnalysis, onNewAnalysis }: HistoryPageProps) {
  const [historyRows, setHistoryRows] = useState<HistoryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [firstName, setFirstName] = useState('Job')

  // 1. Fetch scan history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const summaries = await api.getScanHistory()
        const rows = summaries.map((summary) => ({
          id: String(summary.id),
          jobTitle: summary.job_title || summary.file_name.replace('.pdf', '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          date: new Date(summary.scanned_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          score: Math.round(summary.match_score),
          fileName: summary.file_name,
          matched: [],
          missing: [],
          iconType: 'code' as const
        }))
        setHistoryRows(rows)
        
        try {
          const settings = await api.getSettings()
          if (settings.first_name) {
            setFirstName(settings.first_name)
          }
        } catch (settingsErr) {
          console.error("Failed to load settings in history page", settingsErr)
        }
      } catch (err) {
        console.error("Failed to load history list", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 3

  const handleRowClick = async (row: HistoryRow) => {
    try {
      const detail = await api.getScanDetail(Number(row.id))
      const parsedData = typeof detail.parsed_data === 'string'
        ? JSON.parse(detail.parsed_data)
        : detail.parsed_data

      onViewAnalysis({
        ...row,
        matched: parsedData.matched_skills || parsedData.matched || [],
        missing: parsedData.missing_skills || parsedData.missing || [],
        parsed_data: parsedData,
        scanned_at: detail.scanned_at
      })
    } catch (err) {
      console.error("Failed to load scan details", err)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.deleteScanHistory(Number(id))
      const updatedRows = historyRows.filter(row => row.id !== id)
      setHistoryRows(updatedRows)
      
      // Check if the current page has become empty after deletion, adjust back if needed
      const totalPagesAfterDeletion = Math.ceil(updatedRows.length / itemsPerPage)
      if (currentPage > totalPagesAfterDeletion && totalPagesAfterDeletion > 0) {
        setCurrentPage(totalPagesAfterDeletion)
      }
    } catch (err) {
      console.error("Failed to delete scan from database", err)
    }
  }

  const renderRowIcon = (type: 'code' | 'manager' | 'frontend') => {
    if (type === 'code') {
      return (
        <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-lightBlue shrink-0">
          <Code2 className="h-5 w-5" />
        </div>
      )
    }
    if (type === 'manager') {
      return (
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
      )
    }
    return (
      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
        <PenTool className="h-5 w-5" />
      </div>
    )
  }

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

  // Calculate slice coordinates
  const indexOfLastRow = currentPage * itemsPerPage
  const indexOfFirstRow = indexOfLastRow - itemsPerPage
  const currentRows = historyRows.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.max(1, Math.ceil(historyRows.length / itemsPerPage))

  // Find max score in active rows
  const maxScore = historyRows.length > 0 ? Math.max(...historyRows.map(r => r.score)) : 0
  const latestAnalysisDate = historyRows.length > 0 ? historyRows[0].date : 'No Data'

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 text-left relative min-h-[80vh]"
    >
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-brand-blue/5 blur-[95px] pointer-events-none z-0" />
      <div className="absolute bottom-12 left-1/4 h-80 w-80 rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none z-0" />

      {/* 1. Welcoming Greeting row */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mb-1.5">
            Welcome back, {firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted font-sans font-light">
            Here is a look at your latest resume performance and analysis trends.
          </p>
        </div>
        
        <button 
          className="inline-flex items-center justify-center h-8 px-4 rounded-full border border-white/10 bg-[#121626] text-xs font-bold text-white shadow-md self-start sm:self-auto select-none focus:outline-none"
          type="button"
        >
          All
        </button>
      </motion.div>

      {/* 2. Top Portal Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        
        {/* Metric 1: Total Analyses */}
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
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-sans">
                METRIC
              </span>
              <h4 className="text-xs font-bold text-brand-textMuted font-sans leading-none">
                Total Analyses
              </h4>
            </div>
            <p className="text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              <NumberTicker value={historyRows.length} />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <FileText className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Metric 2: Best Match Score */}
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
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.05), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-sans">
                TOP SCORE
              </span>
              <h4 className="text-xs font-bold text-brand-textMuted font-sans leading-none">
                Best Match Score
              </h4>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 tracking-tight leading-none font-sans">
              <NumberTicker value={maxScore} suffix="%" />
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
        </motion.div>

        {/* Metric 3: Last Analysis */}
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
              background: 'radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
            }}
          />
          <div className="space-y-4 text-left relative z-10">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-sans">
                HISTORY
              </span>
              <h4 className="text-xs font-bold text-brand-textMuted font-sans leading-none">
                Last Analysis
              </h4>
            </div>
            <p className="text-xl font-extrabold text-white tracking-tight leading-none font-sans mt-2">
              {latestAnalysisDate}
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0 relative z-10">
            <Calendar className="h-5 w-5" />
          </div>
        </motion.div>

      </div>

      {/* 3. Main Analysis History Table Card */}
      <motion.div 
        variants={itemVariants}
        onMouseMove={handleMouseMove}
        className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 relative overflow-hidden z-10 hover:border-white/10 transition-colors duration-300"
      >
        {/* Mouse Spotlight */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.02), transparent 80%)'
          }}
        />

        <div className="relative z-10 flex flex-col space-y-4">
          {/* Table Title and Actions bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">
              Analysis History
            </h3>
            
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-[#121626] hover:bg-slate-800/40 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white active:scale-[0.98] transition-all focus:outline-none"
                type="button"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={onNewAnalysis}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue hover:bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg active:scale-[0.98] transition-all focus:outline-none"
                type="button"
              >
                <span>New Analysis</span>
              </button>
            </div>
          </div>

          {/* Table Viewport */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="pb-3 font-semibold">Job Title</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Match Score</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {currentRows.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => handleRowClick(row)}
                    className="group/row cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    {/* Job Title Column */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3 font-bold text-white font-sans tracking-wide">
                        {renderRowIcon(row.iconType)}
                        <span className="truncate max-w-[160px] sm:max-w-xs">{row.jobTitle}</span>
                      </div>
                    </td>
                    
                    {/* Date Column */}
                    <td className="py-4 pr-4 text-brand-textMuted font-sans font-light">
                      {row.date}
                    </td>
                    
                    {/* Match Score Column */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3.5 w-48">
                        <div className="h-1.5 flex-grow bg-slate-800 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            className={`h-full rounded-full ${getScoreColor(row.score)}`} 
                            initial={{ width: 0 }}
                            animate={{ width: `${row.score}%` }} 
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                        <span className={`w-10 text-right ${getScoreText(row.score)}`}>
                          <NumberTicker value={row.score} suffix="%" />
                        </span>
                      </div>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}
                          className="p-1.5 rounded-lg text-brand-textMuted hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                          title="View report"
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(row.id, e)}
                          className="p-1.5 rounded-lg text-brand-textMuted hover:text-rose-400 hover:bg-rose-500/5 transition-all focus:outline-none"
                          title="Delete record"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/5 pt-5 text-[10px] text-brand-textMuted font-sans">
            <p>
              Showing {historyRows.length > 0 ? indexOfFirstRow + 1 : 0} - {Math.min(indexOfLastRow, historyRows.length)} of {historyRows.length} analyses
            </p>
            
            <div className="flex items-center gap-1.5 self-start sm:self-auto select-none">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-6 w-6 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-6 w-6 rounded border flex items-center justify-center font-bold focus:outline-none transition-colors ${
                    currentPage === page 
                      ? 'bg-brand-blue/15 text-brand-lightBlue border-brand-blue/20' 
                      : 'border-white/5 hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-6 w-6 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors focus:outline-none"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Bottom Row Callouts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
        
        {/* Left Column: AI alert card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.005, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group lg:col-span-3 rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl flex flex-col justify-center space-y-3.5 relative overflow-hidden"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white font-sans mb-1.5">
              <Sparkles className="h-5 w-5 text-brand-lightBlue animate-pulse" />
              <span>Resume Optimization AI</span>
            </div>
            <p className="text-[11px] text-brand-textMuted leading-relaxed font-sans font-light">
              Our AI models analyzed your recent career logs and detected that your <span className="text-white font-semibold">"Frontend Developer"</span> analysis is missing critical React performance keywords and Jest testing methodologies.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Glow line charts mock widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.005, transition: { duration: 0.2 } }}
          onMouseMove={handleMouseMove}
          className="group lg:col-span-2 rounded-2xl border border-white/5 bg-brand-card/45 p-4 backdrop-blur-md shadow-xl h-40 flex items-center justify-center relative overflow-hidden transition-colors hover:border-white/10"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(200px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
            }}
          />
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none" />
          
          <svg className="w-full h-full opacity-70 relative z-10" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 10 90 L 40 75 L 80 50 L 120 60 L 160 30 L 190 20 L 190 90 Z"
              fill="url(#areaGlow)"
            />
            {/* Grid Line */}
            <line x1="10" y1="90" x2="190" y2="90" className="stroke-white/10" strokeWidth="1" />
            
            {/* Trending Line Graph */}
            <path
              d="M 10 90 L 40 75 L 80 50 L 120 60 L 160 30 L 190 20"
              fill="none"
              className="stroke-brand-lightBlue"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* Glowing dots */}
            <circle cx="80" cy="50" r="3" className="fill-brand-lightBlue animate-pulse" />
            <circle cx="160" cy="30" r="3" className="fill-brand-lightBlue" />
            <circle cx="190" cy="20" r="4.5" className="fill-brand-lightBlue animate-pulse" />
          </svg>
        </motion.div>

      </div>

    </motion.div>
  )
}
