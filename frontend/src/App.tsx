import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api, AnalysisResult } from './utils/api'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/public/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import ResultsDashboard from '../components/Results/ResultsDashboard'
import Sidebar from '../components/Results/Sidebar'
import Topbar from '../components/Results/Topbar'
import SkillGapPage from './pages/SkillGapPage'
import ImprovementsPage from './pages/ImprovementsPage'
import HistoryPage, { HistoryRow } from './pages/HistoryPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import UserDashboardPage from './pages/UserDashboardPage'
import SignInPage from './pages/public/SignInPage'
import SignUpPage from './pages/public/SignUpPage'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage'
import ResetPasswordPage from './pages/public/ResetPasswordPage'
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage'
import TermsOfServicePage from './pages/public/TermsOfServicePage'
import SettingsPage from './pages/SettingsPage'
import SupportPage from './pages/public/SupportPage'
import CareerPathPage from './pages/CareerPathPage'
import SavedJobsPage from './pages/SavedJobsPage'
import ProUpgradePage from './pages/ProUpgradePage'
import { 
  Sparkles, 
  Activity, 
  LayoutDashboard, 
  BarChart3, 
  Target,
  Compass, 
  Bookmark,
  Clock,
  HelpCircle, 
  Settings,
  Sliders,
  FileText
} from 'lucide-react'

export interface FullAnalysisResult extends AnalysisResult {
  file_name: string
  // For backwards compatibility:
  fileName?: string
  score?: number
  matched?: string[]
  missing?: string[]
  scanned_at?: string
}

