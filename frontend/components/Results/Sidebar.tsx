import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Briefcase, 
  Clock, 
  HelpCircle, 
  LogOut,
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
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    { id: 'editor', name: 'Resume Editor', icon: FileText },
    { id: 'matches', name: 'Job Matches', icon: Briefcase },
    { id: 'history', name: 'History', icon: Clock }
  ]

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0A0D1A] flex flex-col justify-between p-6 h-screen shrink-0 sticky top-0 text-left font-sans">
      
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
              AI-Driven Insights
            </span>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <nav className="flex-1 space-y-1">
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

      {/* Footer Links */}
      <div className="space-y-1 border-t border-white/5 pt-6">
        <button
          onClick={() => onTabChange?.('support')}
          className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold text-brand-textMuted hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
        >
          <HelpCircle className="h-4.5 w-4.5 text-brand-textMuted" />
          <span>Support</span>
        </button>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-semibold text-brand-textMuted hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
        >
          <LogOut className="h-4.5 w-4.5 text-brand-textMuted" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  )
}
