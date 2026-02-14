'use client'

import { use } from 'react'
import { useAgent, useAgentVersions } from '@/lib/hooks/use-agents'
import { AgentHeader } from '@/components/agents/agent-header'
import { AgentReadme } from '@/components/agents/agent-readme'
import { AgentVersions } from '@/components/agents/agent-versions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AgentPageProps {
  params: Promise<{
    org: string
    name: string
  }>
}

export default function AgentPage({ params }: AgentPageProps) {
  const { org: rawOrg, name } = use(params)

  // Strip @ prefix since API client adds it back
  const org = rawOrg.startsWith('@') ? rawOrg.slice(1) : rawOrg

  const { data: agent, isLoading: agentLoading, error: agentError } = useAgent(org, name)
  const { data: versions, isLoading: versionsLoading } = useAgentVersions(org, name)

  if (agentLoading) {
    return (
      <div>
        <div className="border-b bg-muted/30">
          <div className="container px-4 py-8">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-6 w-full max-w-2xl" />
          </div>
        </div>
        <div className="container px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (agentError || !agent) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {agentError instanceof Error ? agentError.message : 'Agent not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const readmeContent = agent.latestVersion?.content || '# No README available'

  return (
    <div>
      <AgentHeader agent={agent} />

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="readme" className="w-full">
              <TabsList>
                <TabsTrigger value="readme">README</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
              </TabsList>

              <TabsContent value="readme" className="mt-6">
                <AgentReadme content={readmeContent} />
              </TabsContent>

              <TabsContent value="versions" className="mt-6">
                {versionsLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : versions && versions.length > 0 ? (
                  <AgentVersions
                    versions={versions}
                    orgName={org}
                    agentName={name}
                    latestVersion={agent.latestVersion?.version}
                  />
                ) : (
                  <p className="text-muted-foreground">No versions available</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Install Card */}
            <Card>
              <CardHeader>
                <CardTitle>Install</CardTitle>
                <CardDescription>Use agentpkg CLI to install this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  <code>npx agentpkg install @{agent.org?.name}/{agent.name}</code>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold">{agent.downloads?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Latest Version</p>
                  <p className="text-sm font-mono">{agent.latestVersion?.version || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organization</p>
                  <p className="text-sm">@{agent.org?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(agent.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
