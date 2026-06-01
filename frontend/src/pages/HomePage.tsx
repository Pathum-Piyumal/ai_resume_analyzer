import HeroSection from '../../components/home/HeroSection'
import StatsBar from '../../components/home/StatsBar'
import FeaturesSection from '../../components/home/FeaturesSection'
import CTASection from '../../components/home/CTASection'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}
