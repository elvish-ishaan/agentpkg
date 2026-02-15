'use client'

import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PopularPackagesSection } from '@/components/landing/popular-packages-section'
import { StatsSection } from '@/components/landing/stats-section'
import { IntegrationsSection } from '@/components/landing/integrations-section'
import { CtaSection } from '@/components/landing/cta-section'
import { useAllAgents } from '@/lib/hooks/use-agents'
import { useAllSkills } from '@/lib/hooks/use-skills'

export default function HomePage() {
  const { data: agents, isLoading: agentsLoading } = useAllAgents()
  const { data: skills, isLoading: skillsLoading } = useAllSkills()

  // Get top 6 agents by downloads or most recent
  const popularAgents = agents
    ?.sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 6) || []

  // Get top 6 skills by downloads or most recent
  const popularSkills = skills
    ?.sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 6) || []

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PopularPackagesSection
        agents={popularAgents}
        skills={popularSkills}
        agentsLoading={agentsLoading}
        skillsLoading={skillsLoading}
      />
      <IntegrationsSection />
      <CtaSection />
    </div>
  )
}
