import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function PricingSection() {
  return (
    <section id="pricing" className="container px-4 py-24 bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Pricing
        </h2>
        <p className="text-xl font-subheading text-muted-foreground max-w-2xl mx-auto">
          Simple, transparent pricing for everyone
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/50 shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-heading mb-2">
              Coming Soon
            </CardTitle>
            <CardDescription className="text-lg font-body">
              Currently in Beta
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground font-body text-base max-w-md mx-auto">
              AgentPkg is currently <span className="font-semibold text-foreground">free to use</span> during our beta period.
              We're working on pricing plans that will be fair, transparent, and designed to support developers of all sizes.
            </p>
            <p className="text-sm text-muted-foreground font-body">
              Pricing details will be announced soon. Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
