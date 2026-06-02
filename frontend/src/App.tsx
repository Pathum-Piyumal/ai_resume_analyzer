import { useState } from 'react'
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

export default function App() {
  const [view, setView] = useState<'landing' | 'signin' | 'signup' | 'forgot' | 'app' | 'privacy' | 'terms' | 'support'>('landing')
  const [appTab, setAppTab] = useState<string>('dashboard')
  const [userRole, setUserRole] = useState<'job_seeker' | 'admin'>('job_seeker')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [analysisResult, setAnalysisResult] = useState<{
    fileName: string
    score: number
    matched: string[]
    missing: string[]
  } | null>(null)

  const handleAnalysisComplete = (
    fileName: string, 
    score: number, 
    matched: string[], 
    missing: string[]
  ) => {
    setAnalysisResult({ fileName, score, matched, missing })
    setAppTab('analysis')
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setAppTab('analysis')
  }

  const handleSignOut = () => {
    setAnalysisResult(null)
    setAppTab('dashboard')
    setView('landing')
  }

  const handleViewAnalysis = (row: HistoryRow) => {
    setAnalysisResult({
      fileName: row.fileName,
      score: row.score,
      matched: row.matched,
      missing: row.missing
    })
    setAppTab('analysis')
  }

  // 1. Marketing / Landing Page View
  if (view === 'landing') {
    return (
      <RootLayout currentView="landing" onNavigate={(dest) => setView(dest)}>
        <HomePage onNavigate={(dest) => setView(dest === 'landing' ? 'landing' : 'signup')} />
      </RootLayout>
    )
  }

  if (view === 'signin') {
    return (
      <SignInPage 
        onSuccess={() => setView('app')}
        onSignUpClick={() => setView('signup')}
        onForgotClick={() => setView('forgot')}
      />
    )
  }

  if (view === 'signup') {
    return (
      <SignUpPage 
        onSuccess={(type) => {
          setUserRole(type)
          setView('app')
        }}
        onSignInClick={() => setView('signin')}
      />
    )
  }

  if (view === 'forgot') {
    return (
      <ForgotPasswordPage 
        onBackToLogin={() => setView('signin')}
      />
    )
  }

  if (view === 'privacy') {
    return (
      <RootLayout currentView="landing" onNavigate={(dest) => setView(dest)}>
        <PrivacyPolicyPage />
      </RootLayout>
    )
  }

  if (view === 'terms') {
    return (
      <RootLayout currentView="landing" onNavigate={(dest) => setView(dest)}>
        <TermsOfServicePage />
      </RootLayout>
    )
  }

  if (view === 'support') {
    return (
      <RootLayout currentView="landing" onNavigate={(dest) => setView(dest)}>
        <SupportPage />
      </RootLayout>
    )
  }

  // 2. High-fidelity Application Workspace Shell View
  const isDocumentReview = analysisResult !== null

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'dashboard': return <LayoutDashboard className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'analysis': return <BarChart3 className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'skillgap': 
      case 'keywords': return <Target className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'formatting': return <Sliders className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'history': return <Clock className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'careerpath': return <Compass className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'savedjobs': return <Bookmark className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'settings': return <Settings className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      case 'support': return <HelpCircle className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
      default: return <FileText className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" />
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#060814] overflow-hidden text-slate-100 font-sans">
      
      {/* Sidebar Navigation */}
      {isSidebarOpen && (
        <Sidebar 
          mode={isDocumentReview ? 'document' : 'global'}
          activeTab={appTab} 
          onTabChange={setAppTab} 
          onSignOut={handleSignOut} 
          onClose={() => setIsSidebarOpen(false)}
          onLogoClick={() => setView('landing')}
        />
      )}

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#060814]">
        
        {/* Topbar Utility */}
        <Topbar 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onSettingsClick={() => setAppTab('settings')}
          icon={getTabIcon(appTab)}
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
            
            {/* Tab: Dashboard Overview */}
            {appTab === 'dashboard' && (
              userRole === 'admin' 
                ? <AdminDashboardPage onNewAnalysis={handleReset} />
                : <UserDashboardPage onNewAnalysis={handleReset} />
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
              <SkillGapPage />
            )}

            {/* Tab: Suggestions & Improvements */}
            {appTab === 'formatting' && (
              <ImprovementsPage />
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
              <SavedJobsPage />
            )}

            {/* Tab: Settings */}
            {appTab === 'settings' && (
              <SettingsPage onUpgradeClick={() => setAppTab('pro')} />
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
              <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-12 text-center max-w-xl mx-auto mt-12 space-y-6 backdrop-blur-md shadow-2xl relative overflow-hidden animate-fade-in">
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

          </div>
        </main>

      </div>

    </div>
  )
}
