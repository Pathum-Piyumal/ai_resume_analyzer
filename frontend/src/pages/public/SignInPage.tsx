import { useState } from 'react'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import { api } from '../../utils/api'

interface SignInPageProps {
  onSuccess: () => void
  onSignUpClick: () => void
  onForgotClick: () => void
}

export default function SignInPage({ onSuccess, onSignUpClick, onForgotClick }: SignInPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setIsLoading(true)
    setError('')
    try {
      const data = await api.login(email, password)
      localStorage.setItem('resumeiq-auth-token', data.access_token)
      localStorage.setItem('resumeiq-user-role', data.role)
      setIsLoading(false)
      onSuccess()
    } catch (err: any) {
      setIsLoading(false)
      let message = 'Login failed. Please try again.'
      if (err.response) {
        message = err.response.data?.detail || message
      } else if (err.request) {
        message = 'Could not connect to the backend server. Please make sure the backend is running.'
      } else {
        message = err.message || message
      }
      setError(message)
    }
  }

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-left">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[350px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans mt-4">
          Resume<span className="text-brand-lightBlue">AI</span>
        </h2>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Smart Resume. Smart Career.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-brand-card/45 border border-white/5 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-sans font-light">
              {error}
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-sans">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-2 select-none">
                <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-sans">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onForgotClick}
                  className="text-[10px] font-bold text-brand-lightBlue hover:text-blue-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-4 pr-11 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-blue hover:bg-blue-600 py-3 font-semibold text-xs text-white shadow-xl shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <span>LOG IN</span>
                )}
              </button>
            </div>
          </form>

          {/* Social login divider */}
          <div className="mt-6">
            <div className="relative flex justify-center text-xs select-none">
              <span className="px-3 bg-transparent text-[9px] font-bold text-slate-500 uppercase tracking-widest relative z-10">
                Or Continue With
              </span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 z-0" />
            </div>

            <div className="mt-5">
              <button
                onClick={onSuccess}
                className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 hover:border-white/20 bg-[#121626]/80 rounded-xl hover:bg-slate-800/30 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-[0.98]"
                type="button"
              >
                {/* Simulated Google Logo */}
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
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>

          {/* Onboarding trigger */}
          <div className="mt-8 text-center select-none">
            <p className="text-[11px] font-sans font-light text-brand-textMuted">
              Don't have an account?{' '}
              <button
                onClick={onSignUpClick}
                className="font-bold text-brand-lightBlue hover:text-blue-400 transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>


  )
}
