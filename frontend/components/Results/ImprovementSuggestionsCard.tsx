import { MapPin } from 'lucide-react'

interface SuggestionItem {
  id: number
  title: string
  desc: string
}

interface ImprovementSuggestionsCardProps {
  suggestions?: SuggestionItem[]
}

export default function ImprovementSuggestionsCard({ suggestions }: ImprovementSuggestionsCardProps) {
  const defaultSuggestions = [
    {
      id: 1,
      title: "Quantify impact in previous roles with metrics",
      desc: "Instead of 'Improved performance,' use 'Optimized database queries leading to a 40% reduction in latency.'"
    },
    {
      id: 2,
      title: "Highlight experience with distributed systems",
      desc: "The job description frequently mentions microservices, system scalability, and Kubernetes deployment environments."
    }
  ]

  const displayList = suggestions || defaultSuggestions

  return (
    <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left space-y-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
        <h3 className="text-sm font-bold text-white tracking-tight font-sans">
          Improvement Suggestions
        </h3>
      </div>

      {/* List items */}
      <div className="space-y-4 pt-1">
        {displayList.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 text-xs font-bold font-sans">
              {item.id}
            </span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                {item.title}
              </h4>
              <p className="text-[11px] text-brand-textMuted leading-relaxed font-sans font-light">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
