'use client'

import { useAllSkills } from '@/lib/hooks/use-skills'
import { SkillCard } from '@/components/skills/skill-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Package } from 'lucide-react'

export default function SkillsPage() {
  const { data: skills, isLoading, error } = useAllSkills()

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
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
        <h1 className="text-4xl font-bold mb-2">Discover Skills</h1>
        <p className="text-muted-foreground text-lg">
          Browse and install public skills from the community
        </p>
      </div>

      {!skills || skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No skills found</h2>
          <p className="text-muted-foreground">
            Be the first to publish a skill to the registry!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  )
}
