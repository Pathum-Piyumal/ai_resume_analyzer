import React, { useState } from 'react'

export default function SupportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitted(true)
    }, 600)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans text-brand-textPrimary relative z-10">
      
      {/* Background glow for aesthetics */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Contact Support
        </h1>
        <p className="text-sm sm:text-base text-brand-textMuted max-w-xl mx-auto leading-relaxed">
          Need help with your account or have a question about CareerAI? We're here to help. Fill out the form below and our team will get back to you shortly.
        </p>
      </div>

      <div className="bg-brand-card/45 border border-white/5 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl backdrop-blur-md">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Alex Reynolds"
                  className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="alex@company.com"
                  className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                placeholder="How can we help you?"
                className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                placeholder="Describe your issue or question in detail..."
                className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-blue hover:bg-blue-600 py-3.5 font-bold text-xs text-white shadow-xl shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150"
            >
              SEND MESSAGE
            </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-sm text-brand-textMuted max-w-sm mx-auto">
              Thanks for reaching out. Our support team will get back to you within 24-48 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-8 px-6 py-2 rounded-lg border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
