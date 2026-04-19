import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface RootLayoutProps {
  children: React.ReactNode
  currentView?: 'landing' | 'signin' | 'signup' | 'forgot' | 'app'
  onNavigate?: (view: 'landing' | 'signin' | 'signup' | 'forgot' | 'app') => void
}

export default function RootLayout({ children, currentView = 'landing', onNavigate }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-textPrimary flex flex-col selection:bg-brand-blue/30 selection:text-white">
      <Navbar currentView={currentView} onNavigate={onNavigate} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
