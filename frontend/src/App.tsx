import { useState } from 'react'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import ResultsDashboard from '../components/Results/ResultsDashboard'

export default function App() {
  const [view, setView] = useState<'landing' | 'analyze' | 'results'>('landing')
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
    setView('results')
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setView('analyze')
  }

  if (view === 'results' && analysisResult) {
    return (
      <ResultsDashboard
        fileName={analysisResult.fileName}
        matchScore={analysisResult.score}
        matchedSkills={analysisResult.matched}
        missingSkills={analysisResult.missing}
        onReset={handleReset}
      />
    )
  }

  return (
    <RootLayout currentView={view === 'results' ? 'analyze' : view} onNavigate={setView}>
      {view === 'landing' ? (
        <HomePage onNavigate={setView} />
      ) : (
        <AnalyzePage onComplete={handleAnalysisComplete} />
      )}
    </RootLayout>
  )
}
