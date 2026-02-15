'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Copy, Check } from 'lucide-react'
import { Della_Respira } from 'next/font/google'
import { useState } from 'react'
import { TerminalDemo } from './terminal'

const dellaRespira = Della_Respira({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export function HeroSection() {
  const [copied, setCopied] = useState(false)
  const installCommand = 'npm install -g @agentpkg/cli'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/diqurtmad/image/upload/v1771137285/Gemini_Generated_Image_rilpfirilpfirilp_zmfau6.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="container px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-subheading backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className=' text-white'>The Modern AI Package Registry</span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white ${dellaRespira.className}`}>
            Build the Future
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              with AI Agents
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-body text-muted-foreground max-w-2xl font-light">
            Discover, share, and deploy AI agents and skills with the world's most advanced package registry built for the AI era.
          </p>

          {/* Installation Command */}
          <div className="inline-flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 mt-2">
            <code className="font-mono text-sm text-white">
              {installCommand}
            </code>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-white/10"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>

          {/* Terminal Demo */}
          <div className="relative mt-16 w-full max-w-5xl">
            <TerminalDemo className="!max-h-none !max-w-none w-full h-[400px] md:h-[500px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
