import { useState } from 'react'
import { Sparkles, User, Mail, Lock, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react'

interface SignUpPageProps {
  onSuccess: () => void
  onSignInClick: () => void
}

export default function SignUpPage({ onSuccess, onSignInClick }: SignUpPageProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.')
      return
    }

    setIsLoading(true)
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col relative overflow-hidden font-sans text-left">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[450px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={onSignInClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 p-0.5 shadow-lg shadow-brand-blue/10">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-brand-dark">
              <svg className="h-4 w-4 text-brand-lightBlue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
              </svg>
            </div>
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-white">
            Resume<span className="text-brand-lightBlue">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-brand-textMuted font-semibold">
          <a href="#help" className="hover:text-white transition-colors">Help Center</a>
          <span className="text-white/10">|</span>
          <a href="#sales" className="hover:text-white transition-colors">Contact Sales</a>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 z-10">
        <div className="w-full max-w-lg">
          <div className="bg-brand-card/45 border border-white/5 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl backdrop-blur-md">
            
            {/* Step & Titles */}
            <div className="text-center mb-6 select-none">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-blue/10 text-brand-lightBlue border border-brand-blue/20 tracking-wider uppercase font-sans mb-3">
                Step 1 of 1
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans">
                Create your account
              </h2>
              <p className="mt-1 text-xs text-brand-textMuted font-sans">
                Elevate your career with AI-driven insights.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-sans font-light">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullname" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    id="fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Reynolds"
                    className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                  Work Email
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
                    placeholder="alex@company.com"
                    className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                  />
                </div>
              </div>

              {/* Side-by-side Password and Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-start select-none pt-1">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 rounded bg-[#121626]/60 border-white/10 text-brand-blue focus:ring-brand-blue/30 focus:ring-offset-brand-dark transition-all cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-[11px] font-sans font-light text-brand-textMuted leading-relaxed">
                  <label htmlFor="terms" className="cursor-pointer">
                    By creating an account, I agree to the{' '}
                    <a href="#terms" className="text-brand-lightBlue hover:underline">Terms of Service</a> and{' '}
                    <a href="#privacy" className="text-brand-lightBlue hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-3.5 font-bold text-xs text-white shadow-xl shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Social Divider */}
            <div className="mt-5">
              <div className="relative flex justify-center text-xs select-none">
                <span className="px-3 bg-[#0c0e1e]/40 text-[9px] font-bold text-slate-500 uppercase tracking-widest relative z-10 backdrop-blur-sm">
                  Or Sign Up With
                </span>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 z-0" />
              </div>

              <div className="mt-4">
                <button
                  onClick={onSuccess}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 hover:border-white/20 bg-[#121626]/80 rounded-xl hover:bg-slate-800/30 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-[0.98]"
                  type="button"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Register with Google Workspace</span>
                </button>
              </div>
            </div>

            {/* Switch Account */}
            <div className="mt-6 text-center select-none">
              <p className="text-[11px] font-sans font-light text-brand-textMuted">
                Already have an account?{' '}
                <button
                  onClick={onSignInClick}
                  className="font-bold text-brand-lightBlue hover:text-blue-400 transition-colors"
                >
                  Login here
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Feature Badges Section at bottom */}
      <div className="w-full max-w-md mx-auto px-4 pb-12 select-none z-10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-[#121626]/20 backdrop-blur-sm">
            <div className="h-7 w-7 rounded-full bg-brand-blue/5 border border-brand-blue/15 text-brand-lightBlue flex items-center justify-center mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-lightBlue" />
            </div>
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">ATS Proof</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-[#121626]/20 backdrop-blur-sm">
            <div className="h-7 w-7 rounded-full bg-brand-blue/5 border border-brand-blue/15 text-brand-lightBlue flex items-center justify-center mb-1">
              <Zap className="h-3.5 w-3.5 text-brand-lightBlue" />
            </div>
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Instant Analysis</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-[#121626]/20 backdrop-blur-sm">
            <div className="h-7 w-7 rounded-full bg-brand-blue/5 border border-brand-blue/15 text-brand-lightBlue flex items-center justify-center mb-1">
              <Shield className="h-3.5 w-3.5 text-brand-lightBlue" />
            </div>
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Secure Data</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full text-center py-4 select-none border-t border-white/5">
        <p className="text-[9px] text-brand-textMuted font-sans">
          &copy; 2026 ResumeAI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
