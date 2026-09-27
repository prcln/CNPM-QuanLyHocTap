import React from 'react'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { RegulationSection } from './RegulationSection'
import { FaqSection } from './FaqSection'

interface LandingPageProps {
  onEnterPortal: (tabId?: 'overview' | 'courses' | 'assignments' | 'grades' | 'schedule') => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection onEnterPortal={() => onEnterPortal('overview')} />
      <FeaturesSection onSelectFeature={(tab) => onEnterPortal(tab)} />
      <RegulationSection />
      <FaqSection />
    </div>
  )
}
