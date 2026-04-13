import { AlertCircle, Plus } from 'lucide-react'

interface MissingSkillsCardProps {
  skills?: string[]
}

export default function MissingSkillsCard({ skills = [] }: MissingSkillsCardProps) {
  const defaultMissing = ["GraphQL", "Unit Testing (Jest)", "CI/CD Pipelines", "Next.js", "Docker"]
  const displaySkills = skills.length > 0 ? skills : defaultMissing

  return (
    <div className="rounded-2xl border border-white/10 bg-brand-card/60 p-6 backdrop-blur-md shadow-xl text-left h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Missing Keywords
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
          {displaySkills.length} Missing
        </span>
      </div>

      <p className="text-xs text-brand-textMuted mb-6 leading-relaxed">
        We recommend integrating these key terms into your work history to bypass ATS filters:
      </p>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {displaySkills.map((skill, index) => (
          <div 
            key={index}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-rose-500/5 border border-rose-500/10 text-slate-300 hover:border-rose-500/20 hover:bg-rose-500/10 transition-all duration-200"
          >
            <div className="flex items-center gap-2 truncate">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span className="text-xs font-medium truncate">{skill}</span>
            </div>
            <Plus className="h-3 w-3 text-brand-textMuted" />
          </div>
        ))}
      </div>

      <div className="p-3 bg-brand-blue/5 rounded-xl border border-brand-blue/10 flex gap-2">
        <span className="text-sm">💡</span>
        <p className="text-[11px] text-slate-300 leading-normal font-sans font-light">
          <strong>Tip:</strong> Avoid stuffing keywords. Describe your experiences using these terms naturally in your project descriptions and achievements.
        </p>
      </div>
    </div>
  )
}
