'use client'

import { use, useState } from 'react'
import { useSkill, useSkillVersions } from '@/lib/hooks/use-skills'
import { SkillHeader } from '@/components/skills/skill-header'
import { SkillReadme } from '@/components/skills/skill-readme'
import { SkillVersions } from '@/components/skills/skill-versions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Copy, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SkillPageProps {
  params: Promise<{
    org: string
    name: string
  }>
}

export default function SkillPage({ params }: SkillPageProps) {
  const { org: rawOrg, name } = use(params)
  const [copied, setCopied] = useState(false)

  // Strip @ prefix since API client adds it back
  const org = rawOrg.startsWith('@') ? rawOrg.slice(1) : rawOrg

  const { data: skill, isLoading: skillLoading, error: skillError } = useSkill(org, name)
  const { data: versions, isLoading: versionsLoading } = useSkillVersions(org, name)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (skillLoading) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-white/10 bg-white/5">
          <div className="container px-4 py-8 max-w-7xl mx-auto">
            <Skeleton className="h-16 w-16 rounded-full mb-4 bg-white/10" />
            <Skeleton className="h-10 w-full max-w-md mb-2 bg-white/10" />
            <Skeleton className="h-6 w-full max-w-2xl bg-white/10" />
          </div>
        </div>
        <div className="container px-4 py-8 max-w-7xl mx-auto">
          <Skeleton className="h-96 w-full bg-white/10" />
        </div>
      </div>
    )
  }

  if (skillError || !skill) {
    return (
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-red-400">Error</AlertTitle>
          <AlertDescription className="text-red-400">
            {skillError instanceof Error ? skillError.message : 'Skill not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const readmeContent = skill.latestVersion?.content || '# No README available'

  return (
    <div className="min-h-screen">
      <SkillHeader skill={skill} />

      <div className="container px-4 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Tabs defaultValue="readme" className="w-full">
              <TabsList className="bg-white/5 border-white/10 w-full sm:w-auto">
                <TabsTrigger value="readme" className="data-[state=active]:bg-white data-[state=active]:text-black flex-1 sm:flex-none">
                  README
                </TabsTrigger>
                <TabsTrigger value="versions" className="data-[state=active]:bg-white data-[state=active]:text-black flex-1 sm:flex-none">
                  Versions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="readme" className="mt-6">
                <SkillReadme content={readmeContent} />
              </TabsContent>

              <TabsContent value="versions" className="mt-6">
                {versionsLoading ? (
                  <Skeleton className="h-64 w-full bg-white/10" />
                ) : versions && versions.length > 0 ? (
                  <SkillVersions
                    versions={versions}
                    orgName={org}
                    skillName={name}
                    latestVersion={skill.latestVersion?.version}
                  />
                ) : (
                  <p className="text-gray-400 font-body">No versions available</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 md:space-y-4 order-1 lg:order-2">
            {/* Install Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-white text-base md:text-lg" style={{ fontFamily: 'var(--font-della-respira)' }}>
                  Install
                </CardTitle>
                <CardDescription className="text-gray-400 font-body text-xs md:text-sm">
                  Use agentpkg CLI to install this skill
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 md:pb-6">
                <div className="relative">
                  <div className="bg-white/5 border border-white/10 p-2 md:p-3 pr-10 rounded-md font-mono text-xs md:text-sm text-white overflow-x-auto">
                    <code className="break-all">agentpkg add skill @{skill.org?.name}/{skill.name}</code>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-white/10"
                    onClick={() => handleCopy(`agentpkg add skill @${skill.org?.name}/${skill.name}`)}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-white text-base md:text-lg" style={{ fontFamily: 'var(--font-della-respira)' }}>
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 pb-3 md:pb-6">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-400 font-body">Downloads</p>
                  <p className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
                    {skill.downloads?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-400 font-body">Latest Version</p>
                  <p className="text-xs md:text-sm font-mono text-white">{skill.latestVersion?.version || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-white text-base md:text-lg" style={{ fontFamily: 'var(--font-della-respira)' }}>
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 pb-3 md:pb-6">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-400 font-body">Organization</p>
                  <p className="text-xs md:text-sm text-white font-body">@{skill.org?.name}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-400 font-body">Published</p>
                  <p className="text-xs md:text-sm text-white font-body">
                    {skill.createdAt ? formatDistanceToNow(new Date(skill.createdAt), { addSuffix: true }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-400 font-body">Last Updated</p>
                  <p className="text-xs md:text-sm text-white font-body">
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
