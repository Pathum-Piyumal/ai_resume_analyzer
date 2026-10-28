import { useState } from 'react'
import { Sparkles, Eye, EyeOff, CheckCircle2, Lock, ArrowLeft } from 'lucide-react'
import { api } from '../../utils/api'

interface ResetPasswordPageProps {
  token: string
  onBackToLogin: () => void
}

export default function ResetPasswordPage({ token, onBackToLogin }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) return
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      await api.resetPassword(token, password)
      setIsSubmitted(true)
    } catch (err: any) {
      let message = 'Failed to reset password. The token may be expired or invalid.'
      if (err.response) {
        message = err.response.data?.detail || message
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-left">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[350px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 select-none mt-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans mt-4">
          Resume<span className="text-brand-lightBlue">AI</span>
        </h2>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Smart Resume. Smart Career.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-brand-card/45 border border-white/5 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl backdrop-blur-md relative overflow-hidden">
          
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="text-center select-none">
                <h3 className="text-lg font-bold text-white tracking-tight font-sans">
                  Choose a new password
                </h3>
                <p className="mt-1.5 text-xs text-brand-textMuted font-sans font-light leading-relaxed">
                  Please enter your new password below to recover your account access.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-sans font-light">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* New Password */}
                <div>
                  <label htmlFor="pass" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-sans">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPass" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-sans">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="confirmPass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121626]/60 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
                      disabled={isLoading}
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
                      <span>Saving new password...</span>
                    ) : (
                      <span>RESET PASSWORD</span>
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
                  Password updated!
                </h3>
                <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed font-sans font-light">
                  Your password has been changed successfully. You can now use your new password to log in.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={onBackToLogin}
                  className="w-full rounded-xl bg-brand-blue hover:bg-blue-600 py-3 font-semibold text-xs text-white shadow-xl shadow-brand-blue/15 transition-all active:scale-[0.98]"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
