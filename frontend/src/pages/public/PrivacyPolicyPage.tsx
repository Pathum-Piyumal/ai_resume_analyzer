import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, Database, Lock, Mail, ChevronRight, Printer } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('intro')

  const sections = [
    { id: 'intro', name: '1. Introduction', icon: Shield },
    { id: 'collect', name: '2. Data We Collect', icon: Database },
    { id: 'use', name: '3. How We Use Data', icon: Eye },
    { id: 'security', name: '4. Data Security', icon: Lock },
    { id: 'contact', name: '5. Contact Us', icon: Mail },
  ]

  const handleScrollTo = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans text-brand-textPrimary relative z-10 text-left min-h-[90vh]">
      
      {/* Background glow for aesthetics */}
      <div className="absolute top-0 left-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/5 pb-8 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs text-brand-textMuted">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <motion.button 
          onClick={() => window.print()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-all self-start sm:self-auto"
        >
          <Printer className="h-4 w-4" />
          <span>Print Document</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Sticky Table of Contents Sidebar */}
        <div className="md:col-span-4 sticky top-24 space-y-4">
          <div className="rounded-2xl border border-white/5 bg-brand-card/30 p-4 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4 px-2">
              Document Index
            </span>
            <nav className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon
                const isActive = activeSection === sec.id
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollTo(sec.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive 
                        ? 'bg-brand-blue/10 text-brand-lightBlue border border-brand-blue/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{sec.name}</span>
                    <ChevronRight className={`ml-auto h-3.5 w-3.5 opacity-0 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content Cards */}
        <div className="md:col-span-8 space-y-6">
          
          <section 
            id="intro" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">1. Introduction</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Welcome to ResumeIQ. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section 
            id="collect" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Database className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">2. Data We Collect</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="space-y-3 pl-1">
              <li className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-light">
                <strong className="text-white font-bold block mb-1">Identity Data:</strong> Includes first name, last name, username or similar identifier.
              </li>
              <li className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-light">
                <strong className="text-white font-bold block mb-1">Contact Data:</strong> Includes email address and telephone numbers.
              </li>
              <li className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-light">
                <strong className="text-white font-bold block mb-1">Document Data:</strong> Includes your uploaded resumes, CVs, cover letters, and any data extracted from them by our AI systems.
              </li>
              <li className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-light">
                <strong className="text-white font-bold block mb-1">Technical Data:</strong> Includes internet protocol (IP) address, login parameters, browser settings, and device metrics.
              </li>
            </ul>
          </section>

          <section 
            id="use" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Eye className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">3. How We Use Your Data</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your data to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              <li>Perform the services you request (such as evaluating resume match score and compiling metrics).</li>
              <li>Provide notifications regarding changes to your dashboard or services.</li>
              <li>Optimize our internal LLM parsing engines without exposing raw identity details.</li>
            </ul>
          </section>

          <section 
            id="security" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">4. Data Security</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>

          <section 
            id="contact" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">5. Contact Us</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact our Data Privacy Manager at:
            </p>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-brand-textMuted font-mono">
              Email: privacy@ResumeIQ.example.com<br />
              Address: ResumeIQ Inc., Privacy Division, San Francisco, CA
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
