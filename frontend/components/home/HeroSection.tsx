import dashboardMockup from '../../src/assets/dashboard_mockup.png'

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-[#0A0E1A]">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-orange/10 to-brand-blue/15 blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">

                {/* Animated Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold text-brand-orange shadow-lg shadow-brand-orange/5 animate-pulse-slow mb-6">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-brand-orange animate-ping" />
                    <span>✨ Scientific GPT & NLP Extraction</span>
                </div>

                {/* Dynamic Headline */}
                <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl font-sans leading-[1.1] mb-6">
                    Unlock Your Career Potential <br />
                    <span className="bg-gradient-to-r from-brand-orange via-amber-500 to-brand-blue bg-clip-text text-transparent">
                        with Advanced AI
                    </span>
                </h1>

                {/* Subtext */}
                <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-brand-textMuted font-sans font-light leading-relaxed mb-10">
                    Professional resume analysis and ATS optimization at your fingertips. Stand out to recruiters with quantitative, data-driven match insights.
                </p>

                {/* Dual Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <a
                        href="#analyze"
                        className="flex w-full sm:w-auto items-center justify-center rounded-lg bg-gradient-to-r from-brand-orange to-amber-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-orange/10 hover:shadow-brand-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        Get Started
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                    <a
                        href="#demo"
                        className="flex w-full sm:w-auto items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200"
                    >
                        See a Demo
                    </a>
                </div>

                {/* Dashboard Mockup Showcase */}
                <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-brand-card/30 p-2 sm:p-3 backdrop-blur-sm shadow-2xl shadow-brand-blue/5 overflow-hidden group">
                    {/* Subtle overlay glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/10 via-transparent to-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <img
                        src={dashboardMockup}
                        alt="ResumeAI Dashboard Mockup"
                        className="w-full rounded-xl border border-white/5 object-cover object-center shadow-inner transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    />
                </div>

            </div>
        </section>
    )
}
