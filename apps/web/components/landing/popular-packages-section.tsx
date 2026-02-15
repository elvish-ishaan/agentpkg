import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AgentCard } from '@/components/agents/agent-card'
import { SkillCard } from '@/components/skills/skill-card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight } from 'lucide-react'
import type { Agent, Skill } from '@agentpkg/types'

interface PopularPackagesSectionProps {
  agents: Agent[]
  skills: Skill[]
  agentsLoading: boolean
  skillsLoading: boolean
}

export function PopularPackagesSection({
  agents,
  skills,
  agentsLoading,
  skillsLoading,
}: PopularPackagesSectionProps) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Popular Agents */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex flex-col gap-4">
                <h2
                  className="text-4xl md:text-5xl font-bold mb-3 text-white"
                  style={{ fontFamily: "'Della Respira', serif" }}
                >
                  Popular Agents
                </h2>
                <p className="text-lg text-gray-400">
                  Discover the most popular AI agents in the registry
                </p>
                <Button asChild variant="outline" size="lg" className="w-fit bg-transparent border-gray-700 text-white hover:bg-gray-800">
                  <Link href="/agent">
                    View All Agents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {agentsLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full bg-gray-800/50" />
                ))}
              </div>
            ) : agents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {agents.slice(0, 3).map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                <p className="text-gray-400 text-lg">
                  No agents available yet. Be the first to publish!
                </p>
              </div>
            )}
          </div>

          {/* Popular Skills */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex flex-col gap-4">
                <h2
                  className="text-4xl md:text-5xl font-bold mb-3 text-white"
                  style={{ fontFamily: "'Della Respira', serif" }}
                >
                  Popular Skills
                </h2>
                <p className="text-lg text-gray-400">
                  Explore the most popular skills in the registry
                </p>
                <Button asChild variant="outline" size="lg" className="w-fit bg-transparent border-gray-700 text-white hover:bg-gray-800">
                  <Link href="/skill">
                    View All Skills
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {skillsLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full bg-gray-800/50" />
                ))}
              </div>
            ) : skills.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {skills.slice(0, 3).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                <p className="text-gray-400 text-lg">
                  No skills available yet. Be the first to publish!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
