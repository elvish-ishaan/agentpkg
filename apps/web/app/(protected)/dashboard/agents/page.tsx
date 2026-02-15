'use client'

import { useState } from 'react'
import { useOrg } from '@/lib/contexts/org-context'
import { useOrgAgents, useDeleteAgent } from '@/lib/hooks/use-agents'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CanDelete } from '@/components/permissions/permission-guard'
import { usePermissions } from '@/lib/hooks/use-permissions'
import { PublishAgentDialog } from '@/components/agents/publish-agent-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Package, Lock, Globe, Search, Trash2, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AgentsPage() {
  const { activeOrg } = useOrg()
  const { canCreate } = usePermissions()
  const { data: agents = [], isLoading } = useOrgAgents(activeOrg?.name || '')
  const deleteAgent = useDeleteAgent()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter agents by search term
  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteAgent = async (agentName: string) => {
    if (!activeOrg) return

    try {
      await deleteAgent.mutateAsync({ org: activeOrg.name, name: agentName })
      toast.success('Agent deleted successfully')
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('You need owner permissions to delete agents')
      } else {
        toast.error(error.response?.data?.error || 'Failed to delete agent')
      }
    }
  }

  if (!activeOrg) {
    return (
      <PageTemplate
        title="Agents"
        description="Manage your AI agents"
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
            No Organization Selected
          </h3>
          <p className="text-gray-400 font-body text-center max-w-md">
            Select or create an organization to manage agents.
          </p>
        </div>
      </PageTemplate>
    )
  }

  return (
    <>
      <PageTemplate
        title="Agents"
        description="Manage your AI agents and packages"
        actions={
          canCreate && (
            <PublishAgentDialog>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Package className="h-4 w-4 mr-2" />
                New Agent
              </Button>
            </PublishAgentDialog>
          )
        }
      >
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/20"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-white/10 animate-pulse mb-4" />
                  <div className="h-6 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAgents.length === 0 && !searchTerm && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
              No agents yet
            </h3>
            <p className="text-gray-400 font-body text-center max-w-md mb-4">
              Create your first agent to get started with AgentPkg.
            </p>
            {canCreate && (
              <PublishAgentDialog>
                <Button className="bg-white text-black hover:bg-gray-200">
                  <Package className="h-4 w-4 mr-2" />
                  Create Agent
                </Button>
              </PublishAgentDialog>
            )}
          </div>
        )}

        {/* No Search Results */}
        {!isLoading && filteredAgents.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
              No agents found
            </h3>
            <p className="text-gray-400 font-body">
              No agents match "{searchTerm}"
            </p>
          </div>
        )}

        {/* Agents Grid */}
        {!isLoading && filteredAgents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      {agent.access === 'PRIVATE' ? (
                        <Lock className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Globe className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <CardTitle
                    className="text-white text-xl mb-2"
                    style={{ fontFamily: 'var(--font-della-respira)' }}
                  >
                    {agent.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-body line-clamp-2 min-h-[2.5rem]">
                    {agent.description || 'No description provided'}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20 text-xs"
                    >
                      v{agent.latestVersion?.version || '0.0.0'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        agent.access === 'PRIVATE'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}
                    >
                      {agent.access || 'Private'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-body">
                    Updated {formatDistanceToNow(new Date(agent.updatedAt), { addSuffix: true })}
                  </p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex gap-2">
                    <Link
                      href={`/agent/${activeOrg.name}/${agent.name}`}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <CanDelete>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-shrink-0"
                            disabled={deleteAgent.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/95 border-white/10 backdrop-blur-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Agent</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to delete <strong>{agent.name}</strong>? This action cannot be undone and all versions will be permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAgent(agent.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CanDelete>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageTemplate>
    </>
  )
}
