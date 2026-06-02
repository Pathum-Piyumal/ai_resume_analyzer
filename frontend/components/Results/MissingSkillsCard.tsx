import { AlertTriangle } from 'lucide-react'

interface MissingSkillsCardProps {
  skills?: string[]
}

export default function MissingSkillsCard({ skills = [] }: MissingSkillsCardProps) {
  const defaultMissing = ["Docker", "GraphQL", "Kubernetes", "CI/CD Pipelines"]
  const displaySkills = skills.length > 0 ? skills : defaultMissing

  return (
    <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
        <h3 className="text-sm font-bold text-white tracking-tight font-sans">
          Missing Skills
        </h3>
      </div>

      {/* Tag pills wrap list */}
      <div className="flex flex-wrap gap-2.5">
        {displaySkills.map((skill, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-rose-500/5 border border-rose-500/15 text-rose-400 select-none hover:border-rose-500/30 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
      
    </div>
  )
}
