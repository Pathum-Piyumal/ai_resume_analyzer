import MatchScoreCard from './MatchScoreCard'
import SkillsCard from './SkillsCard'
import MissingSkillsCard from './MissingSkillsCard'
import { Sparkles, RefreshCw, FileCheck } from 'lucide-react'

interface ResultsDashboardProps {
  fileName: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  onReset: () => void
}

export default function ResultsDashboard({ 
  fileName = 'Resume.pdf', 
  matchScore = 78, 
  matchedSkills = [], 
  missingSkills = [],
  onReset 
}: ResultsDashboardProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 text-left">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-blue/10 text-brand-lightBlue rounded-2xl border border-brand-blue/15">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
              Analysis Results
            </h1>
            <p className="text-xs text-brand-textMuted font-sans">
              Optimized for: <span className="text-slate-300 font-medium">{fileName}</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-card hover:bg-brand-card/80 border border-white/10 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] self-start sm:self-auto shadow-md"
        >
          <RefreshCw className="h-4 w-4 text-brand-lightBlue" />
          <span>Analyze Another</span>
        </button>
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
        <div className="md:col-span-1">
          <MatchScoreCard score={matchScore} />
        </div>
        <div className="md:col-span-1">
          <SkillsCard skills={matchedSkills} />
        </div>
        <div className="md:col-span-1">
          <MissingSkillsCard skills={missingSkills} />
        </div>
      </div>

      {/* Detailed Action Plan Section */}
      <div className="rounded-2xl border border-white/10 bg-brand-card/40 p-6 backdrop-blur-md shadow-xl text-left">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-brand-lightBlue" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            AI-Powered Optimization Plan
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-brand-lightBlue text-xs font-bold border border-brand-blue/20 shrink-0">1</span>
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Strengthen the Work Experience section</h4>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Add metrics and business outcomes rather than listing responsibilities. For instance, mention how you used <span className="text-slate-300 font-semibold">{matchedSkills[0] || 'React'}</span> to achieve specific performance gains.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-brand-lightBlue text-xs font-bold border border-brand-blue/20 shrink-0">2</span>
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Integrate missing soft skills and frameworks</h4>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Explicitly list <span className="text-slate-300 font-semibold">{missingSkills[0] || 'GraphQL'}</span> and <span className="text-slate-300 font-semibold">{missingSkills[1] || 'Jest'}</span> in a dedicated Skills matrix at the top of your resume.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-brand-lightBlue text-xs font-bold border border-brand-blue/20 shrink-0">3</span>
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Refine your Professional Summary</h4>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Tune your opening paragraph to focus on keywords found in the job requirements. Position yourself as a specialist solving the exact challenges outlined in the description.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
