import { Search, Bell, Settings } from 'lucide-react'

interface TopbarProps {
  title?: string
  userName?: string
  userAvatar?: string
}

export default function Topbar({ 
  title = 'Analysis Results', 
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
}: TopbarProps) {
  return (
    <header className="h-16 border-b border-white/5 bg-[#080B16] px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 font-sans">
      
      {/* Title */}
      <div className="flex items-center gap-2 text-left">
        <svg className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="m9 15 2 2 4-4" />
        </svg>
        <h2 className="text-sm sm:text-base font-bold text-white font-sans tracking-tight">
          {title}
        </h2>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-5">
        
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-textMuted" />
          <input
            type="text"
            placeholder="Search Insights..."
            className="w-56 rounded-full bg-brand-card/75 border border-white/5 pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light"
          />
        </div>

        {/* Bell Notify */}
        <button 
          className="relative p-1.5 rounded-lg text-brand-textMuted hover:text-white hover:bg-white/5 transition-all duration-150"
          type="button"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lightBlue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-lightBlue"></span>
          </span>
        </button>

        {/* Settings Gear */}
        <button 
          className="p-1.5 rounded-lg text-brand-textMuted hover:text-white hover:bg-white/5 transition-all duration-150"
          type="button"
        >
          <Settings className="h-4.5 w-4.5" />
        </button>

        {/* Separator line */}
        <div className="h-6 w-px bg-white/10" />

        {/* Profile Avatar */}
        <div className="relative group cursor-pointer">
          <img
            src={userAvatar}
            alt="User profile avatar"
            className="h-8.5 w-8.5 rounded-full border border-brand-blue/40 hover:border-brand-lightBlue transition-all duration-200"
          />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#080B16]" />
        </div>

      </div>

    </header>
  )
}
