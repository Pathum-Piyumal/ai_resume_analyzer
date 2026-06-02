import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface RootLayoutProps {
  children: React.ReactNode
  currentView?: 'landing' | 'signin' | 'signup' | 'forgot' | 'app' | 'privacy' | 'terms' | 'support'
  onNavigate?: (view: 'landing' | 'signin' | 'signup' | 'forgot' | 'app' | 'privacy' | 'terms' | 'support') => void
}

export default function RootLayout({ children, currentView = 'landing', onNavigate }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-textPrimary flex flex-col selection:bg-brand-blue/30 selection:text-white">
      <Navbar currentView={currentView as any} onNavigate={onNavigate as any} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
