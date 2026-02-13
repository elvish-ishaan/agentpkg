import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Copy } from 'lucide-react'
import type { Agent } from '@/types/api'
import { toast } from 'sonner'

interface AgentHeaderProps {
  agent: Agent
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  const orgName = agent.org?.name || 'unknown'
  const latestVersion = agent.latestVersion?.version || '0.0.0'
  const installCommand = `npx agentpkg install @${orgName}/${agent.name}`

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(installCommand)
    toast.success('Install command copied to clipboard')
  }

  return (
    <div className="border-b bg-muted/30">
      <div className="container px-4 py-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-2xl">
              {orgName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                @{orgName}/{agent.name}
              </h1>
              <Badge variant="secondary">v{latestVersion}</Badge>
            </div>

            <p className="text-lg text-muted-foreground mb-4">
              {agent.description}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-md font-mono text-sm">
                <code>{installCommand}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyInstallCommand}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <Link href={`/orgs/${orgName}`}>
                <Button variant="outline" size="sm">
                  View Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
