import HeroSection from '../../../components/home/HeroSection'
import StatsBar from '../../../components/home/StatsBar'
import FeaturesSection from '../../../components/home/FeaturesSection'
import PricingSection from '../../../components/home/PricingSection'
import CTASection from '../../../components/home/CTASection'

interface HomePageProps {
  onNavigate?: (view: 'landing' | 'analyze') => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      <HeroSection onNavigate={onNavigate} />
      <StatsBar />
      <FeaturesSection />
      <PricingSection onNavigate={onNavigate as any} />
      <CTASection onNavigate={onNavigate} />
    </div>
  )
}
