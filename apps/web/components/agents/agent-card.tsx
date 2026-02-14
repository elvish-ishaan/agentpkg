import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Lock } from 'lucide-react'
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
      <Card className="h-full hover:border-primary transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {orgName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2 text-lg truncate">
                  <span className="truncate">@{orgName}/{agent.name}</span>
                  {isPrivate && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    v{latestVersion}
                  </Badge>
                  {isPrivate && (
                    <Badge variant="outline" className="text-xs">
                      Private
                    </Badge>
                  )}
                  <span className="text-xs">
                    Updated {agent.updatedAt ? formatDistanceToNow(new Date(agent.updatedAt), { addSuffix: true }) : 'recently'}
                  </span>
                </CardDescription>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium text-muted-foreground">Downloads</div>
              <div className="text-2xl font-bold">{(agent.downloads || 0).toLocaleString()}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.description || 'No description provided'}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
