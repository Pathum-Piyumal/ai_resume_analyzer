import React from 'react'
import { FileCode2 } from 'lucide-react'

export default function JobDescription({ text, onTextChange }) {
  const handleChange = (e) => {
    onTextChange(e.target.value)
  }

  return (
    <div className="w-full max-w-xl mx-auto mb-6 text-left">
      <label 
        htmlFor="job-desc" 
        className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-sans"
      >
        Paste Job Description
      </label>
      <div className="relative rounded-xl bg-brand-card/40 border border-white/10 focus-within:border-brand-blue/50 focus-within:ring-2 focus-within:ring-brand-blue/15 transition-all duration-300">
        <textarea
          id="job-desc"
          value={text}
          onChange={handleChange}
          placeholder="Enter the job requirements here..."
          className="w-full h-36 bg-transparent rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none resize-none font-sans font-light leading-relaxed"
          maxLength={10000}
        />
        
        {/* Bottom indicator row */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
          {text.trim() && (
            <span className="text-[10px] font-mono text-brand-textMuted select-none">
              {text.length} chars
            </span>
          )}
          <FileCode2 className="h-4 w-4 text-brand-textMuted opacity-50" />
        </div>
      </div>
    </div>
  )
}
