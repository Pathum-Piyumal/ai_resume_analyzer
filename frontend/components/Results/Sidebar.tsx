import { 
  LayoutDashboard, 
  BarChart3, 
  Target,
  Compass, 
  Bookmark,
  Clock,
  HelpCircle, 
  Settings,
  BrainCircuit,
  Sliders,
  Zap,
  User,
  FileText,
  Download,
  X,
  LogOut
} from 'lucide-react'
import { motion } from 'framer-motion'

import logoUrl from '../../src/assets/logo.svg'

interface SidebarProps {
  mode?: 'global' | 'document'
  activeTab?: string
  onTabChange?: (tab: string) => void
  onSignOut?: () => void
  onClose?: () => void
  onLogoClick?: () => void
  theme?: 'dark' | 'light'
}

export default function Sidebar({ 
  mode = 'global',
  activeTab = 'dashboard', 
  onTabChange,
  onSignOut,
  onClose,
  onLogoClick,
  theme = 'dark'
}: SidebarProps) {
  
  // 1. Portal Navigation links for Global Admin/Overview Mode
  const globalLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', name: 'Resume Analysis', icon: BarChart3 },
    { id: 'skillgap', name: 'Skill Gap', icon: Target },
    { id: 'careerpath', name: 'Career Path', icon: Compass },
    { id: 'savedjobs', name: 'Saved Jobs', icon: Bookmark },
    { id: 'history', name: 'History', icon: Clock }
  ]

  // 2. Navigation links for Document review Mode
  const documentLinks = [
    { id: 'analysis', name: 'Analysis', icon: Sliders },
    { id: 'keywords', name: 'Keywords', icon: Target },
    { id: 'formatting', name: 'Formatting', icon: Sliders },
    { id: 'competitors', name: 'Competitors', icon: Zap },
    { id: 'savedjobs', name: 'Saved Jobs', icon: Bookmark },
    { id: 'history', name: 'History', icon: Clock }
  ]

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <aside className={`w-64 flex flex-col justify-between p-6 h-screen shrink-0 sticky top-0 text-left font-sans z-25 transition-colors duration-300 border-r ${
      theme === 'light'
        ? 'bg-white border-slate-200'
        : 'bg-[#0A0D1A] border-white/5'
    }`}>
      
      {/* GLOBAL MODE SHELL */}
      {mode === 'global' ? (
        <>
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between gap-1 mb-8">
              <button 
                onClick={onLogoClick}
                className="flex items-center gap-3 text-left group hover:opacity-90 transition-opacity"
              >
                <img src={logoUrl} alt="ResumeIQ Logo" className="h-10 w-auto object-contain drop-shadow-md" />
                <div className="flex flex-col">
                  <span className={`text-base font-bold tracking-tight font-sans leading-none ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Resume<span className="text-brand-lightBlue">IQ</span>
                  </span>
                  <span className="text-[10px] text-brand-textMuted font-sans tracking-wide mt-1">
                    AI Career Intelligence
                  </span>
                </div>
              </button>
              <button onClick={onClose} className={`transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`} title="Close Sidebar">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Portal Navigation Links */}
            <nav className="space-y-1 relative">
              {globalLinks.map((link) => {
                const Icon = link.icon
                const isActive = activeTab === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => onTabChange?.(link.id)}
                    className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 ${
                      isActive 
                        ? 'text-brand-lightBlue' 
                        : theme === 'light'
                          ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                          : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="globalActiveTabGlow"
                        className={`absolute inset-0 rounded-xl -z-10 shadow-md ${
                          theme === 'light'
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-slate-800/60 border border-white/5 shadow-brand-dark/20'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`h-4.5 w-4.5 shrink-0 relative z-10 ${isActive ? 'text-brand-lightBlue' : 'text-brand-textMuted'}`} />
                    <span className="relative z-10">{link.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Bottom Settings and Pro Plan Banner */}
          <div className="space-y-5">
            
            {/* Footer Settings & Help links */}
            <div className="space-y-1">
              <button
                onClick={() => onTabChange?.('settings')}
                className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                  activeTab === 'settings' 
                    ? 'text-brand-lightBlue' 
                    : theme === 'light'
                      ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {activeTab === 'settings' && (
                  <motion.div
                    layoutId="globalActiveTabGlow"
                    className={`absolute inset-0 rounded-xl -z-10 shadow-md ${
                      theme === 'light'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-slate-800/60 border border-white/5 shadow-brand-dark/20'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Settings className={`h-4.5 w-4.5 relative z-10 ${activeTab === 'settings' ? 'text-brand-lightBlue' : 'text-brand-textMuted'}`} />
                <span className="relative z-10">Settings</span>
              </button>
              
              <button
                onClick={() => onTabChange?.('support')}
                className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                  activeTab === 'support' 
                    ? 'text-brand-lightBlue' 
                    : theme === 'light'
                      ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {activeTab === 'support' && (
                  <motion.div
                    layoutId="globalActiveTabGlow"
                    className={`absolute inset-0 rounded-xl -z-10 shadow-md ${
                      theme === 'light'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-slate-800/60 border border-white/5 shadow-brand-dark/20'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <HelpCircle className={`h-4.5 w-4.5 relative z-10 ${activeTab === 'support' ? 'text-brand-lightBlue' : 'text-brand-textMuted'}`} />
                <span className="relative z-10">Help Center</span>
              </button>

              <button
                onClick={onSignOut}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  theme === 'light' ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <LogOut className="h-4.5 w-4.5 text-brand-textMuted" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Pro Plan Banner Card */}
            <div className={`rounded-xl border p-4 space-y-3 ${
              theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#121626]/80'
            }`}>
              <div>
                <h4 className={`text-[10px] font-bold font-sans tracking-wide mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Pro Plan
                </h4>
                <p className="text-[9px] text-brand-textMuted leading-normal font-sans font-light">
                  Unlock advanced ATS Insights.
                </p>
              </div>
              <motion.button 
                onClick={() => onTabChange?.('pro')}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-[10px] shadow-lg shadow-brand-blue/15 transition-all duration-200"
                type="button"
              >
                Upgrade to Pro
              </motion.button>
            </div>
            
          </div>
        </>
      ) : (
        /* DOCUMENT REVIEW MODE SHELL */
        <>
          <div>
            {/* Document Card Header */}
            <div className={`rounded-xl border p-4 mb-6 flex items-center justify-between gap-3 relative ${
              theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#121626]/80'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-lightBlue shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left min-w-0">
                  <p className={`text-xs font-bold truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Resume v2.1
                  </p>
                  <p className="text-[9px] text-brand-textMuted font-sans tracking-widest uppercase mt-0.5">
                    Product Manager
                  </p>
                </div>
              </div>
              <button onClick={onClose} className={`transition-colors shrink-0 ${theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`} title="Close Sidebar">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Review Submenu */}
            <nav className="space-y-1 relative">
              {documentLinks.map((link) => {
                const Icon = link.icon
                const isActive = activeTab === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => onTabChange?.(link.id)}
                    className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 ${
                      isActive 
                        ? 'text-brand-lightBlue' 
                        : theme === 'light'
                          ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                          : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="documentActiveTabGlow"
                        className={`absolute inset-0 rounded-xl -z-10 shadow-md ${
                          theme === 'light'
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-slate-800/60 border border-white/5 shadow-brand-dark/20'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`h-4.5 w-4.5 shrink-0 relative z-10 ${isActive ? 'text-brand-lightBlue' : 'text-brand-textMuted'}`} />
                    <span className="relative z-10">{link.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Bottom Export & Account Tools */}
          <div className="space-y-4">
            
            {/* Export PDF Button */}
            <div className="px-1">
              <motion.button 
                onClick={handleExportPDF}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-brand-blue/15 transition-all duration-200 flex items-center justify-center gap-2"
                type="button"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </motion.button>
            </div>

            {/* Footer Actions */}
            <div className={`space-y-1 border-t pt-4 ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}>
              <button
                onClick={() => onTabChange?.('support')}
                className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                  activeTab === 'support' 
                    ? 'text-brand-lightBlue' 
                    : theme === 'light'
                      ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {activeTab === 'support' && (
                  <motion.div
                    layoutId="documentActiveTabGlow"
                    className={`absolute inset-0 rounded-xl -z-10 ${
                      theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-800/60 border border-white/5'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <HelpCircle className={`h-4.5 w-4.5 relative z-10 ${activeTab === 'support' ? 'text-brand-lightBlue' : 'text-brand-textMuted'}`} />
                <span className="relative z-10">Support</span>
              </button>
              <button
                onClick={onSignOut}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  theme === 'light' ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <LogOut className="h-4.5 w-4.5 text-brand-textMuted" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

    </aside>
  )
}
