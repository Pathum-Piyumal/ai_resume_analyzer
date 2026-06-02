import React from 'react'

export default function Header() {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 mt-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans mb-3 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
        Analyze Your Career
      </h1>
      <p className="text-sm sm:text-base text-brand-textMuted font-sans font-light leading-relaxed">
        Optimize your resume against specific job roles with high-fidelity AI insights.
      </p>
    </div>
  )
}
