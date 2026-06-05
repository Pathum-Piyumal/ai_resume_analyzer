import { Search, Bell, Settings, Menu, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TopbarProps {
  title?: string
  userName?: string
  userAvatar?: string
  isSidebarOpen?: boolean
  onToggleSidebar?: () => void
  onSettingsClick?: () => void
  icon?: React.ReactNode
  theme?: 'dark' | 'light'
  onToggleTheme?: () => void
}

export default function Topbar({ 
  title = 'Analysis Results', 
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
  isSidebarOpen = true,
  onToggleSidebar,
  onSettingsClick,
  icon,
  theme = 'dark',
  onToggleTheme
}: TopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Job Match', desc: 'Senior Frontend Developer at TechCorp matches your profile.', time: '2m ago', read: false },
    { id: 2, title: 'Resume Analyzed', desc: 'Your latest resume scored 85%. Review the skill gaps.', time: '1h ago', read: false },
    { id: 3, title: 'System Update', desc: 'ResumeIQ has been updated with new ATS formats.', time: '1d ago', read: true }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <header className={`h-16 border-b px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 font-sans transition-colors duration-300 ${
      theme === 'light'
        ? 'border-slate-200 bg-white'
        : 'border-white/5 bg-[#080B16]'
    }`}>
      
      {/* Title */}
      <div className="flex items-center gap-4 text-left">
        {!isSidebarOpen && (
          <button 
            onClick={onToggleSidebar} 
          className={`transition-colors ${theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-brand-textMuted hover:text-white'}`}
            title="Open Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          {icon ? (
            icon
          ) : (
            <svg className="h-4.5 w-4.5 text-brand-lightBlue shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="m9 15 2 2 4-4" />
            </svg>
          )}
          <h2 className={`text-sm sm:text-base font-bold font-sans tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {title}
          </h2>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-5">
        
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-textMuted" />
          <input
            type="text"
            placeholder="Search Insights..."
            className={`w-56 rounded-full border pl-9 pr-4 py-1.5 text-xs placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans font-light ${
              theme === 'light'
                ? 'bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-brand-card/75 border-white/5 text-white'
            }`}
          />
        </div>

        {/* Bell Notify */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-1.5 rounded-lg transition-all duration-150 ${isNotificationsOpen 
              ? (theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white')
              : (theme === 'light' ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-brand-textMuted hover:text-white hover:bg-white/5')
            }`}
            type="button"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lightBlue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-lightBlue"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className={`absolute right-0 mt-3 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
              theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#0A0D1A]'
            }`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${
                theme === 'light' ? 'border-slate-100 bg-slate-50' : 'border-white/5 bg-slate-900/50'
              }`}>
                <h3 className={`text-xs font-bold tracking-wide ${ theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-[10px] text-brand-lightBlue hover:text-blue-400 font-semibold">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 flex gap-3 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-brand-blue/5' : ''}`} onClick={() => markAsRead(n.id)}>
                        <div className={`mt-0.5 shrink-0 h-2 w-2 rounded-full ${!n.read ? 'bg-brand-lightBlue' : 'bg-transparent'}`} />
                        <div>
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className={`text-xs ${!n.read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{n.title}</h4>
                            <span className="text-[9px] text-slate-500 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-brand-textMuted leading-snug">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-xs text-brand-textMuted">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={onToggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
          className={`relative flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 focus:outline-none ${
            theme === 'light'
              ? 'border-slate-200 bg-white text-amber-500 hover:bg-amber-50 shadow-sm'
              : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.span
                key="moon"
                initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Moon className="h-3.5 w-3.5" />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ rotate: 45, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -45, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Sun className="h-3.5 w-3.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Settings Gear */}
        <button 
          onClick={onSettingsClick}
          className={`p-1.5 rounded-lg transition-all duration-150 ${
            theme === 'light'
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-brand-textMuted hover:text-white hover:bg-white/5'
          }`}
          type="button"
          title="Settings"
        >
          <Settings className="h-4.5 w-4.5" />
        </button>

        {/* Separator line */}
        <div className={`h-6 w-px ${ theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />

        {/* Profile Avatar */}
        <div className="relative group cursor-pointer">
          <img
            src={userAvatar}
            alt="User profile avatar"
            className="h-8 w-8 rounded-full border border-brand-blue/40 hover:border-brand-lightBlue transition-all duration-200 object-cover"
          />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#080B16]" />
        </div>

      </div>

    </header>
  )
}
