import React from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function SkillsCard({ skills = [] }) {
  const defaultSkills = ["React", "TypeScript", "Tailwind CSS", "RESTful APIs", "State Management", "Git & GitHub"]
  const displaySkills = skills.length > 0 ? skills : defaultSkills

  return (
    <div className="rounded-2xl border border-white/10 bg-brand-card/60 p-6 backdrop-blur-md shadow-xl text-left h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Matched Skills
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
          {displaySkills.length} Found
        </span>
      </div>

      <p className="text-xs text-brand-textMuted mb-6 leading-relaxed">
        Great news! The following high-priority skills were successfully identified in your resume:
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {displaySkills.map((skill, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-slate-200 hover:border-emerald-500/20 hover:bg-emerald-500/10 transition-all duration-200"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium truncate">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
