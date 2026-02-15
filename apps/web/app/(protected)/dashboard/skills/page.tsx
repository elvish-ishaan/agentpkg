'use client'

import { useState } from 'react'
import { useOrg } from '@/lib/contexts/org-context'
import { useOrgSkills, useDeleteSkill } from '@/lib/hooks/use-skills'
import { PageTemplate } from '@/components/dashboard/page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CanDelete } from '@/components/permissions/permission-guard'
import { usePermissions } from '@/lib/hooks/use-permissions'
import { PublishSkillDialog } from '@/components/skills/publish-skill-dialog'
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
import { Zap, Lock, Globe, Search, Trash2, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SkillsPage() {
  const { activeOrg } = useOrg()
  const { canCreate } = usePermissions()
  const { data: skills = [], isLoading } = useOrgSkills(activeOrg?.name || '')
  const deleteSkill = useDeleteSkill()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter skills by search term
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteSkill = async (skillName: string) => {
    if (!activeOrg) return

    try {
      await deleteSkill.mutateAsync({ org: activeOrg.name, name: skillName })
      toast.success('Skill deleted successfully')
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('You need owner permissions to delete skills')
      } else {
        toast.error(error.response?.data?.error || 'Failed to delete skill')
      }
    }
  }

  if (!activeOrg) {
    return (
      <PageTemplate
        title="Skills"
        description="Manage your AI skills"
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
            <Zap className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
            No Organization Selected
          </h3>
          <p className="text-gray-400 font-body text-center max-w-md">
            Select or create an organization to manage skills.
          </p>
        </div>
      </PageTemplate>
    )
  }

  return (
    <>
      <PageTemplate
        title="Skills"
        description="Manage your AI skills and capabilities"
        actions={
          canCreate && (
            <PublishSkillDialog>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Zap className="h-4 w-4 mr-2" />
                New Skill
              </Button>
            </PublishSkillDialog>
          )
        }
      >
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search skills..."
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
        {!isLoading && filteredSkills.length === 0 && !searchTerm && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
              No skills yet
            </h3>
            <p className="text-gray-400 font-body text-center max-w-md mb-4">
              Create your first skill to extend your agent capabilities.
            </p>
            {canCreate && (
              <PublishSkillDialog>
                <Button className="bg-white text-black hover:bg-gray-200">
                  <Zap className="h-4 w-4 mr-2" />
                  Create Skill
                </Button>
              </PublishSkillDialog>
            )}
          </div>
        )}

        {/* No Search Results */}
        {!isLoading && filteredSkills.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2" style={{ fontFamily: 'var(--font-della-respira)' }}>
              No skills found
            </h3>
            <p className="text-gray-400 font-body">
              No skills match "{searchTerm}"
            </p>
          </div>
        )}

        {/* Skills Grid */}
        {!isLoading && filteredSkills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <Card
                key={skill.id}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      {skill.access === 'PRIVATE' ? (
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
                    {skill.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-body line-clamp-2 min-h-[2.5rem]">
                    {skill.description || 'No description provided'}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20 text-xs"
                    >
                      v{skill.latestVersion?.version || '0.0.0'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        skill.access === 'PRIVATE'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}
                    >
                      {skill.access || 'Private'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-body">
                    Updated {formatDistanceToNow(new Date(skill.updatedAt), { addSuffix: true })}
                  </p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex gap-2">
                    <Link
                      href={`/skill/${activeOrg.name}/${skill.name}`}
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
                            disabled={deleteSkill.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/95 border-white/10 backdrop-blur-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Skill</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to delete <strong>{skill.name}</strong>? This action cannot be undone and all versions will be permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSkill(skill.name)}
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
