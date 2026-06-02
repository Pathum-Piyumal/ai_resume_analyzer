import React from 'react'
import { Award, CheckCircle } from 'lucide-react'

export default function MatchScoreCard({ score = 78 }) {
  // SVG circular progress calculation
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // Color mapping based on score
  const getScoreColor = (num) => {
    if (num >= 85) return 'text-emerald-400 stroke-emerald-400'
    if (num >= 70) return 'text-brand-lightBlue stroke-brand-lightBlue'
    return 'text-amber-400 stroke-amber-400'
  }

  const getScoreBg = (num) => {
    if (num >= 85) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
    if (num >= 70) return 'bg-brand-blue/10 border-brand-blue/20 text-brand-lightBlue'
    return 'bg-amber-500/10 border-amber-500/20 text-amber-300'
  }

  const getVerdict = (num) => {
    if (num >= 85) return 'Excellent Match'
    if (num >= 70) return 'Strong Match'
    return 'Moderate Match'
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-brand-card/60 p-6 backdrop-blur-md shadow-xl flex flex-col items-center text-center">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
        Overall Match Score
      </h3>

      <div className="relative flex items-center justify-center mb-6">
        {/* Glowing circle under */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 bg-brand-blue`} />
        
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
            className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
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
          <span className="text-[10px] text-brand-textMuted font-medium uppercase tracking-wider mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getScoreBg(score)} mb-4`}>
        <Award className="h-3.5 w-3.5" />
        <span>{getVerdict(score)}</span>
      </div>

      <p className="text-xs text-brand-textMuted leading-relaxed max-w-[240px]">
        {score >= 70 
          ? "Your resume strongly aligns with this job description. With a few minor keywords optimizations, you're ready to apply."
          : "Your resume meets several core criteria but is missing several high-weight skills required for this specific role."
        }
      </p>
    </div>
  )
}
