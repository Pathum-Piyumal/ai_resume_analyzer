export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#0A0E1A]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 px-6 py-16 sm:px-16 md:py-20 lg:px-24 backdrop-blur-md shadow-2xl shadow-brand-blue/5 text-center">
          
          {/* Subtle inside glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-blue/5 pointer-events-none" />

          {/* Heading */}
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-sans mb-6">
            Ready to landing your dream job?
          </h2>

          {/* Subtext */}
          <p className="mx-auto max-w-xl text-base sm:text-lg text-brand-textMuted font-sans font-light leading-relaxed mb-10">
            All your PDF documents are processed safely and securely. Get instant keyword improvements and match rankings now.
          </p>

          {/* CTA Action button */}
          <div className="flex justify-center">
            <a
              href="#analyze"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Start Free Analysis
              <svg className="ml-2.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
