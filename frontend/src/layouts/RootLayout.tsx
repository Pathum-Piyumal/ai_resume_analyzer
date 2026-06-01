import React from 'react'
import Navbar from '../../components/Navbar'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-textPrimary flex flex-col selection:bg-brand-orange/30 selection:text-white">
      <Navbar /> {/* <-- 2. Render the Navbar */}
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer will go here */}
    </div>
  )
}
