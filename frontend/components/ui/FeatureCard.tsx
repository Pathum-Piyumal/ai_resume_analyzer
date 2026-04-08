import React from 'react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="relative group rounded-2xl border border-white/5 bg-brand-card/25 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/5 overflow-hidden">
      {/* Background glow gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Icon frame */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 p-2.5 text-brand-orange group-hover:text-brand-blue transition-colors duration-300 mb-6">
        {icon}
      </div>

      <h3 className="font-sans text-xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors duration-200">
        {title}
      </h3>
      
      <p className="text-sm font-sans font-light leading-relaxed text-brand-textMuted">
        {description}
      </p>
    </div>
  )
}
