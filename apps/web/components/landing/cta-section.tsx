import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
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
      <div className="container relative z-10 px-4 mx-auto max-w-7xl flex items-center justify-center min-h-screen">
        <div className="relative max-w-5xl w-full">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Rose Gold Whisper Gradient Background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `linear-gradient(270deg, #FFECB3 0%, #FFE0B2 20%, #FFCDD2 40%, #F8BBD9 60%, #E1BEE7 80%, #D1C4E9 100%)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="space-y-8">
                <h2
                  className="text-4xl md:text-6xl font-bold text-gray-900"
                  style={{ fontFamily: "'Della Respira', serif" }}
                >
                  Ready to Get Started?
                </h2>
                <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-light">
                  Join thousands of developers building the future of AI. Publish your first package today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="text-base px-8 bg-gray-900 hover:bg-gray-800 text-white border-none"
                  >
                    <Link href="/register">
                      Create Free Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-base px-8 bg-white/50 backdrop-blur-sm border-gray-900 text-gray-900 hover:bg-white/80"
                  >
                    <Link href="/agent">Explore Packages</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
