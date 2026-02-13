'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateOrg } from '@/lib/hooks/use-orgs'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

const orgSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name must be less than 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Organization name must be lowercase letters, numbers, and hyphens only'
    ),
})

type OrgFormValues = z.infer<typeof orgSchema>

interface CreateOrgDialogProps {
  children?: React.ReactNode
}

export function CreateOrgDialog({ children }: CreateOrgDialogProps) {
  const [open, setOpen] = useState(false)
  const createOrg = useCreateOrg()

  const form = useForm<OrgFormValues>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: OrgFormValues) => {
    try {
      await createOrg.mutateAsync(data)
      toast.success('Organization created successfully!')
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create organization')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Organizations allow you to collaborate with others and publish agents under a shared namespace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-org"
                      {...field}
                      disabled={createOrg.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used in package names like @my-org/agent-name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createOrg.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createOrg.isPending}>
                {createOrg.isPending ? 'Creating...' : 'Create Organization'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
