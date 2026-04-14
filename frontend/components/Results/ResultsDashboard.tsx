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
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      
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
  )
}
