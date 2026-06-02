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
  Download
} from 'lucide-react'

interface SidebarProps {
  mode?: 'global' | 'document'
  activeTab?: string
  onTabChange?: (tab: string) => void
  onSignOut?: () => void
}

export default function Sidebar({ 
  mode = 'global',
  activeTab = 'dashboard', 
  onTabChange,
  onSignOut 
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
    { id: 'history', name: 'History', icon: Clock }
  ]

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0A0D1A] flex flex-col justify-between p-6 h-screen shrink-0 sticky top-0 text-left font-sans z-25">
      
      {/* GLOBAL MODE SHELL */}
      {mode === 'global' ? (
        <>
          <div>
            {/* Brand Header */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 p-0.5 shadow-lg shadow-brand-blue/10">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0D1A]">
                    <BrainCircuit className="h-5 w-5 text-brand-lightBlue" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-white font-sans leading-none">
                    Resume<span className="text-brand-lightBlue">AI</span>
                  </span>
                  <span className="text-[10px] text-brand-textMuted font-sans tracking-wide mt-1">
                    AI Career Intelligence
                  </span>
                </div>
              </div>
            </div>

            {/* Portal Navigation Links */}
            <nav className="space-y-1">
              {globalLinks.map((link) => {
                const Icon = link.icon
                const isActive = activeTab === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => onTabChange?.(link.id)}
                    className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-800/60 text-brand-lightBlue border border-white/5 shadow-md shadow-brand-dark/20' 
                        : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-brand-lightBlue' : 'text-brand-textMuted'}`} />
                    <span>{link.name}</span>
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
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'settings' 
                    ? 'bg-slate-800/60 text-brand-lightBlue border border-white/5' 
                    : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Settings className="h-4.5 w-4.5 text-brand-textMuted" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={() => onTabChange?.('support')}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'support' 
                    ? 'bg-slate-800/60 text-brand-lightBlue border border-white/5' 
                    : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <HelpCircle className="h-4.5 w-4.5 text-brand-textMuted" />
                <span>Help Center</span>
              </button>
            </div>

            {/* Pro Plan Banner Card */}
            <div className="rounded-xl border border-white/5 bg-[#121626]/80 p-4 space-y-3">
              <div>
                <h4 className="text-[10px] font-bold text-slate-300 font-sans tracking-wide mb-1">
                  Pro Plan
                </h4>
                <p className="text-[9px] text-brand-textMuted leading-normal font-sans font-light">
                  Unlock advanced ATS Insights.
                </p>
              </div>
              <button 
                onClick={() => onTabChange?.('pro')}
                className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-[10px] shadow-lg shadow-brand-blue/15 transition-all duration-200 active:scale-[0.98]"
                type="button"
              >
                Upgrade to Pro
              </button>
            </div>
            
          </div>
        </>
      ) : (
        /* DOCUMENT REVIEW MODE SHELL */
        <>
          <div>
            {/* Document Card Header */}
            <div className="rounded-xl border border-white/5 bg-[#121626]/80 p-4 mb-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-lightBlue shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  Resume v2.1
                </p>
                <p className="text-[9px] text-brand-textMuted font-sans tracking-widest uppercase mt-0.5">
                  Product Manager
                </p>
              </div>
            </div>

            {/* Document Review Submenu */}
            <nav className="space-y-1">
              {documentLinks.map((link) => {
                const Icon = link.icon
                const isActive = activeTab === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => onTabChange?.(link.id)}
                    className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-800/60 text-brand-lightBlue border border-white/5 shadow-md shadow-brand-dark/20' 
                        : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-brand-lightBlue' : 'text-brand-textMuted'}`} />
                    <span>{link.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Bottom Export & Account Tools */}
          <div className="space-y-4">
            
            {/* Export PDF Button */}
            <div className="px-1">
              <button 
                onClick={handleExportPDF}
                className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-brand-blue/15 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                type="button"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </button>
            </div>

            {/* Footer Actions */}
            <div className="space-y-1 border-t border-white/5 pt-4">
              <button
                onClick={() => onTabChange?.('support')}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'support' 
                    ? 'bg-slate-800/60 text-brand-lightBlue border border-white/5' 
                    : 'text-brand-textMuted hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <HelpCircle className="h-4.5 w-4.5 text-brand-textMuted" />
                <span>Support</span>
              </button>
              <button
                onClick={onSignOut}
                className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold text-brand-textMuted hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
              >
                <User className="h-4.5 w-4.5 text-brand-textMuted" />
                <span>Account</span>
              </button>
            </div>
          </div>
        </>
      )}

    </aside>
  )
}
