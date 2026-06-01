import HeroSection from '../../components/home/HeroSection'
import StatsBar from '../../components/home/StatsBar'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      <HeroSection />
      <StatsBar />
    </div>
  )
}
