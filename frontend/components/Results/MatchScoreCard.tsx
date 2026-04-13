import { Download, RotateCcw } from 'lucide-react'

interface MatchScoreCardProps {
  score?: number
  roleName?: string
  onReset?: () => void
}

export default function MatchScoreCard({ 
  score = 82, 
  roleName = 'Senior Software Engineer',
  onReset 
}: MatchScoreCardProps) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // Dynamic compatibility level text
  const getVerdict = (num: number) => {
    if (num >= 85) return 'Excellent Alignment'
    if (num >= 70) return 'High Alignment'
    return 'Moderate Alignment'
  }

  const handleDownload = () => {
    // Generate dummy report download trigger
    const element = document.createElement("a");
    const file = new Blob([
      `CareerAI Resume Optimization Report\nRole: ${roleName}\nATS Compatibility Match: ${score}%\nGenerated on: ${new Date().toLocaleDateString()}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `CareerAI_Report_${roleName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-8 text-left relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/4 -z-10 h-32 w-32 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none" />

      {/* Left Column: Circular gauge */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-emerald-500 transition-all duration-1000 ease-out"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
            {score}%
          </span>
        </div>
      </div>

      {/* Right Column: Compatibility details & actions */}
      <div className="flex-grow space-y-3.5">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            MATCH SCORE
          </span>
          <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans">
            {getVerdict(score)}
          </h3>
        </div>

        <p className="text-xs text-brand-textMuted leading-relaxed max-w-xl font-sans font-light">
          Your profile strongly aligns with the <span className="text-slate-200 font-semibold">{roleName}</span> requirements. 
          Focus on the missing skills to reach the 95th percentile of candidates.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue hover:bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-blue/10 active:scale-[0.98] transition-all duration-150"
            type="button"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
          
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-[#121626] hover:bg-slate-800/50 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white active:scale-[0.98] transition-all duration-150"
            type="button"
          >
            <RotateCcw className="h-4 w-4 text-brand-lightBlue" />
            <span>Re-Analyze</span>
          </button>
        </div>
      </div>

    </div>
  )
}
