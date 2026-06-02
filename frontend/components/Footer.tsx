export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-white/5 bg-[#04060E] py-12 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          {/* Footer Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 p-0.5 shadow-md shadow-brand-blue/5">
              <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#04060E]">
                <svg className="h-4 w-4 text-brand-lightBlue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
                </svg>
              </div>
            </div>
            <span className="font-sans text-lg font-bold tracking-tight text-white">
              Career<span className="text-brand-lightBlue">AI</span>
            </span>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-brand-textMuted font-sans font-light">
            <a href="#privacy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#support" className="hover:text-white transition-colors duration-200">
              Contact Support
            </a>
          </div>

        </div>

        {/* Footer Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-brand-textMuted font-sans font-light">
          <p>© {currentYear} CareerAI Systems. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for career excellence
          </p>
        </div>

      </div>
    </footer>
  )
}
