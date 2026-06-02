import { CheckCircle } from 'lucide-react'

interface SkillsCardProps {
  skills?: string[]
}

export default function SkillsCard({ skills = [] }: SkillsCardProps) {
  const defaultSkills = ["Python", "React", "AWS", "Agile", "TypeScript", "PostgreSQL", "Node.js"]
  const displaySkills = skills.length > 0 ? skills : defaultSkills

  return (
    <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
        <h3 className="text-sm font-bold text-white tracking-tight font-sans">
          Matched Skills
        </h3>
      </div>

      {/* Tag pills wrap list */}
      <div className="flex flex-wrap gap-2.5">
        {displaySkills.map((skill, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 select-none hover:border-emerald-500/30 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
      
    </div>
  )
}
