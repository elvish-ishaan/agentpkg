'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles, Users, Building2, ArrowRight } from 'lucide-react'

export function PricingSection() {
  return (
    <section className="min-h-screen w-full relative py-24">
      {/* Dark Dot Matrix Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-actor text-white">Coming Soon</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: "'Della Respira', serif" }}
          >
            Pricing Plans
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light font-body"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            For now, AgentPkg is completely free for everyone. We want the world to explore and build with AI agents without barriers.
          </p>
        </motion.div>

        {/* Current Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="border-white/30 bg-black/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <CardTitle
                className="text-4xl md:text-5xl text-white mb-4"
                style={{ fontFamily: "'Della Respira', serif" }}
              >
                Free Access for All
              </CardTitle>
              <CardDescription
                className="text-lg text-gray-400 max-w-2xl mx-auto"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                We&apos;re currently in our growth phase, inviting developers and organizations worldwide to try out AgentPkg at no cost.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white font-actor flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-400" />
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-3 text-gray-300 font-body">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Unlimited agent and skill publishing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Full access to the package registry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Organization and team collaboration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Community support and documentation</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white font-actor flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    Coming Soon
                  </h3>
                  <ul className="space-y-3 text-gray-300 font-body">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Premium features for enterprises</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Advanced analytics and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Priority support and SLA guarantees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Custom integrations and solutions</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-center">
                <Button
                  asChild
                  size="lg"
                  className="text-base px-8 bg-white text-black hover:bg-gray-200"
                >
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Future Plans Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            style={{ fontFamily: "'Della Respira', serif" }}
          >
            Future Pricing Tiers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Individual Plan */}
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-white font-actor">Individual</CardTitle>
                <CardDescription className="text-base text-gray-400 font-body">
                  Perfect for developers
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-white mb-2">Free</div>
                  <div className="text-sm text-gray-500">Forever</div>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm font-body">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Unlimited public packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Community support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="border-white/30 bg-black shadow-2xl relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
                    radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
                    #000000
                  `,
                }}
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full">
                Coming Soon
              </div>
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-white font-actor">Team</CardTitle>
                <CardDescription className="text-base text-gray-400 font-body">
                  For growing teams
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-white mb-2">TBD</div>
                  <div className="text-sm text-gray-500">Per user/month</div>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm font-body">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Individual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Private packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-white font-actor">Enterprise</CardTitle>
                <CardDescription className="text-base text-gray-400 font-body">
                  For large organizations
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-white mb-2">Custom</div>
                  <div className="text-sm text-gray-500">Contact us</div>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm font-body">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Everything in Team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>SLA guarantees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <Card className="border-white/30 bg-black/80 backdrop-blur-sm shadow-2xl max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle
                className="text-3xl md:text-4xl text-white"
                style={{ fontFamily: "'Della Respira', serif" }}
              >
                Questions About Pricing?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-lg text-gray-400 mb-6 font-body"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                We&apos;re still finalizing our pricing structure. While we build and grow the platform, enjoy full access completely free. Want to stay updated on pricing announcements?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="text-base px-8 bg-white text-black hover:bg-gray-200"
                >
                  <Link href="/register">Start Building Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base px-8 bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
