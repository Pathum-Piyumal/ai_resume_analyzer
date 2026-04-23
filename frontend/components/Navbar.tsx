import { useState } from 'react'
import logoUrl from '../src/assets/logo.svg'

interface NavbarProps {
  currentView?: 'landing' | 'signin' | 'signup' | 'forgot' | 'app'
  onNavigate?: (view: 'landing' | 'signin' | 'signup' | 'forgot' | 'app') => void
}

export default function Navbar({ currentView = 'landing', onNavigate }: NavbarProps) {
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-brand-dark/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Brand */}
          <div className="flex items-center">
            <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 group">
              <img src={logoUrl} alt="ResumeIQ Logo" className="h-10 w-auto object-contain drop-shadow-md" />
              <span className="font-sans text-lg font-bold tracking-tight text-white">
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
                  className={`text-xs font-semibold hover:text-white transition-colors duration-200 uppercase tracking-wider ${
                    'view' in link && currentView === link.view ? 'text-brand-lightBlue font-bold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            {currentView === 'landing' ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate?.('signin')}
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-md border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all duration-200 font-sans"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate?.('signup')}
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white rounded-md bg-brand-blue hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-sans"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate?.('landing')}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-md border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all duration-200 font-sans"
              >
                Back to Home
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none transition-colors duration-200"
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-white/5 bg-brand-dark/95 backdrop-blur-lg ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
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
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
          <div className="mt-4 px-3 pb-2">
            {currentView === 'landing' ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    onNavigate?.('signin')
                  }}
                  className="flex w-full items-center justify-center rounded-lg border border-white/10 py-2.5 text-center text-sm font-semibold text-slate-300 hover:text-white active:scale-[0.98] transition-transform duration-150"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    onNavigate?.('signup')
                  }}
                  className="flex w-full items-center justify-center rounded-lg bg-brand-blue py-2.5 text-center text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition-transform duration-150"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onNavigate?.('landing')
                }}
                className="flex w-full items-center justify-center rounded-lg border border-white/10 py-2.5 text-center text-sm font-semibold text-slate-300 hover:text-white active:scale-[0.98] transition-transform duration-150"
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
