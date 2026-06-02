import { useState } from 'react'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import ResultsDashboard from '../components/Results/ResultsDashboard'
import Sidebar from '../components/Results/Sidebar'
import Topbar from '../components/Results/Topbar'
import SkillGapPage from './pages/SkillGapPage'
import ImprovementsPage from './pages/ImprovementsPage'
import { Sparkles, Activity } from 'lucide-react'

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing')
  const [appTab, setAppTab] = useState<string>('analysis')
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
    setAppTab('analysis')
    setView('landing')
  }

  // 1. Marketing / Landing Page View
  if (view === 'landing') {
    return (
      <RootLayout currentView="landing" onNavigate={() => setView('app')}>
        <HomePage onNavigate={() => setView('app')} />
      </RootLayout>
    )
  }

  // 2. High-fidelity Application Workspace Shell View
  const isDocumentReview = analysisResult !== null

  return (
    <div className="flex h-screen w-full bg-[#060814] overflow-hidden text-slate-100 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        mode={isDocumentReview ? 'document' : 'global'}
        activeTab={appTab} 
        onTabChange={setAppTab} 
        onSignOut={handleSignOut} 
      />

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#060814]">
        
        {/* Topbar Utility */}
        <Topbar 
          title={
            appTab === 'skillgap' || appTab === 'keywords'
              ? 'Skill Gap Analysis' 
              : appTab === 'analysis' 
                ? 'Resume Analysis' 
                : appTab === 'formatting'
                  ? 'Suggestions & Improvement'
                  : appTab.charAt(0).toUpperCase() + appTab.slice(1)
          } 
        />

        {/* Dynamic Inner Panel Viewport */}
        <main className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="max-w-5xl mx-auto">
            
            {/* Tab: Resume Analysis */}
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

            {/* Tab: Placeholder pages for static presentation */}
            {['dashboard', 'careerpath', 'savedjobs', 'settings', 'support', 'pro', 'competitors', 'history'].includes(appTab) && (
              <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-12 text-center max-w-xl mx-auto mt-12 space-y-6 backdrop-blur-md shadow-2xl relative overflow-hidden animate-fade-in">
                {/* Background glow highlights */}
                <div className="absolute top-1/2 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[60px] pointer-events-none" />
                
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/5 text-brand-lightBlue border border-brand-blue/10">
                  {appTab === 'pro' ? (
                    <Sparkles className="h-6 w-6 text-brand-lightBlue animate-pulse" />
                  ) : (
                    <Activity className="h-6 w-6 text-brand-lightBlue animate-pulse" />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white tracking-tight font-sans">
                    {appTab === 'pro' ? 'Unlock ResumeAI Pro' : 'Feature Coming Soon'}
                  </h3>
                  <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed font-sans font-light">
                    {appTab === 'pro' 
                      ? 'Upgrade to Pro to access smart career pathing, custom resume building, and direct mock recruiter interviews.' 
                      : `The ${appTab.charAt(0).toUpperCase() + appTab.slice(1)} tool is currently undergoing active optimization.`}
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
