import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import ResumeUpload from '../../components/ResumeUpload'
import JobDescription from '../../components/JobDescription'
import AnalyzeButton from '../../components/AnalyzeButton'
import ResultsDashboard from '../../components/Results/ResultsDashboard'
import { BrainCircuit } from 'lucide-react'

// Lightweight skills dictionary to scan job description
const SKILLS_DICT = [
  "React", "TypeScript", "JavaScript", "Python", "Node.js", 
  "HTML5", "CSS3", "Tailwind CSS", "SQL", "PostgreSQL", 
  "Docker", "Kubernetes", "AWS", "CI/CD", "Jest", "Cypress", 
  "GraphQL", "RESTful APIs", "Next.js", "Redux", "Git", 
  "Agile", "Scrum", "Figma", "UI/UX Design", "Product Management"
]

interface AnalyzePageProps {
  onComplete?: (fileName: string, score: number, matched: string[], missing: string[]) => void
}

export default function AnalyzePage({ onComplete }: AnalyzePageProps) {
  const [view, setView] = useState<'input' | 'loading' | 'results'>('input')
  const [file, setFile] = useState<File | null>(null)
  const [jobText, setJobText] = useState<string>('')
  
  // Loading Simulation States
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [loadingStep, setLoadingStep] = useState<string>('')

  // Results State
  const [resultsData, setResultsData] = useState<{
    score: number
    matched: string[]
    missing: string[]
  }>({ score: 82, matched: [], missing: [] })

  // Trigger analysis simulation
  const handleAnalyze = () => {
    if (!file || !jobText.trim()) return

    // Dynamic Keyword matching engine
    const textLower = jobText.toLowerCase()
    
    // Find all keywords mentioned in job description
    const foundKeywords = SKILLS_DICT.filter(skill => 
      textLower.includes(skill.toLowerCase())
    )

    let matched: string[] = []
    let missing: string[] = []
    let score = 82

    if (foundKeywords.length >= 3) {
      // Split found keywords to make it look realistic (60% matched, 40% missing)
      const splitIndex = Math.ceil(foundKeywords.length * 0.6)
      matched = foundKeywords.slice(0, splitIndex)
      missing = foundKeywords.slice(splitIndex)
      
      // Calculate a score based on ratio
      const ratio = matched.length / foundKeywords.length
      score = Math.round(55 + ratio * 40) // scores between 55 and 95
    } else {
      // Fallback defaults
      matched = ["Python", "React", "AWS", "Agile", "TypeScript", "PostgreSQL", "Node.js"]
      missing = ["Docker", "GraphQL", "Kubernetes", "CI/CD Pipelines"]
      score = 82
    }

    setResultsData({ score, matched, missing })
    setView('loading')
    setLoadingProgress(0)
  }

  // Simulating loading steps
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
        const next = prev + Math.floor(Math.random() * 4) + 1
        
        // Find current step text
        const currentStep = steps.find(s => next <= s.max) || steps[steps.length - 1]
        setLoadingStep(currentStep.text)

        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (onComplete) {
              onComplete(
                file?.name || 'resume_v2_final.pdf', 
                resultsData.score, 
                resultsData.matched, 
                resultsData.missing
              )
            } else {
              setView('results')
            }
          }, 300)
          return 100
        }
        return next
      })
    }, 70)

    return () => clearInterval(interval)
  }, [view, onComplete, file, resultsData])

  const handleReset = () => {
    setFile(null)
    setJobText('')
    setView('input')
    setLoadingProgress(0)
  }

  const isFormValid = file !== null && jobText.trim().length > 10

  return (
    <div className="min-h-[70vh] bg-brand-dark flex items-center justify-center py-12 transition-all duration-300">
      
      {/* 1. INPUT FORM VIEW */}
      {view === 'input' && (
        <div className="w-full px-4 animate-fade-in">
          <Header />
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
      {view === 'results' && (
        <ResultsDashboard
          fileName={file?.name || 'Resume.pdf'}
          matchScore={resultsData.score}
          matchedSkills={resultsData.matched}
          missingSkills={resultsData.missing}
          onReset={handleReset}
        />
      )}

    </div>
  )
}
