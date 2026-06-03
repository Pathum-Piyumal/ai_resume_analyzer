import logoUrl from '../src/assets/logo.svg'

interface FooterProps {
  onNavigate?: (view: 'landing' | 'signin' | 'signup' | 'forgot' | 'app' | 'privacy' | 'terms' | 'support') => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const handleLinkClick = (e: React.MouseEvent, view: 'privacy' | 'terms' | 'support' | 'landing') => {
    e.preventDefault()
    if (view === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    onNavigate?.(view)
  }

  return (
    <footer className="w-full border-t border-white/5 py-12 transition-all duration-300 bg-brand-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          {/* Footer Logo */}
          <div className="flex items-center gap-2">
            <a href="#" onClick={(e) => handleLinkClick(e, 'landing')} className="flex items-center gap-2 group">
              <img src={logoUrl} alt="ResumeIQ Logo" className="h-8 w-auto object-contain drop-shadow-md" />
              <span className="font-sans text-lg font-bold tracking-tight group-hover:text-brand-lightBlue transition-colors text-brand-textPrimary">
                Resume<span className="text-brand-lightBlue group-hover:text-white transition-colors">IQ</span>
              </span>
            </a>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-brand-textMuted font-sans font-light">
            <a href="#privacy" onClick={(e) => handleLinkClick(e, 'privacy')} className="transition-colors duration-200 hover:text-brand-lightBlue">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => handleLinkClick(e, 'terms')} className="transition-colors duration-200 hover:text-brand-lightBlue">
              Terms of Service
            </a>
            <a href="#support" onClick={(e) => handleLinkClick(e, 'support')} className="transition-colors duration-200 hover:text-brand-lightBlue">
              Contact Support
            </a>
          </div>

        </div>

        {/* Footer Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-brand-textMuted font-sans font-light">
          <p>© {currentYear} ResumeIQ Systems. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for career excellence
          </p>
        </div>

      </div>
    </footer>
  )
}
