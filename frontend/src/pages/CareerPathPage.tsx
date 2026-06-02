import { Briefcase, ArrowUpRight, CheckCircle2, Circle, TrendingUp, Compass, Clock, GraduationCap } from 'lucide-react'

export default function CareerPathPage() {
  const careerSteps = [
    {
      id: 1,
      role: 'Junior Developer',
      status: 'completed',
      salary: '$60k - $80k',
      duration: '1-2 years',
      skills: ['React', 'JavaScript', 'HTML/CSS'],
    },
    {
      id: 2,
      role: 'Frontend Developer',
      status: 'current',
      salary: '$90k - $120k',
      duration: '2-4 years',
      skills: ['TypeScript', 'State Management', 'Performance Optimization'],
    },
    {
      id: 3,
      role: 'Senior Frontend Engineer',
      status: 'next',
      salary: '$130k - $170k',
      duration: '4-7 years',
      skills: ['System Design', 'CI/CD', 'Mentorship', 'Architecture'],
      match: 75,
    },
    {
      id: 4,
      role: 'Engineering Manager',
      status: 'future',
      salary: '$160k - $220k',
      duration: '7+ years',
      skills: ['Leadership', 'Agile', 'Team Building', 'Strategic Planning'],
      match: 30,
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          AI Career Path
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Your personalized career trajectory based on your skills and market trends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl relative">
            <div className="absolute top-8 bottom-8 left-[38px] w-px bg-white/10 z-0" />
            
            <div className="space-y-8 relative z-10">
              {careerSteps.map((step, index) => (
                <div key={step.id} className={`flex gap-6 ${step.status === 'completed' ? 'opacity-60' : ''}`}>
                  <div className="relative mt-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 bg-brand-card z-10 relative
                      ${step.status === 'completed' ? 'border-emerald-500 text-emerald-500' : 
                        step.status === 'current' ? 'border-brand-lightBlue text-brand-lightBlue shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 
                        'border-slate-700 text-slate-500'}`}
                    >
                      {step.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                       step.status === 'current' ? <Compass className="h-4 w-4 animate-pulse" /> :
                       <Circle className="h-3 w-3" />}
                    </div>
                  </div>
                  
                  <div className={`flex-1 rounded-xl border p-5 transition-all
                    ${step.status === 'current' ? 'border-brand-blue/30 bg-brand-blue/5' : 
                      step.status === 'next' ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10' : 
                      'border-white/5 bg-transparent'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight font-sans">
                          {step.role}
                        </h3>
                        <div className="flex items-center gap-4 mt-1.5 text-[11px] font-sans text-brand-textMuted">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {step.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {step.duration}
                          </span>
                        </div>
                      </div>
                      
                      {step.status === 'next' && step.match && (
                        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20">
                          <span className="text-[10px] font-bold text-brand-lightBlue uppercase tracking-wider">Skill Match</span>
                          <span className="text-sm font-bold text-white font-mono">{step.match}%</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans block">
                        Required Core Skills
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${
                              step.status === 'completed' || step.status === 'current' 
                                ? 'bg-slate-800 text-slate-300 border-white/5' 
                                : 'bg-transparent text-slate-400 border-white/10'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-brand-lightBlue" />
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Next Steps to Level Up
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#121626] border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-xs font-bold text-white mb-1.5">Master System Design</h4>
                <p className="text-[11px] text-brand-textMuted font-light leading-relaxed mb-3">
                  Crucial for transitioning to a Senior role. Focus on scalable architecture and distributed systems.
                </p>
                <a href="#" className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-lightBlue hover:text-blue-400">
                  View Recommended Courses <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              
              <div className="p-4 rounded-xl bg-[#121626] border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-xs font-bold text-white mb-1.5">Improve CI/CD Knowledge</h4>
                <p className="text-[11px] text-brand-textMuted font-light leading-relaxed mb-3">
                  Your current resume lacks strong devops skills which are highly valued in senior roles.
                </p>
                <a href="#" className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-lightBlue hover:text-blue-400">
                  Explore Guided Projects <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-md shadow-xl text-left">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Market Outlook
              </h3>
            </div>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed">
              Demand for <strong className="text-white">Senior Frontend Engineers</strong> is projected to grow by 14% over the next 2 years. Top paying sectors include Fintech and AI startups.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
