import { useState, useEffect } from 'react'
import { Bookmark, MapPin, DollarSign, Building, ArrowUpRight, Star, X, Search, Briefcase, Plus, Check } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import NumberTicker from '../../components/NumberTicker'
import { api, SavedJob } from '../utils/api'

interface SavedJobsPageProps {
  analysisResult?: any
  onNewAnalysis?: () => void
  searchQuery?: string
  onSearchQueryChange?: (val: string) => void
}

export default function SavedJobsPage({ 
  analysisResult, 
  onNewAnalysis,
  searchQuery = '',
  onSearchQueryChange
}: SavedJobsPageProps) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [exploreJobs, setExploreJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'remote' | 'onsite'>('all')
  const [showExplore, setShowExplore] = useState(false)

  // 1. Fetch saved jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await api.getSavedJobs()
        setSavedJobs(jobs)
      } catch (err) {
        console.error("Failed to load saved jobs", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // 2. Setup job recommendations
  useEffect(() => {
    let rawJobs: any[] = []
    
    if (analysisResult?.jobs && analysisResult.jobs.length > 0) {
      rawJobs = analysisResult.jobs.map((job: any, idx: number) => ({
        id: idx + 100,
        role: job.title || 'Software Engineer',
        company: job.platform || 'LinkedIn',
        location: 'Remote / Hybrid',
        salary: 'Market Rate',
        match: 85 + (idx % 3) * 5,
        tags: [job.skill || 'Developer'],
        link: job.url || 'https://www.linkedin.com'
      }))
    } else {
      // Generate from missing skills if jobs list is not saved in database
      const missing = analysisResult?.missing || analysisResult?.missing_skills || []
      const jobTitle = analysisResult?.job_title || 'Software Developer'
      if (missing.length > 0) {
        rawJobs = missing.slice(0, 3).map((skill: string, idx: number) => ({
          id: idx + 100,
          role: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Engineer`,
          company: 'Industry Partner',
          location: 'Remote',
          salary: '$120k - $150k',
          match: 80 + (idx * 5),
          tags: [skill],
          link: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skill + ' ' + jobTitle)}`
        }))
      } else if (jobTitle) {
        rawJobs = [
          {
            id: 100,
            role: jobTitle,
            company: 'Tech Corporation',
            location: 'Remote',
            salary: '$110k - $140k',
            match: 90,
            tags: ['Software'],
            link: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}`
          }
        ]
      }
    }
    
    // Filter out jobs that are already saved
    const savedLinks = new Set(savedJobs.map(sj => sj.link?.toLowerCase().trim()))
    const savedTitles = new Set(savedJobs.map(sj => sj.title?.toLowerCase().trim() + '||' + sj.company?.toLowerCase().trim()))
    
    const filtered = rawJobs.filter(job => {
      const hasLink = savedLinks.has(job.link?.toLowerCase().trim())
      const hasTitleCompany = savedTitles.has(job.role?.toLowerCase().trim() + '||' + job.company?.toLowerCase().trim())
      return !hasLink && !hasTitleCompany
    })
    
    setExploreJobs(filtered)
  }, [analysisResult, savedJobs])

  if (!analysisResult && savedJobs.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center space-y-6 rounded-2xl border border-white/5 bg-brand-card/45 p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute inset-0 bg-[radial-gradient(180px circle at 50% 50%, rgba(245,158,11,0.05), transparent 85%)]" />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/5 text-brand-lightBlue border border-brand-blue/10 relative z-10">
          <Briefcase className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-extrabold text-white tracking-tight font-sans">
            No Job Recommendations Yet
          </h3>
          <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed font-sans font-light">
            Upload your resume and a target job description first to map out your technical strengths and skills gaps, and get tailored job recommendations.
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

  const handleUnsave = async (id: number) => {
    try {
      await api.deleteSavedJob(id)
      setSavedJobs(prev => prev.filter(job => job.id !== id))
    } catch (err) {
      console.error("Failed to unsave job", err)
    }
  }

  const handleStatusChange = async (id: number, newStatus: any) => {
    try {
      const updated = await api.updateSavedJobStatus(id, newStatus)
      setSavedJobs(prev => prev.map(job => job.id === id ? { ...job, status: updated.status } : job))
    } catch (err) {
      console.error("Failed to update job status", err)
    }
  }

  const handleSaveJob = async (id: number) => {
    const jobToSave = exploreJobs.find(j => j.id === id)
    if (jobToSave) {
      try {
        const saved = await api.saveJob({
          title: jobToSave.role,
          company: jobToSave.company,
          location: jobToSave.location,
          link: jobToSave.link
        })
        setSavedJobs(prev => [...prev, saved])
        setExploreJobs(prev => prev.filter(j => j.id !== id))
      } catch (err) {
        console.error("Failed to save job", err)
      }
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (score >= 80) return 'text-brand-lightBlue border-brand-blue/30 bg-brand-blue/10'
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  }

  const filteredJobs = savedJobs.filter(job => {
    const title = job.title || ''
    const company = job.company || ''
    const location = job.location || 'Remote'
    
    // Location Filter
    const matchesLocation = 
      activeFilter === 'all' ||
      (activeFilter === 'remote' && location.toLowerCase().includes('remote')) ||
      (activeFilter === 'onsite' && !location.toLowerCase().includes('remote'))
    
    // Search Query Filter
    const fallbackTags = (job as any).tags || [title.split(' ')[0] || 'Software']
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fallbackTags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesLocation && matchesSearch
  })

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
      className="max-w-5xl mx-auto space-y-8 text-left relative min-h-[80vh]"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-brand-blue/5 blur-[90px] pointer-events-none z-0" />
      <div className="absolute top-2/3 right-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Saved Jobs
          </h1>
          <p className="mt-2 text-sm text-brand-textMuted font-sans">
            Track and manage your potential next career moves.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Location Filters */}
          <div className="flex bg-[#121626] rounded-xl p-1 border border-white/5 text-[11px] font-bold">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors focus:outline-none ${activeFilter === 'all' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('remote')}
              className={`px-3 py-1.5 rounded-lg transition-colors focus:outline-none ${activeFilter === 'remote' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Remote
            </button>
            <button 
              onClick={() => setActiveFilter('onsite')}
              className={`px-3 py-1.5 rounded-lg transition-colors focus:outline-none ${activeFilter === 'onsite' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Hybrid / On-site
            </button>
          </div>

          {analysisResult && (
            <motion.button 
              onClick={() => setShowExplore(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-xs font-bold text-white shadow-lg shadow-brand-blue/15 transition-all focus:outline-none"
            >
              Find New Jobs
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Search Input */}
      <motion.div variants={itemVariants} className="relative max-w-md relative z-10">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <input 
          type="text" 
          placeholder="Search by role, company, or skill..." 
          value={searchQuery}
          onChange={(e) => onSearchQueryChange?.(e.target.value)}
          className="w-full bg-[#121626]/60 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light"
        />
      </motion.div>

      {/* Grid of Saved Jobs */}
      <div className="relative z-10">
        {filteredJobs.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div 
                  key={job.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
                  onMouseMove={handleMouseMove}
                  className="group rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl hover:border-white/10 transition-colors flex flex-col justify-between h-full relative overflow-hidden"
                >
                  {/* Mouse Spotlight */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05), transparent 80%)'
                    }}
                  />
                  
                  <div className="relative z-10 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#121626] border border-white/10 text-white font-bold font-sans">
                        {job.company.charAt(0)}
                      </div>
                      <button 
                        onClick={() => handleUnsave(job.id)}
                        className="text-brand-lightBlue hover:text-white transition-colors focus:outline-none" 
                        title="Remove Bookmark"
                      >
                        <Bookmark className="h-5 w-5 fill-current" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white tracking-tight font-sans mb-1 leading-tight">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-brand-textMuted font-sans mb-4">
                      <Building className="h-3.5 w-3.5" />
                      <span>{job.company}</span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-sans">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {job.location || 'Remote / Hybrid'}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-sans">
                        <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                        {(job as any).salary || '$130k - $160k'}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-sans select-none">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Status:</span>
                        <select 
                          value={job.status} 
                          onChange={(e) => handleStatusChange(job.id, e.target.value)}
                          className="bg-[#121626] border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-white focus:outline-none focus:border-brand-blue cursor-pointer transition-colors hover:border-white/20"
                        >
                          <option value="saved">Saved</option>
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {((job as any).tags || [job.title.split(' ')[0] || 'Software']).map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded bg-slate-800 text-[9px] font-semibold text-slate-300 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getMatchColor((job as any).match || 88)}`}>
                        <Star className="h-3 w-3" />
                        <span className="text-[10px] font-bold font-mono">
                          <NumberTicker value={(job as any).match || 88} suffix="%" /> Match
                        </span>
                      </div>
                      
                      <a 
                        href={job.link || 'https://www.linkedin.com'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-[11px] font-bold text-white hover:text-brand-lightBlue transition-colors group focus:outline-none"
                      >
                        Apply Now <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-brand-card/20 rounded-2xl border border-white/5 border-dashed">
            <Bookmark className="h-10 w-10 text-slate-600 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white mb-1">No Jobs Found</h3>
            <p className="text-xs text-brand-textMuted max-w-xs mx-auto">
              Try adjusting your search criteria or explore new recommendations.
            </p>
          </div>
        )}
      </div>

      {/* Explore More Jobs Modal */}
      <AnimatePresence>
        {showExplore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExplore(false)}
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
                  <Briefcase className="h-5 w-5 text-brand-lightBlue" />
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    Recommended Openings
                  </h3>
                </div>
                <button onClick={() => setShowExplore(false)} className="text-slate-400 hover:text-white transition-colors focus:outline-none" title="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {exploreJobs.length > 0 ? (
                  exploreJobs.map((job) => (
                    <div key={job.id} className="p-4 rounded-xl bg-[#161b33] border border-white/5 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-white leading-tight">{job.role}</h4>
                            <p className="text-[10px] text-brand-lightBlue font-medium mt-1 font-sans">{job.company} • {job.location}</p>
                          </div>
                          
                          <div className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-bold font-mono ${getMatchColor(job.match)}`}>
                            <span>
                              <NumberTicker value={job.match} suffix="%" /> Match
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-[11px] text-slate-300 font-light leading-relaxed mt-2">
                          Salary: {job.salary} • Required skills: {job.tags.join(', ')}
                        </p>
                      </div>

                      <div className="flex justify-end pt-2">
                        <motion.button 
                          onClick={() => handleSaveJob(job.id)}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white transition-colors focus:outline-none"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Save Job</span>
                        </motion.button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Check className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                    <h4 className="text-xs font-bold text-white">All Jobs Saved!</h4>
                    <p className="text-[10px] text-brand-textMuted mt-1">You have bookmarked all recommended job openings.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
