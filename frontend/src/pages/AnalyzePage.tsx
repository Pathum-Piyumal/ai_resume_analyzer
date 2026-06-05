import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import ResumeUpload from '../../components/ResumeUpload'
import JobDescription from '../../components/JobDescription'
import AnalyzeButton from '../../components/AnalyzeButton'
import ResultsDashboard from '../../components/Results/ResultsDashboard'
import { BrainCircuit } from 'lucide-react'
import { api, AnalysisResult } from '../utils/api'

interface AnalyzePageProps {
  onComplete?: (fileName: string, result: AnalysisResult) => void
}

export default function AnalyzePage({ onComplete }: AnalyzePageProps) {
  const [view, setView] = useState<'input' | 'loading' | 'results'>('input')
  const [file, setFile] = useState<File | null>(null)
  const [jobText, setJobText] = useState<string>('')
  
  // Loading Simulation States
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [loadingStep, setLoadingStep] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [apiResult, setApiResult] = useState<AnalysisResult | null>(null)

  // Trigger real backend analysis
  const handleAnalyze = async () => {
    if (!file || !jobText.trim()) return

    setView('loading')
    setLoadingProgress(0)
    setError('')
    setApiResult(null)

    try {
      const result = await api.analyzeResume(file, jobText)
      setApiResult(result)
    } catch (err: any) {
      setView('input')
      let msg = 'An error occurred during resume analysis. Please try again.'
      if (err.response) {
        msg = err.response.data?.detail || msg
      } else if (err.request) {
        msg = 'Could not connect to the backend server. Please make sure the backend is running.'
      } else {
        msg = err.message || msg
      }
      setError(msg)
    }
  }

  // Simulating loading steps bound to API resolution
  useEffect(() => {
    if (view !== 'loading') return

    const steps = [
      { max: 20, text: 'Parsing resume document formatting...' },
      { max: 45, text: 'Extracting skills and credential entities...' },
      { max: 70, text: 'Cross-referencing job requirements with qualifications...' },
      { max: 90, text: 'Analyzing ATS matching compatibility...' },
      { max: 100, text: 'Compiling final career recommendations...' }
    ]

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        let next = prev
        
        if (!apiResult) {
          // Keep ticking up to 90% while the API call is in progress
          if (prev < 90) {
            next = prev + Math.floor(Math.random() * 4) + 1
            if (next > 90) next = 90
          }
        } else {
          // Speed up to 100% once we have the result
          next = prev + Math.floor(Math.random() * 12) + 5
          if (next >= 100) {
            next = 100
            clearInterval(interval)
            setTimeout(() => {
              if (onComplete && file) {
                onComplete(file.name, apiResult)
              } else {
                setView('results')
              }
            }, 300)
          }
        }

        // Find current step text
        const currentStep = steps.find(s => next <= s.max) || steps[steps.length - 1]
        setLoadingStep(currentStep.text)

        return next
      })
    }, 80)

    return () => clearInterval(interval)
  }, [view, onComplete, file, apiResult])

  const handleReset = () => {
    setFile(null)
    setJobText('')
    setView('input')
    setLoadingProgress(0)
    setApiResult(null)
    setError('')
  }

  const isFormValid = file !== null && jobText.trim().length > 10

  return (
    <div className="min-h-[70vh] bg-brand-dark flex items-center justify-center py-12 transition-all duration-300">
      
      {/* 1. INPUT FORM VIEW */}
      {view === 'input' && (
        <div className="w-full px-4 animate-fade-in">
          <Header />
          {error && (
            <div className="max-w-xl mx-auto mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-sans font-light text-center">
              {error}
            </div>
          )}
          <div className="max-w-xl mx-auto rounded-2xl border border-white/5 bg-brand-card/20 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Spotlight blur */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand-blue/10 blur-[60px] pointer-events-none" />
            
            <ResumeUpload file={file} onFileChange={setFile} />
            <JobDescription text={jobText} onTextChange={setJobText} />
            <AnalyzeButton 
              onClick={handleAnalyze} 
              disabled={!isFormValid} 
              loading={false} 
            />
          </div>
        </div>
      )}

      {/* 2. LOADING SIMULATOR VIEW */}
      {view === 'loading' && (
        <div className="w-full max-w-md mx-auto px-6 text-center animate-fade-in">
          <div className="relative inline-flex items-center justify-center p-5 rounded-3xl bg-brand-blue/5 border border-brand-blue/15 mb-6 animate-pulse-slow">
            <BrainCircuit className="h-12 w-12 text-brand-lightBlue" />
            {/* Outer spinning ring element */}
            <div className="absolute inset-0 rounded-3xl border border-dashed border-brand-blue/35 animate-[spin_8s_linear_infinite]" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2 font-sans">
            AI Engine in Action
          </h2>
          <p className="text-xs text-brand-textMuted font-sans mb-8">
            Please wait while ResumeIQ computes matching compatibility.
          </p>

          {/* Glassmorphic progress container */}
          <div className="relative h-2 w-full bg-brand-card rounded-full overflow-hidden border border-white/5 mb-4">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-blue to-brand-lightBlue rounded-full shadow-lg shadow-brand-blue/50 transition-all duration-100 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Progress labels */}
          <div className="flex items-center justify-between text-[11px] font-mono text-brand-textMuted mb-2 px-1">
            <span className="animate-pulse">{loadingStep}</span>
            <span className="font-semibold text-white">{loadingProgress}%</span>
          </div>
        </div>
      )}

      {/* 3. DASHBOARD VIEW */}
      {view === 'results' && apiResult && (
        <ResultsDashboard
          fileName={file?.name || 'Resume.pdf'}
          matchScore={apiResult.match_score}
          matchedSkills={apiResult.resume_skills}
          missingSkills={apiResult.missing_skills}
          onReset={handleReset}
        />
      )}

    </div>
  )
}
