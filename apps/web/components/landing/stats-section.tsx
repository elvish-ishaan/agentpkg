'use client'

import { NumberTicker } from '@/components/ui/number-ticker'

const stats = [
  { label: 'Agents Published', value: 1000 },
  { label: 'Organizations', value: 500 },
  { label: 'Total Downloads', value: 10000 },
  { label: 'Skills Available', value: 750 },
]

export function StatsSection() {
  return (
    <section className="w-full bg-black relative">
      {/* Diagonal Cross Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.1) 49%, rgba(255, 255, 255, 0.1) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.1) 49%, rgba(255, 255, 255, 0.1) 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
        }}
      />

      {/* Content */}
      <div className="container px-4 py-16 md:py-24 relative z-10 mx-auto max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-3">
                <div className="text-5xl md:text-6xl font-bold text-white">
                  <NumberTicker value={stat.value} className="text-white font-bold" />
                  <span>+</span>
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
