import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sliders, Users, Key, AlertTriangle, ChevronRight, Printer } from 'lucide-react'

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance')

  const sections = [
    { id: 'acceptance', name: '1. Acceptance', icon: FileText },
    { id: 'use', name: '2. Use of Service', icon: Sliders },
    { id: 'accounts', name: '3. User Accounts', icon: Users },
    { id: 'ip', name: '4. Intel. Property', icon: Key },
    { id: 'liability', name: '5. Limitation of Liab.', icon: AlertTriangle },
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
            Terms of Service
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
            id="acceptance" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              By accessing or using ResumeIQ, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section 
            id="use" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">2. Use of Service</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              ResumeIQ provides an AI-powered platform to analyze resumes and identify skill gaps. You agree to use this service only for lawful purposes and in accordance with these Terms. You are responsible for any content (such as resumes) that you upload.
            </p>
          </section>

          <section 
            id="accounts" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">3. User Accounts</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
            </p>
          </section>

          <section 
            id="ip" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Key className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">4. Intellectual Property</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of ResumeIQ and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section 
            id="liability" 
            className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-lg font-bold text-white tracking-tight">5. Limitation of Liability</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              In no event shall ResumeIQ, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}
