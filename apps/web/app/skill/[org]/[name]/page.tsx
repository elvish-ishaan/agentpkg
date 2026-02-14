'use client'

import { use } from 'react'
import { useSkill, useSkillVersions } from '@/lib/hooks/use-skills'
import { SkillHeader } from '@/components/skills/skill-header'
import { SkillReadme } from '@/components/skills/skill-readme'
import { SkillVersions } from '@/components/skills/skill-versions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SkillPageProps {
  params: Promise<{
    org: string
    name: string
  }>
}

export default function SkillPage({ params }: SkillPageProps) {
  const { org: rawOrg, name } = use(params)

  // Strip @ prefix since API client adds it back
  const org = rawOrg.startsWith('@') ? rawOrg.slice(1) : rawOrg

  const { data: skill, isLoading: skillLoading, error: skillError } = useSkill(org, name)
  const { data: versions, isLoading: versionsLoading } = useSkillVersions(org, name)

  if (skillLoading) {
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

  if (skillError || !skill) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {skillError instanceof Error ? skillError.message : 'Skill not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const readmeContent = skill.latestVersion?.content || '# No README available'

  return (
    <div>
      <SkillHeader skill={skill} />

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
                <SkillReadme content={readmeContent} />
              </TabsContent>

              <TabsContent value="versions" className="mt-6">
                {versionsLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : versions && versions.length > 0 ? (
                  <SkillVersions
                    versions={versions}
                    orgName={org}
                    skillName={name}
                    latestVersion={skill.latestVersion?.version}
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
                <CardDescription>Use agentpkg CLI to install this skill</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  <code>agentpkg add skill @{skill.org?.name}/{skill.name}</code>
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
                  <p className="text-2xl font-bold">{skill.downloads?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Latest Version</p>
                  <p className="text-sm font-mono">{skill.latestVersion?.version || 'N/A'}</p>
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
                  <p className="text-sm">@{skill.org?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-sm">
                    {skill.createdAt ? formatDistanceToNow(new Date(skill.createdAt), { addSuffix: true }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">
                    {skill.updatedAt ? formatDistanceToNow(new Date(skill.updatedAt), { addSuffix: true }) : 'N/A'}
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
