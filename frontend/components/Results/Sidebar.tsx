import { 
  LayoutDashboard, 
  BarChart3, 
  Target,
  Compass, 
  Bookmark,
  HelpCircle, 
  Settings,
  BrainCircuit
} from 'lucide-react'

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onSignOut?: () => void
}

export default function Sidebar({ 
  activeTab = 'analysis', 
  onTabChange,
  onSignOut 
}: SidebarProps) {
  const mainLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', name: 'Resume Analysis', icon: BarChart3 },
    { id: 'skillgap', name: 'Skill Gap', icon: Target },
    { id: 'careerpath', name: 'Career Path', icon: Compass },
    { id: 'savedjobs', name: 'Saved Jobs', icon: Bookmark }
  ]

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0A0D1A] flex flex-col justify-between p-6 h-screen shrink-0 sticky top-0 text-left font-sans">
      
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

        {/* Main Links */}
        <nav className="space-y-1">
          {mainLinks.map((link) => {
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

      {/* Bottom Banners and Footer Links */}
      <div className="space-y-4">
        
        {/* Upgrade to Pro Button */}
        <div className="px-1">
          <button 
            onClick={() => onTabChange?.('pro')}
            className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-brand-blue/15 transition-all duration-200 active:scale-[0.98]"
            type="button"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Footer Actions */}
        <div className="space-y-1 border-t border-white/5 pt-4">
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
      </div>

    </aside>
  )
}
