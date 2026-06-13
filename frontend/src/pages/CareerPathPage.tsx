import { useState, useEffect } from 'react'
import { 
  Briefcase, 
  ArrowUpRight, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  Compass, 
  Clock, 
  GraduationCap,
  X,
  Star,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'
import { api } from '../utils/api'

export default function CareerPathPage() {
  const [showCourses, setShowCourses] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [careerSteps, setCareerSteps] = useState<any[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([])
  const [guidedProjects, setGuidedProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const data = await api.getCareerPath()
        setCareerSteps(data.career_steps || [])
        setRecommendedCourses(data.recommended_courses || [])
        setGuidedProjects(data.guided_projects || [])
      } catch (err) {
        console.error("Failed to fetch career path roadmap", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCareerData()
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
        <p className="text-xs text-brand-textMuted font-sans">Compiling AI career roadmap...</p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-8 text-left relative min-h-[80vh]"
    >
      {/* Ambient Orbs */}
      <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-brand-blue/5 blur-[80px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <motion.div variants={itemVariants} className="relative z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          AI Career Path
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Your personalized career trajectory based on your skills and market trends.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl relative">
            <div className="absolute top-8 bottom-8 left-[38px] w-px bg-white/10 z-0" />
            
            <div className="space-y-8 relative z-10">
              {careerSteps.map((step) => (
                <div key={step.id} className={`flex gap-6 ${step.status === 'completed' ? 'opacity-60' : ''}`}>
                  <div className="relative mt-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 bg-brand-card z-10 relative
                      ${step.status === 'completed' ? 'border-emerald-500 text-emerald-500' : 
                        step.status === 'current' ? 'border-brand-lightBlue text-brand-lightBlue shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 
                        'border-slate-700 text-slate-500'}`}
                    >
                      {step.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                       step.status === 'current' ? <Compass className="h-4 w-4 animate-pulse" /> :
                       <Circle className="h-3 w-3" />}
                    </div>
                  </div>
                  
                  <motion.div 
                    variants={itemVariants}
                    whileHover={step.status !== 'completed' ? { y: -2, scale: 1.005, transition: { duration: 0.2 } } : {}}
                    onMouseMove={handleMouseMove}
                    className={`group flex-1 rounded-xl border p-5 transition-all relative overflow-hidden
                      ${step.status === 'current' ? 'border-brand-blue/30 bg-brand-blue/5' : 
                        step.status === 'next' ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10' : 
                        'border-white/5 bg-transparent'}`}
                  >
                    {/* Mouse Spotlight */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
                      }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight font-sans">
                            {step.role}
                          </h3>
                          <div className="flex items-center gap-4 mt-1.5 text-[11px] font-sans text-brand-textMuted">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5" />
                              {step.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {step.duration}
                            </span>
                          </div>
                        </div>
                        
                        {step.status === 'next' && step.match && (
                          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20">
                            <span className="text-[10px] font-bold text-brand-lightBlue uppercase tracking-wider">Skill Match</span>
                            <span className="text-sm font-bold text-white font-mono">
                              <NumberTicker value={step.match} suffix="%" />
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans block">
                          Required Core Skills
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {step.skills.map((skill: string, i: number) => (
                            <span 
                              key={i} 
                              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${
                                step.status === 'completed' || step.status === 'current' 
                                  ? 'bg-slate-800 text-slate-300 border-white/5' 
                                  : 'bg-transparent text-slate-400 border-white/10'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
            onMouseMove={handleMouseMove}
            className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl text-left relative overflow-hidden transition-colors hover:border-white/10"
          >
            {/* Mouse Spotlight */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-brand-lightBlue" />
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  Next Steps to Level Up
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#121626] border border-white/5 hover:border-white/10 transition-colors">
                  <h4 className="text-xs font-bold text-white mb-1.5">Master System Design</h4>
                  <p className="text-[11px] text-brand-textMuted font-light leading-relaxed mb-3">
                    Crucial for transitioning to a Senior role. Focus on scalable architecture and distributed systems.
                  </p>
                  <button 
                    onClick={() => setShowCourses(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-lightBlue hover:text-blue-400 bg-transparent border-none cursor-pointer p-0 focus:outline-none"
                  >
                    View Recommended Courses <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="p-4 rounded-xl bg-[#121626] border border-white/5 hover:border-white/10 transition-colors">
                  <h4 className="text-xs font-bold text-white mb-1.5">Improve CI/CD Knowledge</h4>
                  <p className="text-[11px] text-brand-textMuted font-light leading-relaxed mb-3">
                    Your current resume lacks strong devops skills which are highly valued in senior roles.
                  </p>
                  <button 
                    onClick={() => setShowProjects(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-lightBlue hover:text-blue-400 bg-transparent border-none cursor-pointer p-0 focus:outline-none"
                  >
                    Explore Guided Projects <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
            onMouseMove={handleMouseMove}
            className="group rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-md shadow-xl text-left relative overflow-hidden"
          >
            {/* Mouse Spotlight */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.05), transparent 80%)'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  Market Outlook
                </h3>
              </div>
              <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                Demand for <strong className="text-white">Senior Frontend Engineers</strong> is projected to grow by 14% over the next 2 years. Top paying sectors include Fintech and AI startups.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recommended Courses Modal */}
      <AnimatePresence>
        {showCourses && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCourses(false)}
              className="absolute inset-0 bg-[#060814]/85 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1225] p-6 shadow-2xl z-10 space-y-6 text-left max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-brand-lightBlue" />
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    Recommended Courses
                  </h3>
                </div>
                <button onClick={() => setShowCourses(false)} className="text-slate-400 hover:text-white transition-colors focus:outline-none" title="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {recommendedCourses.map((course, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#161b33] border border-white/5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{course.title}</h4>
                        <p className="text-[10px] text-brand-lightBlue font-medium mt-1 font-sans">{course.platform} • {course.level}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-amber-400 text-[10px] font-bold">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-brand-textMuted pt-1">
                      <span>Duration: {course.duration}</span>
                      <a href="#" className="flex items-center gap-1 font-bold text-brand-lightBlue hover:text-blue-400 focus:outline-none">
                        Enroll Now <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guided Projects Modal */}
      <AnimatePresence>
        {showProjects && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProjects(false)}
              className="absolute inset-0 bg-[#060814]/85 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1225] p-6 shadow-2xl z-10 space-y-6 text-left max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-lightBlue" />
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    Explore Guided Projects
                  </h3>
                </div>
                <button onClick={() => setShowProjects(false)} className="text-slate-400 hover:text-white transition-colors focus:outline-none" title="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {guidedProjects.map((project, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#161b33] border border-white/5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{project.title}</h4>
                        <p className="text-[10px] text-brand-lightBlue font-medium mt-1 font-sans">{project.difficulty} • {project.estTime}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                      {project.description}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Project Steps</span>
                      <ol className="list-decimal list-inside text-[10px] text-slate-400 space-y-1 font-sans font-light">
                        {project.steps.map((step: string, sIdx: number) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white transition-colors focus:outline-none">
                        <span>Start Project</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
