import dashboardMockup from '../../src/assets/dashboard_mockup.png'

interface HeroSectionProps {
  onNavigate?: (view: 'landing' | 'analyze') => void
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 bg-brand-dark">
      {/* Background glow lighting */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[350px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Pulsing Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/5 px-3 py-1.5 text-xs font-semibold text-brand-lightBlue shadow-lg shadow-brand-blue/5 animate-pulse-slow mb-6">
          <span className="flex h-1.5 w-1.5 rounded-full bg-brand-lightBlue animate-ping" />
          <span>🤖 Powered by GPT-4 Optimization</span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl font-sans leading-[1.1] mb-6">
          Unlock Your Career Potential <br />
          with <span className="bg-gradient-to-r from-brand-blue to-brand-lightBlue bg-clip-text text-transparent">AI</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-brand-textMuted font-sans font-light leading-relaxed mb-10">
          Professional resume analysis and ATS optimization at your fingertips. Stand out to recruiters with data-driven insights.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onNavigate?.('analyze')}
            className="flex w-full sm:w-auto items-center justify-center rounded-lg bg-brand-blue hover:bg-blue-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Get Started &rarr;
          </button>
          <button
            onClick={() => onNavigate?.('analyze')}
            className="flex w-full sm:w-auto items-center justify-center rounded-lg border border-white/10 bg-brand-dark hover:bg-white/5 px-8 py-3.5 text-sm font-bold text-white active:scale-[0.98] transition-all duration-200"
          >
            See it More
          </button>
        </div>

        {/* Showcase Mockup */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-brand-card/40 p-2 backdrop-blur-sm shadow-2xl overflow-hidden">
          <img
            src={dashboardMockup}
            alt="CareerAI Dashboard mockup"
            className="w-full rounded-xl border border-white/5 object-cover object-center shadow-inner"
          />
        </div>

      </div>
    </section>
  )
}
