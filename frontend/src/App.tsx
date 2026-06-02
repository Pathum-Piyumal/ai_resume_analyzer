import { useState } from 'react'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'

export default function App() {
  const [view, setView] = useState<'landing' | 'analyze'>('landing')

  return (
    <RootLayout currentView={view} onNavigate={setView}>
      {view === 'landing' ? (
        <HomePage onNavigate={setView} />
      ) : (
        <AnalyzePage />
      )}
    </RootLayout>
  )
}
