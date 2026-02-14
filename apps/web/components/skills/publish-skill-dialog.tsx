'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { usePublishSkill } from '@/lib/hooks/use-skills'
import { useUserOrgs } from '@/lib/hooks/use-orgs'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Package } from 'lucide-react'

const semverRegex = /^\d+\.\d+\.\d+$/

const publishSchema = z.object({
  orgName: z.string().min(1, 'Please select an organization'),
  name: z
    .string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(50, 'Skill name must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Skill name must be lowercase letters, numbers, and hyphens only'),
  version: z
    .string()
    .regex(semverRegex, 'Version must be in semver format (e.g., 1.0.0)'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  content: z.string().min(1, 'Skill content is required'),
})

type PublishFormValues = z.infer<typeof publishSchema>

interface PublishSkillDialogProps {
  children?: React.ReactNode
}

export function PublishSkillDialog({ children }: PublishSkillDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const publishSkill = usePublishSkill()
  const { data: orgs, isLoading: orgsLoading } = useUserOrgs()

  const form = useForm<PublishFormValues>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(publishSchema),
    defaultValues: {
      orgName: '',
      name: '',
      version: '1.0.0',
      description: '',
      content: '',
    },
  })

  const onSubmit = async (data: PublishFormValues) => {
    try {
      await publishSkill.mutateAsync(data)
      toast.success('Skill published successfully!')
      setOpen(false)
      form.reset()
      // Navigate to the published skill
      router.push(`/skill/@${data.orgName}/${data.name}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to publish skill')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Publish Skill
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish Skill</DialogTitle>
          <DialogDescription>
            Share your skill with the community. Fill in the details below to publish.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orgName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={orgsLoading || publishSkill.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orgs?.map((org) => (
                        <SelectItem key={org.id} value={org.name}>
                          @{org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The organization that will own this skill
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-skill"
                      {...field}
                      disabled={publishSkill.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the package name (e.g., @org/my-skill)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1.0.0"
                      {...field}
                      disabled={publishSkill.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Semantic version (e.g., 1.0.0, 2.1.3)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of what your skill does..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={publishSkill.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Content (README)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="# My Skill&#10;&#10;A detailed description in Markdown format..."
                      className="resize-none font-mono text-sm"
                      rows={10}
                      {...field}
                      disabled={publishSkill.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Markdown content that will be displayed on the skill page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={publishSkill.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={publishSkill.isPending}>
                {publishSkill.isPending ? 'Publishing...' : 'Publish Skill'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
