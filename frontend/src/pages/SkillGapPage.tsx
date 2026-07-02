import { Award, Compass, Sparkles, ArrowUpRight } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'

interface GaugeWidgetProps {
  score: number
  title: string
  subtitle: string
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void
}

function GaugeWidget({ score, title, subtitle, onMouseMove }: GaugeWidgetProps) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
      onMouseMove={onMouseMove}
      className="group rounded-2xl border border-white/5 bg-[#0C0F1E]/80 p-5 flex items-center gap-4 text-left relative overflow-hidden transition-colors hover:border-white/10"
    >
      {/* Mouse Spotlight */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
        }}
      />
      
      <div className="relative shrink-0 flex items-center justify-center z-10">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="3.5"
            fill="transparent"
          />
          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="stroke-brand-lightBlue"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[11px] font-bold text-white">
          <NumberTicker value={score} suffix="%" />
        </span>
      </div>
      <div className="relative z-10">
        <h4 className="text-xs font-bold text-slate-200 font-sans tracking-wide">
          {title}
        </h4>
        <p className="text-[10px] text-brand-textMuted font-sans">
          {subtitle}
        </p>
      </div>
    </motion.div>
  )
}

interface SkillGapPageProps {
  analysisResult?: any
  onNewAnalysis?: () => void
}

