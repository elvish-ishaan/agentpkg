'use client'

import { use } from 'react'
import { useOrg } from '@/lib/hooks/use-orgs'
import { useOrgAgents } from '@/lib/hooks/use-agents'
import { useOrgSkills } from '@/lib/hooks/use-skills'
import { OrgHeader } from '@/components/orgs/org-header'
import { AgentCard } from '@/components/agents/agent-card'
import { SkillCard } from '@/components/skills/skill-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle } from 'lucide-react'

interface OrgPageProps {
  params: Promise<{
    orgName: string
  }>
}

export default function OrgPage({ params }: OrgPageProps) {
  const { orgName } = use(params)

  const { data: org, isLoading: orgLoading, error: orgError } = useOrg(orgName)
  const { data: agents, isLoading: agentsLoading } = useOrgAgents(orgName)
  const { data: skills, isLoading: skillsLoading } = useOrgSkills(orgName)

  if (orgLoading) {
    return (
      <div>
        <div className="border-b bg-muted/30">
          <div className="container px-4 py-8">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
        <div className="container px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (orgError || !org) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {orgError instanceof Error ? orgError.message : 'Organization not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <OrgHeader org={org} />

      <div className="container px-4 py-8">
        <Tabs defaultValue="agents" className="w-full">
          <TabsList>
            <TabsTrigger value="agents">
              Agents ({agents?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="skills">
              Skills ({skills?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-6">
            {agentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] w-full" />
                ))}
              </div>
            ) : agents && agents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No agents published yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            {skillsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] w-full" />
                ))}
              </div>
            ) : skills && skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No skills published yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
