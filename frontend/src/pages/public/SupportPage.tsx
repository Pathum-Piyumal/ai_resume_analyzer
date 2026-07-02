import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Mail, MessageSquare, Send, Check } from 'lucide-react'

export default function SupportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      setIsSubmitted(true)
    }, 600)
  }

  const faqs = [
    {
      q: "How many resumes can I analyze on the Free plan?",
      a: "You get 10 free AI Resume Analyses per month. Future upgrades to our Pro and Elite tiers will offer unlimited analyses and advanced career coaching."
    },
    {
      q: "How accurate is the ATS scoring system?",
      a: "ResumeIQ's ATS scoring system uses state-of-the-art semantic parsing and LLM algorithms trained on industry-standard job description mapping to give highly accurate ATS keyword matches."
    },
    {
      q: "Is my uploaded resume data secure?",
      a: "Absolutely. All resume files are encrypted in transit and at rest. We never sell your personal information or resume contents to third-party recruiters."
    },
    {
      q: "Can I customize cover letters for specific jobs?",
      a: "Yes! While basic recommendations are free, our upcoming Pro package includes an automated customized Cover Letter builder tailored precisely to target roles."
    }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-brand-textPrimary relative z-10 text-left min-h-[85vh]">
      
      {/* Background glow for aesthetics */}
      <div className="absolute top-0 left-1/3 -z-10 h-[350px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />

      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Support Center
        </h1>
        <p className="text-sm sm:text-base text-brand-textMuted max-w-2xl leading-relaxed">
          Have a question about ResumeIQ? Find instant answers below or get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane: Accordion FAQs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-brand-lightBlue" />
            <h2 className="text-lg font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-white/5 bg-brand-card/30 overflow-hidden backdrop-blur-md transition-all hover:border-white/10"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-brand-lightBlue transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-4 text-xs text-brand-textMuted font-light leading-relaxed border-t border-white/5 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <div className="p-4 rounded-xl border border-brand-blue/20 bg-brand-blue/5 flex gap-4 items-center">
            <MessageSquare className="h-6 w-6 text-brand-lightBlue shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Need custom help?</h4>
              <p className="text-[10px] text-brand-textMuted leading-relaxed mt-0.5">
                Our support team is online Monday - Friday to resolve any account queries.
              </p>
            </div>
          </div>
        </div>

        {/* Right Pane: Glassmorphic Contact Form */}
        <div className="lg:col-span-6">
          <div className="bg-brand-card/45 border border-white/5 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl backdrop-blur-md">
            
            <div className="flex items-center gap-2 mb-6">
              <Mail className="h-5 w-5 text-brand-lightBlue" />
              <h2 className="text-base font-bold text-white tracking-tight">Send a Message</h2>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Alex Rivera"
                      className="w-full bg-[#121626]/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      className="w-full bg-[#121626]/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    placeholder="E.g., Payment issues, pricing queries..."
                    className="w-full bg-[#121626]/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Describe your question or issue in detail..."
                    className="w-full bg-[#121626]/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 transition-all font-light resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full rounded-xl bg-brand-blue hover:bg-blue-600 py-3.5 font-bold text-xs text-white shadow-xl shadow-brand-blue/15 hover:shadow-brand-blue/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <Send className="h-3.5 w-3.5" />
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed">
                  Thanks for reaching out. Our support team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-5 py-2 rounded-lg border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