export default function SkillGapPage({ analysisResult, onNewAnalysis }: SkillGapPageProps) {
  if (!analysisResult) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center space-y-6 rounded-2xl border border-white/5 bg-brand-card/45 p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute inset-0 bg-[radial-gradient(180px circle at 50% 50%, rgba(245,158,11,0.05), transparent 85%)]" />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/5 text-amber-500 border border-amber-500/10 relative z-10">
          <Award className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-extrabold text-white tracking-tight font-sans">
            No Resume Analyzed Yet
          </h3>
          <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed font-sans font-light">
            Upload your resume and a target job description first to map out your technical strengths and skills gaps.
          </p>
        </div>
        <div className="pt-2 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewAnalysis}
            className="rounded-xl bg-brand-blue hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-blue/20 transition-all focus:outline-none"
          >
            Start First Analysis
          </motion.button>
        </div>
      </div>
    )
  }

  const matched = analysisResult.resume_skills || []
  const missing = analysisResult.missing_skills || []

  // Get 9 actual skills from this CV analysis dynamically
  const getDynamicCloudSkills = () => {
    const list: { name: string; type: 'missing' | 'matched' }[] = []
    
    // Fill with missing first, then matched
    missing.forEach((skill: string) => {
      list.push({ name: skill, type: 'missing' })
    })
    matched.forEach((skill: string) => {
      list.push({ name: skill, type: 'matched' })
    })
    
    // Fallback static skills if the list is empty (e.g. no skills extracted)
    const fallbacks = ["React", "TypeScript", "System Design", "Docker", "AWS", "Python", "SQL", "Git", "Kubernetes", "Next.js", "Redis", "Microservices", "CI/CD"]
    while (list.length < 9 && fallbacks.length > 0) {
      const fb = fallbacks.shift()!
      if (!list.some(item => item.name.toLowerCase() === fb.toLowerCase())) {
        list.push({ name: fb, type: Math.random() > 0.5 ? 'missing' : 'matched' })
      }
    }
    
    return list.slice(0, 9)
  }

  const cloudSkills = getDynamicCloudSkills()

  const getSkillStyle = (item: { name: string; type: 'missing' | 'matched' }, isFeatured: boolean) => {
    if (item.type === 'missing') {
      if (isFeatured) {
        return "bg-amber-600/10 border-amber-600/30 text-amber-500 hover:bg-amber-600/15"
      }
      return "bg-amber-500/5 border-amber-500/15 text-amber-400/90 hover:bg-amber-500/10 animate-pulse-slow"
    } else {
      if (isFeatured) {
        return "bg-emerald-600/10 border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/15"
      }
      const hashes = item.name.length % 2 === 0
      if (hashes) {
        return "bg-brand-blue/15 border-brand-blue/20 text-brand-lightBlue hover:bg-brand-blue/20"
      }
      return "border-white/10 text-slate-300 hover:border-white/20"
    }
  }

  const formatSkillName = (name: string) => {
    if (!name) return "";
    const lower = name.toLowerCase();
    if (["aws", "ci/cd", "nlp", "sql", "api", "rest", "ui", "ux", "html", "css", "db", "ml", "ai", "git", "sse", "jwt"].includes(lower)) {
      return name.toUpperCase();
    }
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const getRecommendationText = () => {
    if (analysisResult?.career_suggestions?.[0]) {
      return analysisResult.career_suggestions[0]
    }
    if (missing.length > 0) {
      const topMissing = missing.slice(0, 2).map((s: string) => formatSkillName(s)).join(' and ')
      return `Focus on acquiring skills or certifications in ${topMissing}. These represent critical gaps for the target ${jobTitle} role.`
    }
    return `Excellent match! Your resume contains all the essential skills required for the ${jobTitle} role. Focus on formatting and polishing your experience achievements.`
  }

  const skillGaps = [
    ...matched.slice(0, 6).map((skill: string) => ({
      name: skill.toUpperCase(),
      yourLevel: 90,
      required: 80,
      badge: "Strength",
      isAhead: true
    })),
    ...missing.slice(0, 6).map((skill: string) => ({
      name: skill.toUpperCase(),
      yourLevel: 45,
      required: 85,
      badge: "Skill Gap",
      isAhead: false
    }))
  ]

  const jobTitle = analysisResult.jobs?.[0]?.title || analysisResult.file_name?.replace('.pdf', '').replace(/[-_]/g, ' ').toUpperCase() || 'Target Role'
  const strengthsCount = matched.length
  const gapsCount = missing.length

  const techScore = Math.round(analysisResult.match_score)
  const softScore = 80 + Math.min(20, strengthsCount * 2)
  const totalSkillsCount = strengthsCount + gapsCount
  const toolsScore = totalSkillsCount > 0 ? Math.round((strengthsCount / totalSkillsCount) * 100) : 0
  
  const hasCerts = analysisResult.resume_text_preview?.toLowerCase().includes('cert') || false
  const certsScore = hasCerts ? 85 : 30

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 140, 
        damping: 18 
      } 
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 text-left relative min-h-[80vh]"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-brand-blue/5 blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-12 left-1/4 h-80 w-80 rounded-full bg-indigo-500/5 blur-[95px] pointer-events-none z-0" />

      {/* 1. Header Intro */}
      <motion.div variants={itemVariants} className="relative z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mb-2">
          Skill Gap Analysis
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted font-sans font-light leading-relaxed max-w-3xl">
          Comparing your current profile against the <span className="text-slate-200 font-semibold">{jobTitle}</span> requirements. We've identified <span className="text-slate-200 font-semibold">{gapsCount} critical gaps</span> and <span className="text-slate-200 font-semibold">{strengthsCount} areas of expertise</span>.
        </p>
      </motion.div>

      {/* 2. Main Comparison Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative z-10">
        
        {/* Left Column: Skill Match Comparison Chart (Span 2) */}
        <motion.div 
          variants={itemVariants}
          onMouseMove={handleMouseMove}
          className="group lg:col-span-2 rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-6 relative overflow-hidden transition-colors hover:border-white/10"
        >
          {/* Mouse Spotlight */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.04), transparent 80%)'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-0.5">
                  Skill Match Comparison
                </h3>
                <p className="text-[10px] text-brand-textMuted font-sans">
                  Direct comparison with market benchmarks
                </p>
              </div>
              
              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-[10px] text-brand-textMuted font-medium font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
                  <span>Your Level</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
                  <span>Required</span>
                </div>
              </div>
            </div>

            {/* Bar Chart list */}
            <div className="space-y-6 pt-4">
              {skillGaps.map((gap, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200 font-sans">{gap.name}</span>
                    <span className={gap.isAhead ? "text-emerald-400 font-sans" : "text-amber-500 font-sans"}>
                      {gap.badge}
                    </span>
                  </div>
                  
                  {/* Horizontal Progress Bars */}
                  <div className="space-y-2">
                    {/* Your Level (Blue) */}
                    <div className="space-y-0.5">
                      <div className="h-1.5 w-full bg-slate-800/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className="h-full bg-brand-blue rounded-full shadow-lg shadow-brand-blue/30"
                          initial={{ width: 0 }}
                          animate={{ width: `${gap.yourLevel}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 * index }}
                        />
                      </div>
                    </div>
                    {/* Required (Orange) */}
                    <div className="space-y-0.5">
                      <div className="h-1.5 w-full bg-slate-800/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className="h-full bg-amber-600 rounded-full shadow-lg shadow-amber-600/30"
                          initial={{ width: 0 }}
                          animate={{ width: `${gap.required}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 * index }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Demand Cloud & AI recommendations (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card: Demand Cloud */}
          <motion.div 
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left space-y-4 relative overflow-hidden transition-colors hover:border-white/10"
          >
            {/* Mouse Spotlight */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
              }}
            />
            
            <div className="relative z-10 flex flex-col space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-0.5">
                  Demand Cloud
                </h3>
                <p className="text-[10px] text-brand-textMuted font-sans">
                  Most frequent keywords in current job market
                </p>
              </div>

              {/* Keyword tags flex cloud cluster */}
              <div className="flex flex-wrap items-center justify-center gap-3 py-3 relative min-h-[190px]">
                {/* Featured: Skill 0 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className={`inline-flex px-7 py-3 rounded-full text-sm font-bold border shadow-xl select-none transition-all ${getSkillStyle(cloudSkills[0], true)}`}>
                    {formatSkillName(cloudSkills[0].name)}
                  </span>
                </div>

                {/* Surrounding floating tags */}
                <div className="w-full flex justify-between gap-6 px-1 z-0">
                  <span className={`inline-flex px-4 py-2 rounded-xl text-xs font-bold border select-none transition-all ${getSkillStyle(cloudSkills[1], false)}`}>
                    {formatSkillName(cloudSkills[1].name)}
                  </span>
                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] border select-none transition-all ${getSkillStyle(cloudSkills[2], false)}`}>
                    {formatSkillName(cloudSkills[2].name)}
                  </span>
                </div>
                <div className="w-full flex justify-around gap-4 z-0 mt-2">
                  <span className={`inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold border select-none transition-all ${getSkillStyle(cloudSkills[3], false)}`}>
                    {formatSkillName(cloudSkills[3].name)}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] border select-none transition-all ${getSkillStyle(cloudSkills[4], false)}`}>
                    {formatSkillName(cloudSkills[4].name)}
                  </span>
                </div>
                <div className="w-full flex justify-around gap-6 z-0 mt-8">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] border select-none transition-all ${getSkillStyle(cloudSkills[5], false)}`}>
                    {formatSkillName(cloudSkills[5].name)}
                  </span>
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] border select-none transition-all ${getSkillStyle(cloudSkills[6], false)}`}>
                    {formatSkillName(cloudSkills[6].name)}
                  </span>
                </div>
                <div className="w-full flex justify-between gap-6 px-1 z-0 mt-2">
                  <span className={`inline-flex px-4.5 py-2 rounded-xl text-xs font-semibold border select-none transition-all ${getSkillStyle(cloudSkills[7], false)}`}>
                    {formatSkillName(cloudSkills[7].name)}
                  </span>
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] border select-none transition-all ${getSkillStyle(cloudSkills[8], false)}`}>
                    {formatSkillName(cloudSkills[8].name)}
                  </span>
                </div>
              </div>

              {/* AI Recommendation Alert Sheet */}
              <div className="p-3.5 bg-brand-blue/5 rounded-xl border border-brand-blue/10 space-y-2.5">
                <div className="flex items-center gap-1.5 text-brand-lightBlue font-bold text-xs">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>AI Recommendation</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-normal font-sans font-light">
                  {getRecommendationText()}
                </p>

                {analysisResult?.courses && analysisResult.courses.length > 0 && (
                  <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Improvement Courses</span>
                    {analysisResult.courses.slice(0, 3).map((course: any, idx: number) => (
                      <a 
                        key={idx}
                        href={course.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-[10px] text-white font-medium hover:text-brand-lightBlue transition-all"
                      >
                        <span>{course.platform}: Learn {course.skill}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 hover:text-brand-lightBlue" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* 3. Bottom Gauge Widget Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <GaugeWidget score={techScore} title="Technical Skills" subtitle="Foundational Core" onMouseMove={handleMouseMove} />
        <GaugeWidget score={softScore} title="Soft Skills" subtitle="EQ & Leadership" onMouseMove={handleMouseMove} />
        <GaugeWidget score={toolsScore} title="Tools" subtitle="Platform Proficiency" onMouseMove={handleMouseMove} />
        <GaugeWidget score={certsScore} title="Certifications" subtitle="Industry Validation" onMouseMove={handleMouseMove} />
      </motion.div>

    </motion.div>
  )
}
