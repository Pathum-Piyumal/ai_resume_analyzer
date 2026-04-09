import FeatureCard from '../ui/FeatureCard'
import { Zap, Search, BarChart2 } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-[#0A0E1A]" id="solutions">
      {/* Accent lighting element */}
      <div className="absolute top-1/2 left-1/3 -z-10 h-[350px] w-[500px] -translate-y-1/2 rounded-full bg-brand-blue/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl font-sans mb-4">
            Precision Engineered for Excellence
          </h2>
          <p className="text-base sm:text-lg text-brand-textMuted font-sans font-light leading-relaxed">
            Our AI analysis tool parses professional history against thousands of successful industry benchmarks.
          </p>
        </div>

        {/* 3-Column Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Instant Scoring"
            description="Get a comprehensive match in seconds, understand instantly how your resume matches target descriptions."
          />
          <FeatureCard
            icon={<Search className="h-6 w-6" />}
            title="Keyword Optimization"
            description="Extract and match key critical keyphrases. Automatically scan, identify missing terms."
          />
          <FeatureCard
            icon={<BarChart2 className="h-6 w-6" />}
            title="Skill Gap Analysis"
            description="Receive actionable recommendations on skills you need to obtain, credentials to show."
          />
        </div>

      </div>
    </section>
  )
}
