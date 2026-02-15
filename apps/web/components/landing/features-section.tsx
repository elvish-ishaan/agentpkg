'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Terminal, Users, Shield, GitBranch, Check } from 'lucide-react'
import { useScroll, useTransform, motion } from 'motion/react'
import { useRef } from 'react'

const features = [
  {
    icon: Terminal,
    title: 'Easy Publishing',
    description: 'Publish agents and skills with a single CLI command. Built-in version control and semantic versioning support.',
    details: [
      'One-command deployment with agentpkg publish',
      'Automatic semantic versioning and changelog generation',
      'Built-in package validation and quality checks',
      'Instant global CDN distribution for fast downloads',
    ],
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Create organizations, invite team members, and manage permissions. Collaborate seamlessly on agent development.',
    details: [
      'Organization workspaces with role-based access control',
      'Invite unlimited team members with custom permissions',
      'Shared package repositories and private registries',
      'Real-time activity feeds and team notifications',
    ],
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'SHA-256 integrity verification, private packages by default, and granular access control to keep your code safe.',
    details: [
      'SHA-256 checksum verification for every package',
      'Private packages by default with opt-in publishing',
      'Two-factor authentication and SSO support',
      'Automated security scanning and vulnerability alerts',
    ],
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Semantic versioning, dependency management, and easy rollbacks. Track every change to your packages.',
    details: [
      'Full semver support with automatic compatibility checks',
      'Dependency graph visualization and conflict resolution',
      'One-click rollbacks to any previous version',
      'Complete audit trail of all package changes',
    ],
  },
]

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div className="w-full relative">
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
      <section ref={containerRef} className="relative z-10">
        {/* Sticky Header */}
        <div className="sticky top-20 pt-12 pb-6 md:pt-16 md:pb-8 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent z-30">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-della-respira)' }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white"
            >
              Everything You Need
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl md:text-2xl font-subheading text-gray-400 max-w-2xl mx-auto"
            >
              A complete platform for building, sharing, and deploying AI agents and skills
            </motion.p>
          </div>
        </div>

        {/* Stacking Cards */}
        <div className="relative pt-24 pb-24" style={{ height: `${features.length * 100}vh` }}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            const targetScale = 1 - (features.length - index) * 0.08
            const start = index / features.length
            const end = (index + 1) / features.length

            return (
              <div
                key={feature.title}
                style={{
                  top: `${120 + index * 20}px`,
                  position: 'sticky',
                }}
                className="mx-auto w-[calc(100%-2rem)] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[65%] max-w-5xl
                  h-[70vh] sm:h-[75vh] md:h-[80vh]
                  rounded-2xl overflow-hidden
                  border-4 border-white/30 shadow-2xl"
              >
                {/* Solid Black Background with Aurora Overlay */}
                <div className="absolute inset-0 z-0 bg-black">
                  <div
                    className="absolute inset-0 z-0 opacity-100"
                    style={{
                      background: `
                        radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
                        radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
                        radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
                        radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
                        #000000
                      `,
                    }}
                  />
                </div>

                {/* Card Content */}
                <FeatureCard
                  feature={feature}
                  Icon={Icon}
                  index={index}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  end={end}
                  targetScale={targetScale}
                />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  feature,
  Icon,
  index,
  scrollYProgress,
  start,
  end,
  targetScale,
}: {
  feature: typeof features[0]
  Icon: any
  index: number
  scrollYProgress: any
  start: number
  end: number
  targetScale: number
}) {
  const scale = useTransform(scrollYProgress, [start, end], [1, targetScale])

  return (
    <motion.div
      style={{ scale }}
      className="relative z-10 h-full flex flex-col p-6 sm:p-8 md:p-10 lg:p-12"
    >
      <div className="space-y-4 md:space-y-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: index * 0.1,
          }}
          viewport={{ once: true }}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm
            flex items-center justify-center border-2 border-white/20"
        >
          <Icon className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
        </motion.div>

        {/* Title and Description */}
        <div className="space-y-2 md:space-y-3">
          <h3
            style={{ fontFamily: 'var(--font-della-respira)' }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            {feature.title}
          </h3>
          <p className="text-base sm:text-lg md:text-xl font-body leading-relaxed text-gray-300">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Details List */}
      <div className="flex-1 flex items-center mt-6 md:mt-8">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {feature.details.map((detail, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1 + idx * 0.1,
              }}
              viewport={{ once: true }}
              className="flex items-start gap-2 sm:gap-3 group"
            >
              <div className="mt-0.5 sm:mt-1 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10
                flex items-center justify-center group-hover:bg-white/20 transition-colors border border-white/20">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <p className="text-sm sm:text-base md:text-lg font-body text-gray-200 leading-relaxed">
                {detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
