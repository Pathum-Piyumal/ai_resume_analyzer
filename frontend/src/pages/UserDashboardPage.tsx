import { 
  FileText, 
  Target, 
  Star, 
  TrendingUp,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react'

interface UserDashboardPageProps {
  onNewAnalysis: () => void
}

export default function UserDashboardPage({ onNewAnalysis }: UserDashboardPageProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-left relative min-h-[80vh]">
      
      {/* 1. Header Overview title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Welcome back, Alex!
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Here's a quick overview of your career progress.
        </p>
      </div>

      {/* 2. Top Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Resumes Analyzed */}
        <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-4 text-left">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-sans mb-1 block">
                TOTAL ANALYSES
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              12
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Avg Score */}
        <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-4 text-left">
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
              82%
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0">
            <Star className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Skill Gap */}
        <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-5 backdrop-blur-md shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-4 text-left">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-sans">
                SKILLS MASTERED
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none font-sans">
              24
            </p>
          </div>
          <div className="p-3 bg-slate-800 text-slate-400 rounded-xl shrink-0">
            <Target className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* 3. Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-brand-lightBlue" />
              <h3 className="text-sm font-bold text-white font-sans">Optimize New Resume</h3>
            </div>
            <p className="text-xs text-brand-textMuted font-sans mb-6">
              Upload a new resume and job description to get instant, AI-driven ATS optimization suggestions.
            </p>
          </div>
          <button 
            onClick={onNewAnalysis}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue hover:bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-[0.98]"
          >
            <span>Start Analysis</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-sans">Career Path Insights</h3>
            </div>
            <p className="text-xs text-brand-textMuted font-sans mb-6">
              Review your personalized career progression map based on your latest resume data and industry trends.
            </p>
          </div>
          <button 
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-bold text-white transition-all active:scale-[0.98]"
          >
            <span>View Insights</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* Floating Plus */}
      <div className="fixed bottom-6 right-6 z-45">
        <button
          onClick={onNewAnalysis}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue hover:bg-blue-600 text-white shadow-xl shadow-brand-blue/30 active:scale-[0.98] hover:scale-105 transition-all"
          title="New Analysis"
          type="button"
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>

    </div>
  )
}