export default function App() {
  const [view, setView] = useState<'landing' | 'signin' | 'signup' | 'forgot' | 'reset-password' | 'app' | 'privacy' | 'terms' | 'support'>('landing')
  const [appTab, setAppTab] = useState<string>('dashboard')
  const [userRole, setUserRole] = useState<'job_seeker' | 'admin'>('job_seeker')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [analysisResult, setAnalysisResult] = useState<FullAnalysisResult | null>(null)
  const [resetToken, setResetToken] = useState<string>('')
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  // ── Theme State ──────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('resumeiq-theme') as 'dark' | 'light') ?? 'dark'
  })

  // Check user session on app mount
  useEffect(() => {
    // 1. Check if we have a password reset token in the URL first
    const params = new URLSearchParams(window.location.search)
    const token = params.get('reset_token')
    if (token) {
      setResetToken(token)
      setView('reset-password')
      // Clean query params from URL without refreshing page
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    // 2. Check for Stripe checkout / simulation upgrade success callbacks
    const upgradeSim = params.get('upgrade_simulation')
    const upgradeStatus = params.get('upgrade')
    if (upgradeSim === 'true' || upgradeStatus === 'success') {
      const runUpgrade = async () => {
        try {
          const authToken = localStorage.getItem('resumeiq-auth-token')
          if (authToken) {
            await api.upgradeToPro()
            alert("Upgrade Successful! You have unlocked ResumeIQ Pro features.")
            setView('app')
            setAppTab('dashboard')
            window.location.reload()
          }
        } catch (err) {
          console.error("Simulation upgrade call failed:", err)
        }
      }
      runUpgrade()
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    const checkSession = async () => {
      const token = localStorage.getItem('resumeiq-auth-token')
      if (token) {
        try {
          const user = await api.getMe()
          setUserRole(user.role)
          setView('app')
          
          // Try to sync with user setting preferred theme
          const settings = await api.getSettings()
          setTheme(settings.theme as 'dark' | 'light')
          setAvatarUrl(settings.avatar || '')

          // --- FETCH USER'S LATEST SCAN ---
          if (user.role === 'job_seeker') {
            try {
              const history = await api.getScanHistory()
              if (history && history.length > 0) {
                const latest = history[0]
                const detail = await api.getScanDetail(latest.id)
                const result = typeof detail.parsed_data === 'string' 
                  ? JSON.parse(detail.parsed_data) 
                  : detail.parsed_data
                setAnalysisResult({
                  ...result,
                  file_name: detail.file_name,
                  fileName: detail.file_name,
                  score: detail.match_score,
                  matched: result.resume_skills || result.matched_skills || [],
                  missing: result.missing_skills || [],
                  scanned_at: detail.scanned_at
                })
              }
            } catch (scanErr) {
              console.error("Failed to load user latest scan on mount:", scanErr)
            }
          }
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem('resumeiq-auth-token')
          localStorage.removeItem('resumeiq-user-role')
          setView('landing')
        }
      }
    }
    checkSession()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark-mode')
      root.classList.add('light-mode')
    } else {
      root.classList.remove('light-mode')
      root.classList.add('dark-mode')
    }
    localStorage.setItem('resumeiq-theme', theme)
  }, [theme])

  const handleToggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  const handleAuthSuccess = async (role: 'job_seeker' | 'admin' = 'job_seeker') => {
    setUserRole(role)
    setView('app')
    try {
      const settings = await api.getSettings()
      setTheme(settings.theme as 'dark' | 'light')
      setAvatarUrl(settings.avatar || '')
    } catch {
      // Ignore setup fetch error on login
    }
  }

  const handleAnalysisComplete = (
    fileName: string, 
    result: AnalysisResult
  ) => {
    setAnalysisResult({
      ...result,
      file_name: fileName,
      fileName: fileName,
      score: result.match_score,
      matched: result.resume_skills,
      missing: result.missing_skills,
      scanned_at: new Date().toISOString()
    })
    setAppTab('analysis')
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setAppTab('analysis')
  }

  const handleSignOut = () => {
    localStorage.removeItem('resumeiq-auth-token')
    localStorage.removeItem('resumeiq-user-role')
    setAnalysisResult(null)
    setAvatarUrl('')
    setAppTab('dashboard')
    setView('landing')
  }

  const handleViewAnalysis = (row: HistoryRow) => {
    // HistoryRow will feed the parsed_data back
    const result = typeof row.parsed_data === 'string' 
      ? JSON.parse(row.parsed_data) 
      : row.parsed_data

    setAnalysisResult({
      ...result,
      file_name: row.fileName,
      fileName: row.fileName,
      score: row.score,
      matched: row.matched,
      missing: row.missing,
      scanned_at: row.scanned_at
    })
    setAppTab('analysis')
  }

  const isDocumentReview = analysisResult !== null

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'dashboard': return <LayoutDashboard className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'analysis': return <BarChart3 className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'skillgap': 
      case 'keywords': return <Target className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'formatting': return <Sliders className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'history': return <Clock className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'careerpath': return <Compass className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'savedjobs': return <Bookmark className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'settings': return <Settings className="h-5 w-5 text-brand-lightBlue shrink-0" />
      case 'support': return <HelpCircle className="h-5 w-5 text-brand-lightBlue shrink-0" />
      default: return <FileText className="h-5 w-5 text-brand-lightBlue shrink-0" />
    }
  }

  const renderView = () => {
    switch(view) {
      case 'landing':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <RootLayout currentView="landing" onNavigate={(dest) => {
              const isLoggedIn = !!localStorage.getItem('resumeiq-auth-token')
              setView(isLoggedIn ? 'app' : dest)
            }} theme={theme} onToggleTheme={handleToggleTheme}>
              <HomePage onNavigate={(dest) => {
                const isLoggedIn = !!localStorage.getItem('resumeiq-auth-token')
                if (isLoggedIn) {
                  setView('app')
                } else {
                  setView('signup')
                }
              }} />
            </RootLayout>
          </motion.div>
        )
      case 'signin':
        return (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full min-h-screen"
          >
            <SignInPage 
              onSuccess={() => {
                const role = (localStorage.getItem('resumeiq-user-role') as 'job_seeker' | 'admin') || 'job_seeker'
                handleAuthSuccess(role)
              }}
              onSignUpClick={() => setView('signup')}
              onForgotClick={() => setView('forgot')}
            />
          </motion.div>
        )
      case 'signup':
        return (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full min-h-screen"
          >
            <SignUpPage 
              onSuccess={(type) => {
                handleAuthSuccess(type)
              }}
              onSignInClick={() => setView('signin')}
            />
          </motion.div>
        )
      case 'forgot':
        return (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full min-h-screen"
          >
            <ForgotPasswordPage 
              onBackToLogin={() => setView('signin')}
            />
          </motion.div>
        )
      case 'reset-password':
        return (
          <motion.div
            key="reset-password"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full min-h-screen"
          >
            <ResetPasswordPage 
              token={resetToken}
              onBackToLogin={() => setView('signin')}
            />
          </motion.div>
        )
      case 'privacy':
        return (
          <motion.div
            key="privacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <RootLayout currentView="landing" onNavigate={(dest) => setView(dest)} theme={theme} onToggleTheme={handleToggleTheme}>
              <PrivacyPolicyPage />
            </RootLayout>
          </motion.div>
        )
      case 'terms':
        return (
          <motion.div
            key="terms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <RootLayout currentView="landing" onNavigate={(dest) => setView(dest)} theme={theme} onToggleTheme={handleToggleTheme}>
              <TermsOfServicePage />
            </RootLayout>
          </motion.div>
        )
      case 'support':
        return (
          <motion.div
            key="support"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <RootLayout currentView="landing" onNavigate={(dest) => setView(dest)} theme={theme} onToggleTheme={handleToggleTheme}>
              <SupportPage />
            </RootLayout>
          </motion.div>
        )
      case 'app':
        return (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-300 ${theme === 'light' ? 'bg-[#F0F4F8] text-slate-900' : 'bg-brand-dark text-slate-100'}`}
          >
            
            {/* Sidebar Navigation */}
            {isSidebarOpen && (
              <Sidebar 
                mode={isDocumentReview ? 'document' : 'global'}
                activeTab={appTab} 
                onTabChange={setAppTab} 
                onSignOut={handleSignOut} 
                onClose={() => setIsSidebarOpen(false)}
                onLogoClick={() => setView('landing')}
                theme={theme}
              />
            )}

            {/* Main Workspace Frame */}
            <div className={`flex-grow flex flex-col h-full overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-[#F0F4F8]' : 'bg-brand-dark'}`}>
              
              {/* Topbar Utility */}
              <Topbar 
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(true)}
                onSettingsClick={() => setAppTab('settings')}
                icon={getTabIcon(appTab)}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                searchQuery={globalSearchQuery}
                onSearchChange={setGlobalSearchQuery}
                userAvatar={avatarUrl || undefined}
                title={
                  appTab === 'skillgap' || appTab === 'keywords'
                    ? 'Skill Gap Analysis' 
                    : appTab === 'analysis' 
                      ? 'Resume Analysis' 
                      : appTab === 'formatting'
                        ? 'Suggestions & Improvement'
                        : appTab === 'history'
                          ? 'History'
                          : appTab === 'dashboard'
                            ? 'Overview'
                            : appTab.charAt(0).toUpperCase() + appTab.slice(1)
                } 
              />

              {/* Dynamic Inner Panel Viewport */}
              <main className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="max-w-5xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={appTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Tab: Dashboard Overview */}
                      {appTab === 'dashboard' && (
                        userRole === 'admin' 
                          ? <AdminDashboardPage onNewAnalysis={handleReset} />
                          : <UserDashboardPage 
                              onNewAnalysis={handleReset} 
                              onViewInsights={() => setAppTab('careerpath')} 
                            />
                      )}

                      {/* Tab: Resume Analysis / New Analysis */}
                      {appTab === 'analysis' && (
                        analysisResult === null ? (
                          <AnalyzePage onComplete={handleAnalysisComplete} />
                        ) : (
                          <ResultsDashboard
                            fileName={analysisResult.fileName}
                            matchScore={analysisResult.score}
                            matchedSkills={analysisResult.matched}
                            missingSkills={analysisResult.missing}
                            onReset={handleReset}
                          />
                        )
                      )}

                      {/* Tab: Skill Gap Analysis */}
                      {(appTab === 'skillgap' || appTab === 'keywords') && (
                        <SkillGapPage analysisResult={analysisResult} onNewAnalysis={handleReset} />
                      )}

                      {/* Tab: Suggestions & Improvements */}
                      {appTab === 'formatting' && (
                        <ImprovementsPage analysisResult={analysisResult} onNewAnalysis={handleReset} />
                      )}

                      {/* Tab: Analysis History list */}
                      {appTab === 'history' && (
                        <HistoryPage 
                          onViewAnalysis={handleViewAnalysis} 
                          onNewAnalysis={handleReset} 
                        />
                      )}

                      {/* Tab: Career Path */}
                      {appTab === 'careerpath' && (
                        <CareerPathPage />
                      )}

                      {/* Tab: Saved Jobs */}
                      {appTab === 'savedjobs' && (
                        <SavedJobsPage 
                          analysisResult={analysisResult} 
                          onNewAnalysis={handleReset} 
                          searchQuery={globalSearchQuery}
                          onSearchQueryChange={setGlobalSearchQuery}
                        />
                      )}

                      {/* Tab: Settings */}
                      {appTab === 'settings' && (
                        <SettingsPage 
                          onUpgradeClick={() => setAppTab('pro')} 
                          theme={theme}
                          onThemeChange={(newTheme) => setTheme(newTheme)}
                          avatar={avatarUrl}
                          onAvatarChange={setAvatarUrl}
                        />
                      )}

                      {/* Tab: Support */}
                      {appTab === 'support' && (
                        <SupportPage />
                      )}

                      {/* Tab: Pro Upgrade Page */}
                      {appTab === 'pro' && (
                        <ProUpgradePage onUpgradeClick={(plan) => setAppTab('settings')} />
                      )}

                      {/* Tab: Placeholder pages for static presentation */}
                      {['competitors'].includes(appTab) && (
                        <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-12 text-center max-w-xl mx-auto mt-12 space-y-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/5 text-brand-lightBlue border border-brand-blue/10">
                            <Activity className="h-6 w-6 text-brand-lightBlue animate-pulse" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-extrabold text-white tracking-tight font-sans">
                              Feature Coming Soon
                            </h3>
                            <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed font-sans font-light">
                              The {appTab.charAt(0).toUpperCase() + appTab.slice(1)} tool is currently undergoing active optimization.
                            </p>
                          </div>
                          <div className="pt-2">
                            <button
                              onClick={() => setAppTab('analysis')}
                              className="rounded-xl bg-brand-blue hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-blue/15 transition-all active:scale-[0.98]"
                              type="button"
                            >
                              Return to Resume Analysis
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>

            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence mode="wait">
      {renderView()}
    </AnimatePresence>
  )
}
