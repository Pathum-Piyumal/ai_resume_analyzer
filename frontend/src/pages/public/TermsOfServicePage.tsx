import React from 'react'

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans text-brand-textPrimary relative z-10">
      
      {/* Background glow for aesthetics */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
        Terms of Service
      </h1>
      <p className="text-sm text-brand-textMuted mb-12">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div className="space-y-8 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CareerAI (ResumeAI), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Use of Service</h2>
          <p>
            CareerAI provides an AI-powered platform to analyze resumes and identify skill gaps. You agree to use this service only for lawful purposes and in accordance with these Terms. You are responsible for any content (such as resumes) that you upload.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">4. Intellectual Property</h2>
          <p>
            The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of CareerAI and its licensors. The service is protected by copyright, trademark, and other laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">5. Limitation of Liability</h2>
          <p>
            In no event shall CareerAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>
      </div>
    </div>
  )
}
