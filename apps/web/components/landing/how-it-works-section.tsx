import { ArrowRight } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Publish',
    description: 'Package your agent or skill and publish it with a single command',
    code: '$ agentpkg publish',
  },
  {
    number: 2,
    title: 'Discover',
    description: 'Browse the registry to find the perfect agents and skills for your needs',
    code: null,
  },
  {
    number: 3,
    title: 'Install',
    description: 'Install and integrate packages instantly into your projects',
    code: '$ agentpkg install @org/agent',
  },
]

export function HowItWorksSection() {
  return (
    <section className="container px-4 py-24 bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          How It Works
        </h2>
        <p className="text-xl font-subheading text-muted-foreground max-w-2xl mx-auto">
          Get started in three simple steps
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-start justify-between relative">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 relative">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Number Badge */}
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-heading font-bold shadow-lg">
                  {step.number}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-subheading font-bold">{step.title}</h3>
                  <p className="text-muted-foreground font-body max-w-xs">
                    {step.description}
                  </p>
                </div>

                {/* Code Example */}
                {step.code && (
                  <div className="w-full max-w-sm">
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm border">
                      <code>{step.code}</code>
                    </div>
                  </div>
                )}
              </div>

              {/* Connecting Arrow */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[60%] w-[80%] flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary/50" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center space-y-4">
              {/* Number Badge */}
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-heading font-bold shadow-lg">
                {step.number}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-2xl font-subheading font-bold">{step.title}</h3>
                <p className="text-muted-foreground font-body max-w-xs">
                  {step.description}
                </p>
              </div>

              {/* Code Example */}
              {step.code && (
                <div className="w-full max-w-sm">
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm border">
                    <code>{step.code}</code>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
