'use client'

import { use } from 'react'
import { useOrg } from '@/lib/hooks/use-orgs'
import { useOrgAgents } from '@/lib/hooks/use-agents'
import { useOrgSkills } from '@/lib/hooks/use-skills'
import { PageTemplate } from '@/components/dashboard/page-template'
import { AgentCard } from '@/components/agents/agent-card'
import { SkillCard } from '@/components/skills/skill-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AlertCircle, Settings, Users, Package, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { InviteMemberDialog } from '@/components/orgs/invite-member-dialog'

interface OrgPageProps {
  params: Promise<{
    orgName: string
  }>
}

export default function OrgPage({ params }: OrgPageProps) {
  const { orgName } = use(params)
  const { user } = useAuth()

  const { data: org, isLoading: orgLoading, error: orgError } = useOrg(orgName)
  const { data: agents, isLoading: agentsLoading } = useOrgAgents(orgName)
  const { data: skills, isLoading: skillsLoading } = useOrgSkills(orgName)

  // Check if user is owner
  const isOwner = user && org && (
    user.id === org.ownerId ||
    org.members?.some(m => m.userId === user.id && m.role === 'OWNER')
  )

  const memberCount = org?.members?.length || 0
  const agentCount = agents?.length || 0

  if (orgLoading) {
    return (
      <PageTemplate title="Loading..." description="Loading organization details">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      </PageTemplate>
    )
  }

  if (orgError || !org) {
    return (
      <PageTemplate title="Not Found" description="Organization not found">
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {orgError instanceof Error ? orgError.message : 'Organization not found'}
          </AlertDescription>
        </Alert>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate
      title={`@${org.name}`}
      description="Browse agents and skills published by this organization"
      actions={
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <InviteMemberDialog orgName={org.name} />
              <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link href={`/dashboard/organizations/${org.name}`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage
                </Link>
              </Button>
            </>
          )}
        </div>
      }
    >
      {/* Organization Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>{agentCount} {agentCount === 1 ? 'agent' : 'agents'}</span>
        </div>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="agents" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <Package className="h-4 w-4 mr-2" />
            Agents ({agents?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:text-black">
            <Package className="h-4 w-4 mr-2" />
            Skills ({skills?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="mt-6">
          {agentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-full bg-white/5" />
              ))}
            </div>
          ) : agents && agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 font-body">No agents published yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          {skillsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-full bg-white/5" />
              ))}
            </div>
          ) : skills && skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 font-body">No skills published yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageTemplate>
  )
}
