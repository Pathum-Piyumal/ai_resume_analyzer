import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans text-brand-textPrimary relative z-10">
      
      {/* Background glow for aesthetics */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
        Privacy Policy
      </h1>
      <p className="text-sm text-brand-textMuted mb-12">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div className="space-y-8 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Introduction</h2>
          <p>
            Welcome to CareerAI (also referred to as ResumeAI). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Data We Collect</h2>
          <p>
            We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
            <li><strong>Document Data:</strong> includes your uploaded resumes, CVs, cover letters, and any data extracted from them by our AI systems.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., analyzing your resume).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact our Data Privacy Manager at privacy@careerai.example.com.
          </p>
        </section>
      </div>
    </div>
  )
}
