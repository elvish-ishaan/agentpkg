'use client'

import { useAllSkills } from '@/lib/hooks/use-skills'
import { SkillCard } from '@/components/skills/skill-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function SkillsPage() {
  const { data: skills, isLoading, error } = useAllSkills()

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Skills</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[180px] w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load skills'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Skills</h1>
        <p className="text-muted-foreground mt-2">
          Discover and explore {skills?.length || 0} skill packages
        </p>
      </div>

      {skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No skills found</p>
        </div>
      )}
    </div>
  )
}
