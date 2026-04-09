import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  const navLinks = [
    { name: 'Analyze', href: '#analyze' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Pricing', href: '#pricing' }
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-brand-dark/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Brand */}
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 p-0.5 shadow-lg shadow-brand-blue/10">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-brand-dark">
                  <svg className="h-4 w-4 text-brand-lightBlue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
                  </svg>
                </div>
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-white">
                Carbon<span className="text-brand-lightBlue">AI</span>
              </span>
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors duration-200 uppercase tracking-wider"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#analyze"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white rounded-md bg-brand-blue hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
            >
              Get Started
            </a>
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
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
          <div className="mt-4 px-3 pb-2">
            <a
              href="#analyze"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-lg bg-brand-blue py-2.5 text-center text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition-transform duration-150"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
