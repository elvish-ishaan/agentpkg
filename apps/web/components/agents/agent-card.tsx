import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Lock, Download } from 'lucide-react'
import type { Agent } from '@/types/api'
import { formatDistanceToNow } from 'date-fns'

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const orgName = agent.org?.name || 'unknown'
  const latestVersion = agent.latestVersion?.version || '0.0.0'
  const isPrivate = agent.access === 'PRIVATE'

  return (
    <Link href={`/agent/${orgName}/${agent.name}`}>
      <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/30 transition-all cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12 bg-white/10 border-2 border-white/20">
              <AvatarFallback className="bg-white/5 text-white font-bold text-sm">
                {orgName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg truncate text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
                <span className="truncate">@{orgName}/{agent.name}</span>
                {isPrivate && <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20 font-mono">
                  v{latestVersion}
                </Badge>
                {isPrivate && (
                  <Badge variant="outline" className="text-xs bg-white/5 text-gray-300 border-white/20">
                    Private
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-xs text-gray-400 font-body">
            <div className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span className="font-medium text-white">{(agent.downloads || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Updated {agent.updatedAt ? formatDistanceToNow(new Date(agent.updatedAt), { addSuffix: true }) : 'recently'}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-400 line-clamp-2 font-body">
            {agent.description || 'No description provided'}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
