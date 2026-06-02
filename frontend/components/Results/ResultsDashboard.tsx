import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MatchScoreCard from './MatchScoreCard'
import SkillsCard from './SkillsCard'
import MissingSkillsCard from './MissingSkillsCard'
import ImprovementSuggestionsCard from './ImprovementSuggestionsCard'
import MetadataCard from './MetadataCard'
import ATSChecklistCard from './ATSChecklistCard'

interface ResultsDashboardProps {
  fileName?: string
  matchScore?: number
  matchedSkills?: string[]
  missingSkills?: string[]
  onReset: () => void
}

export default function ResultsDashboard({
  fileName = 'resume_v2_final.pdf',
  matchScore = 82,
  matchedSkills = [],
  missingSkills = [],
  onReset
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('analysis')

  const handleSignOut = () => {
    onReset()
  }

  return (
    <div className="flex h-screen w-full bg-[#060814] overflow-hidden text-slate-100 font-sans">
      
      {/* 1. Sidebar Left */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSignOut={handleSignOut} 
      />

      {/* 2. Main Content Right Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#060814]">
        
        {/* Topbar Utility Header */}
        <Topbar title="Analysis Results" />

        {/* Scrollable Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Top Wide Match Score Metric Card */}
            <MatchScoreCard 
              score={matchScore} 
              roleName="Senior Software Engineer" 
              onReset={onReset} 
            />

            {/* Split Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Side: Match Details & Optimization (Span 2) */}
              <div className="lg:col-span-2 space-y-6">
                <SkillsCard skills={matchedSkills} />
                <MissingSkillsCard skills={missingSkills} />
                <ImprovementSuggestionsCard />
              </div>

              {/* Right Side: Document Profile & System Checks (Span 1) */}
              <div className="lg:col-span-1 space-y-6">
                <MetadataCard 
                  fileName={fileName} 
                  targetRole="Senior Software Engineer" 
                  analyzedOn="Oct 24, 2024" 
                />
                <ATSChecklistCard />
              </div>

            </div>

          </div>
        </main>

      </div>

    </div>
  )
}
