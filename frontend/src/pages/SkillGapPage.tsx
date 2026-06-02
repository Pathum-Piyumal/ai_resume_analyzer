import { Award, Compass, Sparkles } from 'lucide-react'

// Subcomponent: Circular Progress Gauge Widget
interface GaugeWidgetProps {
  score: number
  title: string
  subtitle: string
}

function GaugeWidget({ score, title, subtitle }: GaugeWidgetProps) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0C0F1E]/80 p-5 flex items-center gap-4 text-left">
      <div className="relative shrink-0 flex items-center justify-center">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-brand-lightBlue transition-all duration-1000"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[11px] font-bold text-white">
          {score}%
        </span>
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-200 font-sans tracking-wide">
          {title}
        </h4>
        <p className="text-[10px] text-brand-textMuted font-sans">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default function SkillGapPage() {
  const skillGaps = [
    { name: "React / Frontend", yourLevel: 90, required: 85, badge: "+5% Ahead", isAhead: true },
    { name: "Python / Backend", yourLevel: 75, required: 85, badge: "-10% Gap", isAhead: false },
    { name: "System Design", yourLevel: 70, required: 85, badge: "-15% Gap", isAhead: false },
    { name: "Cloud (AWS/GCP)", yourLevel: 65, required: 85, badge: "-20% Gap", isAhead: false }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-left">
      
      {/* 1. Header Intro */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mb-2">
          Skill Gap Analysis
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted font-sans font-light leading-relaxed max-w-3xl">
          Comparing your current profile against the <span className="text-slate-200 font-semibold">Senior Full-Stack Engineer</span> requirements for <span className="text-slate-200 font-semibold">Global Tech Systems</span>. We've identified 3 critical gaps and 5 areas of expertise.
        </p>
      </div>

      {/* 2. Main Comparison Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Skill Match Comparison Chart (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-0.5">
                Skill Match Comparison
              </h3>
              <p className="text-[10px] text-brand-textMuted font-sans">
                Direct comparison with market benchmarks
              </p>
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-[10px] text-brand-textMuted font-medium font-sans">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
                <span>Your Level</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
                <span>Required</span>
              </div>
            </div>
          </div>

          {/* Bar Chart list */}
          <div className="space-y-6 pt-2">
            {skillGaps.map((gap, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200 font-sans">{gap.name}</span>
                  <span className={gap.isAhead ? "text-emerald-400 font-sans" : "text-amber-500 font-sans"}>
                    {gap.badge}
                  </span>
                </div>
                
                {/* Horizontal Progress Bars */}
                <div className="space-y-1.5">
                  {/* Your Level (Blue) */}
                  <div className="h-2 w-full bg-slate-800/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-brand-blue rounded-full shadow-lg shadow-brand-blue/30 transition-all duration-1000"
                      style={{ width: `${gap.yourLevel}%` }}
                    />
                  </div>
                  {/* Required (Orange) */}
                  <div className="h-2 w-full bg-slate-800/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-amber-600 rounded-full shadow-lg shadow-amber-600/30 transition-all duration-1000"
                      style={{ width: `${gap.required}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Demand Cloud & AI recommendations (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card: Demand Cloud */}
          <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-0.5">
                Demand Cloud
              </h3>
              <p className="text-[10px] text-brand-textMuted font-sans">
                Most frequent keywords in current job market
              </p>
            </div>

            {/* Keyword tags flex cloud cluster */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-3 relative min-h-[190px]">
              {/* Featured: System Design */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="inline-flex px-7 py-3 rounded-full text-sm font-bold bg-amber-600/10 border border-amber-600/30 text-amber-500 shadow-xl shadow-amber-600/5 select-none hover:bg-amber-600/15 transition-all">
                  System Design
                </span>
              </div>

              {/* Surrounding floating tags */}
              <div className="w-full flex justify-between gap-6 px-1 z-0">
                <span className="inline-flex px-4 py-2 rounded-xl text-xs font-bold bg-brand-blue/15 border border-brand-blue/20 text-brand-lightBlue select-none">
                  Kubernetes
                </span>
                <span className="inline-flex px-3 py-1.5 rounded-lg text-[10px] border border-white/10 text-slate-300 select-none">
                  GraphQL
                </span>
              </div>
              <div className="w-full flex justify-around gap-4 z-0 mt-2">
                <span className="inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-blue/10 border border-brand-blue/15 text-brand-lightBlue select-none">
                  Next.js
                </span>
                <span className="inline-flex px-2 py-0.5 rounded-lg text-[9px] border border-white/5 text-slate-500 select-none">
                  Redis
                </span>
              </div>
              <div className="w-full flex justify-around gap-6 z-0 mt-8">
                <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] border border-white/10 text-slate-300 select-none">
                  TypeScript
                </span>
                <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] border border-white/10 text-slate-400 select-none">
                  Agile
                </span>
              </div>
              <div className="w-full flex justify-between gap-6 px-1 z-0 mt-2">
                <span className="inline-flex px-4.5 py-2 rounded-xl text-xs font-semibold bg-brand-blue/15 border border-brand-blue/20 text-brand-lightBlue select-none">
                  Microservices
                </span>
                <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] border border-white/10 text-slate-300 select-none">
                  CI/CD
                </span>
              </div>
            </div>

            {/* AI Recommendation Alert Sheet */}
            <div className="p-3.5 bg-brand-blue/5 rounded-xl border border-brand-blue/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-brand-lightBlue font-bold text-xs">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>AI Recommendation</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-normal font-sans font-light">
                Focus on <span className="font-semibold text-white">System Design</span> and <span className="font-semibold text-white">Kubernetes</span> certification. These represent 60% of the missing criteria for your target role.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Gauge Widget Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GaugeWidget score={85} title="Technical Skills" subtitle="Foundational Core" />
        <GaugeWidget score={92} title="Soft Skills" subtitle="EQ & Leadership" />
        <GaugeWidget score={54} title="Tools" subtitle="Platform Proficiency" />
        <GaugeWidget score={30} title="Certifications" subtitle="Industry Validation" />
      </div>

      {/* 4. Footer */}
      <footer className="w-full border-t border-white/5 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-brand-textMuted font-sans">
          ResumeIQ &copy; 2026 ResumeIQ Intelligence. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[10px] text-brand-textMuted font-sans">
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#ethics" className="hover:text-white transition-colors">AI Ethics</a>
          <a href="#support" className="hover:text-white transition-colors">Support</a>
          <a href="#api" className="hover:text-white transition-colors">API</a>
        </div>
      </footer>

    </div>
  )
}
