'use client'

import { formatDistanceToNow } from 'date-fns'
import { useRemoveMember } from '@/lib/hooks/use-orgs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { OrgMember } from '@/types/api'

interface OrgMembersProps {
  members: OrgMember[]
  orgName: string
  isOwner: boolean
  currentUserId?: string
}

export function OrgMembers({ members, orgName, isOwner, currentUserId }: OrgMembersProps) {
  const removeMember = useRemoveMember()

  const handleRemoveMember = async (userId: string, username: string) => {
    try {
      await removeMember.mutateAsync({ orgName, userId })
      toast.success(`Removed ${username} from organization`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove member')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>Members</h2>

      <div className="border border-white/10 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-400">Username</TableHead>
              <TableHead className="text-gray-400">Role</TableHead>
              <TableHead className="text-gray-400">Joined</TableHead>
              {isOwner && <TableHead className="text-gray-400 w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="border-white/10">
                <TableCell className="font-medium text-white">
                  {member.user?.username || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge variant={member.role.toUpperCase() === 'OWNER' ? 'default' : 'secondary'}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">
                  {member.createdAt
                    ? formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })
                    : 'Unknown'}
                </TableCell>
                {isOwner && (
                  <TableCell>
                    {member.role !== 'OWNER' && member.userId !== currentUserId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={removeMember.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {member.user?.username} from this
                              organization? They will lose access to all organization resources.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleRemoveMember(member.userId, member.user?.username || 'user')
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
