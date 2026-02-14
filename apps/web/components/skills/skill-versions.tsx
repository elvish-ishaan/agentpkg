'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { SkillVersion } from '@/types/api'

interface SkillVersionsProps {
  versions: SkillVersion[]
  orgName: string
  skillName: string
  latestVersion?: string
}

export function SkillVersions({ versions, orgName, skillName, latestVersion }: SkillVersionsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Version History</h2>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Published By</TableHead>
              <TableHead>Published</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell>
                  <Link
                    href={`/skill/@${orgName}/${skillName}/v/${version.version}`}
                    className="font-mono font-medium hover:underline flex items-center gap-2"
                  >
                    {version.version}
                    {version.version === latestVersion && (
                      <Badge variant="secondary" className="text-xs">
                        Latest
                      </Badge>
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  {version.publishedBy?.username || 'Unknown'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {version.createdAt ? formatDistanceToNow(new Date(version.createdAt), { addSuffix: true }) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
