import { useState } from 'react'
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

interface ForgotPasswordPageProps {
  onBackToLogin: () => void
}

export default function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-left">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[350px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 select-none">
        <div className="flex justify-center mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-lightBlue border border-brand-blue/15">
            <Sparkles className="h-5 w-5 text-brand-lightBlue animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans">
          ResumeAI
        </h2>
        <p className="mt-1 text-xs text-brand-textMuted font-sans">
          Smart Resume. Smart Career.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-brand-card/45 border border-white/5 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl backdrop-blur-md relative overflow-hidden">
          
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="text-center select-none">
                <h3 className="text-lg font-bold text-white tracking-tight font-sans">
                  Reset your password
                </h3>
                <p className="mt-1.5 text-xs text-brand-textMuted font-sans font-light leading-relaxed">
                  Enter your email address and we'll send you a recovery link.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email input field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-sans">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-brand-blue hover:bg-blue-600 py-3 font-semibold text-xs text-white shadow-xl shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Sending reset link...</span>
                    ) : (
                      <span>SEND RESET LINK</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Back to login trigger */}
              <div className="text-center pt-2 select-none">
                <button
                  onClick={onBackToLogin}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-lightBlue hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight font-sans">
                  Check your email
                </h3>
                <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed font-sans font-light">
                  We've sent a recovery link to <span className="text-slate-200 font-normal">{email}</span>. Please check your inbox and spam folders.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={onBackToLogin}
                  className="w-full rounded-xl border border-white/10 hover:border-white/20 bg-[#121626]/80 hover:bg-slate-800/30 py-3 font-semibold text-xs text-slate-300 hover:text-white transition-all active:scale-[0.98]"
                >
                  Return to Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full text-center py-6 select-none">
        <p className="text-[9px] text-brand-textMuted font-sans">
          &copy; 2026 ResumeAI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
