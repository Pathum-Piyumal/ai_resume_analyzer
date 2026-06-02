import { Bookmark, MapPin, DollarSign, Building, ArrowUpRight, Star } from 'lucide-react'

export default function SavedJobsPage() {
  const savedJobs = [
    {
      id: 1,
      role: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$140k - $170k',
      match: 85,
      savedAt: '2 days ago',
      tags: ['React', 'TypeScript', 'GraphQL'],
    },
    {
      id: 2,
      role: 'Frontend Engineer',
      company: 'Fintech Innovations',
      location: 'Remote',
      salary: '$120k - $150k',
      match: 92,
      savedAt: '4 days ago',
      tags: ['React', 'Redux', 'Tailwind'],
    },
    {
      id: 3,
      role: 'UI/UX Engineer',
      company: 'Creative Studios',
      location: 'New York, NY (On-site)',
      salary: '$110k - $130k',
      match: 78,
      savedAt: '1 week ago',
      tags: ['Vue', 'Figma', 'CSS Animations'],
    }
  ]

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (score >= 80) return 'text-brand-lightBlue border-brand-blue/30 bg-brand-blue/10'
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Saved Jobs
          </h1>
          <p className="mt-2 text-sm text-brand-textMuted font-sans">
            Track and manage your potential next career moves.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl border border-white/10 bg-[#121626] hover:bg-slate-800/40 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-[0.98]">
            Filter
          </button>
          <button className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-xs font-bold text-white shadow-lg shadow-brand-blue/15 transition-all active:scale-[0.98]">
            Find New Jobs
          </button>
        </div>
      </div>

      {/* Grid of Saved Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <div key={job.id} className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl hover:border-white/10 transition-colors flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#121626] border border-white/10 text-white font-bold font-sans">
                  {job.company.charAt(0)}
                </div>
                <button className="text-brand-lightBlue hover:text-white transition-colors" title="Remove">
                  <Bookmark className="h-5 w-5 fill-current" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-white tracking-tight font-sans mb-1 leading-tight">
                {job.role}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-brand-textMuted font-sans mb-4">
                <Building className="h-3.5 w-3.5" />
                <span>{job.company}</span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-sans">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-sans">
                  <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                  {job.salary}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {job.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-800 text-[9px] font-semibold text-slate-300 border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getMatchColor(job.match)}`}>
                <Star className="h-3 w-3" />
                <span className="text-[10px] font-bold font-mono">{job.match}% Match</span>
              </div>
              
              <button className="flex items-center gap-1 text-[11px] font-bold text-white hover:text-brand-lightBlue transition-colors group">
                Apply Now <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
