import { PricingSection } from '@/components/landing/pricing-section'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - AgentPkg',
  description: 'Explore AgentPkg pricing plans. Currently free for all developers and organizations during our growth phase.',
}

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      <PricingSection />
    </div>
  )
}
