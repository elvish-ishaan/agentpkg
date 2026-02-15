import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Skill } from '@/types/api'

interface SkillHeaderProps {
  skill: Skill
}

export function SkillHeader({ skill }: SkillHeaderProps) {
  const orgName = skill.org?.name || 'unknown'
  const latestVersion = skill.latestVersion?.version || '0.0.0'

  return (
    <div className="border-b border-white/10 bg-white/5">
      <div className="container px-4 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarFallback className="text-xl sm:text-2xl bg-white/10 text-white border border-white/20">
              {orgName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
                @{orgName}/{skill.name}
              </h1>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 w-fit">
                v{latestVersion}
              </Badge>
            </div>

            <p className="text-base sm:text-lg text-gray-400 font-body">
              {skill.description || 'No description provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
