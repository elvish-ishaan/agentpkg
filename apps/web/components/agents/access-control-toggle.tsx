'use client'

import { useState } from 'react'
import { Lock, Globe } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateAgentAccess } from '@/lib/api/endpoints/agents'
import type { Agent } from '@/types/api'

interface AccessControlToggleProps {
  agent: Agent
  orgName: string
  isOwner: boolean
  onAccessChange?: (newAccess: 'PRIVATE' | 'PUBLIC') => void
}

export function AccessControlToggle({
  agent,
  orgName,
  isOwner,
  onAccessChange,
}: AccessControlToggleProps) {
  const [isPublic, setIsPublic] = useState(agent.access === 'PUBLIC')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async (checked: boolean) => {
    if (!isOwner) {
      toast.error('Only organization owners can change access levels')
      return
    }

    setIsUpdating(true)
    const newAccess = checked ? 'PUBLIC' : 'PRIVATE'

    try {
      await updateAgentAccess(orgName, agent.name, newAccess)
      setIsPublic(checked)
      onAccessChange?.(newAccess)
      toast.success(
        `Agent is now ${checked ? 'public' : 'private'}`,
        {
          description: checked
            ? 'Anyone can view and install this agent'
            : 'Only organization members can view and install this agent',
        }
      )
    } catch (error) {
      toast.error('Failed to update access level', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPublic ? (
            <Globe className="h-5 w-5" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
          Access Control
        </CardTitle>
        <CardDescription>
          Control who can view and install this agent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label
            htmlFor="access-toggle"
            className="flex flex-col space-y-1 cursor-pointer"
          >
            <span className="font-medium">
              {isPublic ? 'Public' : 'Private'}
            </span>
            <span className="text-sm text-muted-foreground font-normal">
              {isPublic
                ? 'Anyone can view and install'
                : 'Only organization members can view and install'}
            </span>
          </Label>
          <Switch
            id="access-toggle"
            checked={isPublic}
            onCheckedChange={handleToggle}
            disabled={!isOwner || isUpdating}
          />
        </div>

        {!isOwner && (
          <p className="text-sm text-muted-foreground">
            Only organization owners can change access levels
          </p>
        )}
      </CardContent>
    </Card>
  )
}
