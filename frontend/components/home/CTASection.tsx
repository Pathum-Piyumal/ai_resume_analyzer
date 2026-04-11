interface CTASectionProps {
  onNavigate?: (view: 'landing' | 'analyze') => void
}

export default function CTASection({ onNavigate }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-brand-dark">
      {/* Background glow spotlight */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/50 to-indigo-950/50 px-6 py-16 sm:px-16 md:py-20 lg:px-24 backdrop-blur-md shadow-2xl text-center">
          
          {/* Subtle inside gradient highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-lightBlue/5 pointer-events-none" />

          {/* Heading */}
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-sans mb-6">
            Ready to landing your dream job?
          </h2>

          {/* Subtext */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-brand-textMuted font-sans font-light leading-relaxed mb-10">
            Join over 100,000 professionals who have optimized their resumes with CareerAI
          </p>

          {/* Screenshot exact replica white pill button */}
          <div className="flex justify-center">
            <button
              onClick={() => onNavigate?.('analyze')}
              className="inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-brand-dark px-8 py-3.5 text-sm font-bold shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              Start Your Free Analysis
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
