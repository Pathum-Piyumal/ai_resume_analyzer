import { useState } from 'react'
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

export interface HistoryRow {
  id: string
  jobTitle: string
  date: string
  score: number
  fileName: string
  matched: string[]
  missing: string[]
  iconType: 'code' | 'manager' | 'frontend'
}

interface HistoryPageProps {
  onViewAnalysis: (row: HistoryRow) => void
  onNewAnalysis: () => void
}

export default function HistoryPage({ onViewAnalysis, onNewAnalysis }: HistoryPageProps) {
  // Initialize mock history database
  const [historyRows, setHistoryRows] = useState<HistoryRow[]>([
    {
      id: '1',
      jobTitle: "Senior Software Engineer",
      date: "Oct 24, 2024",
      score: 82,
      fileName: "resume_v2_final.pdf",
      matched: ["Python", "React", "AWS", "Agile", "TypeScript", "PostgreSQL", "Node.js"],
      missing: ["Docker", "GraphQL", "Kubernetes", "CI/CD Pipelines"],
      iconType: 'code'
    },
    {
      id: '2',
      jobTitle: "Product Manager",
      date: "Oct 15, 2024",
      score: 65,
      fileName: "pm_resume_draft.pdf",
      matched: ["Agile", "Product Management", "Figma", "UI/UX Design", "SaaS Strategy"],
      missing: ["RESTful APIs", "SQL", "Cloud Infrastructure"],
      iconType: 'manager'
    },
    {
      id: '3',
      jobTitle: "Frontend Developer",
      date: "Sep 28, 2024",
      score: 45,
      fileName: "junior_developer.pdf",
      matched: ["HTML5", "CSS3", "JavaScript"],
      missing: ["React", "TypeScript", "Redux", "Jest"],
      iconType: 'frontend'
    }
  ])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHistoryRows(prev => prev.filter(row => row.id !== id))
  }

  // Row icon helper
  const renderRowIcon = (type: 'code' | 'manager' | 'frontend') => {
    if (type === 'code') {
      return (
        <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-lightBlue shrink-0">
          <Code2 className="h-4.5 w-4.5" />
        </div>
      )
    }
    if (type === 'manager') {
      return (
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
          <Briefcase className="h-4.5 w-4.5" />
        </div>
      )
    }
    return (
      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
        <PenTool className="h-4.5 w-4.5" />
      </div>
    )
  }

  // Score bar colors
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-left">
      
      {/* 1. Welcoming Greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mb-1.5">
            Welcome back, Alex!
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted font-sans font-light">
            Here is a look at your latest resume performance and analysis trends.
          </p>
        </div>
        
        {/* Toggle filter pills */}
        <button 
          className="inline-flex items-center justify-center h-8 px-4 rounded-full border border-white/10 bg-[#121626] text-xs font-bold text-white shadow-md self-start sm:self-auto select-none"
          type="button"
        >
          All
        </button>
      </div>

      {/* 2. Top Portal Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Total Analyses */}
        <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-4 text-left">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-sans">
                METRIC
              </span>
              <h4 className="text-xs font-bold text-brand-textMuted font-sans leading-none">
                Total Analyses
              </h4>
            </div>
            <p className="text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              12
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2: Best Match Score */}
        <div className="rounded-2xl border border-white/5 border-l-2 border-l-emerald-500 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-4 text-left">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-sans">
                TOP SCORE
              </span>
              <h4 className="text-xs font-bold text-brand-textMuted font-sans leading-none">
                Best Match Score
              </h4>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 tracking-tight leading-none font-sans">
              94%
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
        </div>

        {/* Metric 3: Last Analysis */}
        <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-4 text-left">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-sans">
                HISTORY
              </span>
              <h4 className="text-xs font-bold text-brand-textMuted font-sans leading-none">
                Last Analysis
              </h4>
            </div>
            <p className="text-xl font-extrabold text-white tracking-tight leading-none font-sans mt-2">
              Oct 24, 2024
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* 3. Main Analysis History Table Card */}
      <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4">
        
        {/* Table Title and Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans">
            Analysis History
          </h3>
          
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-[#121626] hover:bg-slate-800/40 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white active:scale-[0.98] transition-all"
              type="button"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            
            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue hover:bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg active:scale-[0.98] transition-all"
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
              {historyRows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => onViewAnalysis(row)}
                  className="group cursor-pointer hover:bg-white/5 transition-colors"
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
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(row.score)}`} 
                          style={{ width: `${row.score}%` }} 
                        />
                      </div>
                      <span className={`w-10 text-right ${getScoreText(row.score)}`}>
                        {row.score}%
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewAnalysis(row); }}
                        className="p-1.5 rounded-lg text-brand-textMuted hover:text-white hover:bg-white/10 transition-all"
                        title="View report"
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(row.id, e)}
                        className="p-1.5 rounded-lg text-brand-textMuted hover:text-rose-400 hover:bg-rose-500/5 transition-all"
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
          <p>Showing {historyRows.length} of 12 analyses</p>
          
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button className="h-6 w-6 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">&lt;</button>
            <button className="h-6 w-6 rounded bg-brand-blue/15 text-brand-lightBlue border border-brand-blue/20 flex items-center justify-center font-bold">1</button>
            <button className="h-6 w-6 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">2</button>
            <button className="h-6 w-6 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">3</button>
            <button className="h-6 w-6 rounded border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">&gt;</button>
          </div>
        </div>

      </div>

      {/* 4. Bottom Row Callouts (AI Optimization Recommendation and Area Chart SVG) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: AI alert card (Span 3) */}
        <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl flex flex-col justify-center space-y-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-sans">
            <Sparkles className="h-4.5 w-4.5 text-brand-lightBlue animate-pulse" />
            <span>Resume Optimization AI</span>
          </div>
          <p className="text-[11px] text-brand-textMuted leading-relaxed font-sans font-light">
            Our AI models analyzed your recent career logs and detected that your <span className="text-white font-semibold">"Frontend Developer"</span> analysis is missing critical React performance keywords and Jest testing methodologies.
          </p>
        </div>

        {/* Right Column: Glow line charts mock widget (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-brand-card/45 p-4 backdrop-blur-md shadow-xl h-40 flex items-center justify-center relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_20px]" />
          
          <svg className="w-full h-full opacity-70 relative z-10" viewBox="0 0 200 100">
            {/* Fill gradient area under charts */}
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
        </div>

      </div>

    </div>
  )
}
