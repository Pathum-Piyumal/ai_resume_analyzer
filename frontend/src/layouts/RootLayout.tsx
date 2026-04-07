import React from 'react'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-textPrimary flex flex-col selection:bg-brand-orange/30 selection:text-white">
      {/* Navbar will go here */}
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer will go here */}
    </div>
  )
}
