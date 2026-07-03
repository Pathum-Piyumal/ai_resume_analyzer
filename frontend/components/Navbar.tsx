import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import logoUrl from '../src/assets/logo.svg'

interface NavbarProps {
  currentView?: 'landing' | 'signin' | 'signup' | 'forgot' | 'app'
  onNavigate?: (view: 'landing' | 'signin' | 'signup' | 'forgot' | 'app') => void
  theme?: 'dark' | 'light'
  onToggleTheme?: () => void
}

export default function Navbar({ currentView = 'landing', onNavigate, theme = 'dark', onToggleTheme }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  const navLinks = [
    { name: 'Analyze', view: 'signup' as const },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Pricing', href: '#pricing' }
  ]

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentView === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onNavigate?.('landing')
    }
  }

  const handleLinkClick = (e: React.MouseEvent, view?: 'landing' | 'signin' | 'signup' | 'forgot' | 'app', href?: string) => {
    if (view) {
      e.preventDefault()
      onNavigate?.(view)
    } else if (href && href.startsWith('#')) {
      e.preventDefault()
      onNavigate?.('landing')
      setTimeout(() => {
        const el = document.querySelector(href)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  // Theme toggle button — shared between desktop & mobile
  const ThemeToggle = ({ className = '' }: { className?: string }) => (
    <motion.button
      onClick={onToggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60 ${
        theme === 'light'
          ? 'border-slate-200 bg-white text-amber-500 hover:bg-amber-50 shadow-sm'
          : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute"
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute"
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )

  const isLoggedIn = !!localStorage.getItem('resumeiq-auth-token')

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
      theme === 'light'
        ? 'border-b border-slate-200 bg-white/90'
        : 'border-b border-white/5 bg-brand-dark/85'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Brand */}
          <div className="flex items-center">
            <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 group">
              <motion.img 
                whileHover={{ scale: 1.05, rotate: -2 }}
                src={logoUrl} 
                alt="ResumeIQ Logo" 
                className="h-10 w-auto object-contain drop-shadow-md" 
              />
              <span className={`font-sans text-lg font-bold tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                Resume<span className="text-brand-lightBlue">IQ</span>
              </span>
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={'href' in link ? link.href : '#'}
                  onClick={(e) => handleLinkClick(e, 'view' in link ? link.view : undefined, 'href' in link ? link.href : undefined)}
                  className={`text-xs font-semibold transition-colors duration-200 uppercase tracking-wider ${
                    theme === 'light'
                      ? ('view' in link && currentView === link.view ? 'text-brand-blue font-bold' : 'text-slate-500 hover:text-slate-900')
                      : ('view' in link && currentView === link.view ? 'text-brand-lightBlue font-bold' : 'text-slate-300 hover:text-white')
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {currentView === 'landing' ? (
              isLoggedIn ? (
                <motion.button
                  onClick={() => onNavigate?.('app')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white rounded-md bg-brand-blue hover:bg-blue-700 transition-all font-sans"
                >
                  Go to Dashboard
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => onNavigate?.('signin')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-md border transition-all font-sans ${
                      theme === 'light'
                        ? 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                        : 'text-slate-300 hover:text-white border-white/10 hover:bg-white/5'
                    }`}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate?.('signup')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white rounded-md bg-brand-blue hover:bg-blue-700 transition-all font-sans"
                  >
                    Get Started
                  </motion.button>
                </>
              )
            ) : (
              <motion.button
                onClick={() => onNavigate?.('landing')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-md border transition-all font-sans ${
                  theme === 'light'
                    ? 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white border-white/10 hover:bg-white/5'
                }`}
              >
                Back to Home
              </motion.button>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className={`inline-flex items-center justify-center rounded-md p-2 transition-colors duration-200 focus:outline-none ${
                theme === 'light'
                  ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          theme === 'light' ? 'border-b border-slate-200 bg-white/95' : 'border-b border-white/5 bg-brand-dark/95 backdrop-blur-lg'
        } ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="space-y-1 px-4 py-3 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={'href' in link ? link.href : '#'}
              onClick={(e) => {
                setIsMobileMenuOpen(false)
                handleLinkClick(e, 'view' in link ? link.view : undefined, 'href' in link ? link.href : undefined)
              }}
              className={`block rounded-md px-3 py-2 text-base font-medium transition-all duration-200 ${
                theme === 'light'
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <div className="mt-4 px-3 pb-2">
            {currentView === 'landing' ? (
              isLoggedIn ? (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate?.('app') }}
                  className="flex w-full items-center justify-center rounded-lg bg-brand-blue py-2.5 text-center text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition-transform duration-150"
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate?.('signin') }}
                    className={`flex w-full items-center justify-center rounded-lg border py-2.5 text-center text-sm font-semibold transition-all active:scale-[0.98] ${
                      theme === 'light'
                        ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate?.('signup') }}
                    className="flex w-full items-center justify-center rounded-lg bg-brand-blue py-2.5 text-center text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition-transform duration-150"
                  >
                    Get Started
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate?.('landing') }}
                className={`flex w-full items-center justify-center rounded-lg border py-2.5 text-center text-sm font-semibold transition-all active:scale-[0.98] ${
                  theme === 'light'
                    ? 'border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
