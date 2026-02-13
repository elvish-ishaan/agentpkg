'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth/auth-context'
import { authApi } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/api/query-keys'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Plus, Copy, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const tokenSchema = z.object({
  name: z.string().min(1, 'Token name is required'),
})

type TokenFormValues = z.infer<typeof tokenSchema>

export default function TokensPage() {
  const router = useRouter()
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [newToken, setNewToken] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Client-side protection: redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?from=/settings/tokens')
    }
  }, [authLoading, isAuthenticated, router])

  const { data: tokens, isLoading } = useQuery({
    queryKey: queryKeys.auth.tokens(),
    queryFn: authApi.listTokens,
    enabled: isAuthenticated, // Only fetch tokens if authenticated
  })

  // Show loading while checking authentication
  if (authLoading || !isAuthenticated) {
    return (
      <div className="container px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  const createToken = useMutation({
    mutationFn: authApi.createToken,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.tokens() })
      setNewToken(data.token || null)
      toast.success('API token created successfully!')
      form.reset()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create token')
    },
  })

  const revokeToken = useMutation({
    mutationFn: authApi.revokeToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.tokens() })
      toast.success('API token revoked')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke token')
    },
  })

  const form = useForm<TokenFormValues>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: TokenFormValues) => {
    await createToken.mutateAsync(data)
  }

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast.success('Token copied to clipboard')
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setNewToken(null)
    form.reset()
  }

  return (
    <div className="container px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Tokens</h1>
        <p className="text-muted-foreground mt-2">
          Manage your API tokens for programmatic access
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your API Tokens</CardTitle>
              <CardDescription>
                Use these tokens to authenticate with the AgentPkg CLI
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Token
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create API Token</DialogTitle>
                  <DialogDescription>
                    Create a new API token for programmatic access
                  </DialogDescription>
                </DialogHeader>

                {newToken ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Your new token:</p>
                      <div className="flex gap-2">
                        <Input value={newToken} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToken(newToken)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Make sure to copy your token now. You won't be able to see it again!
                      </p>
                    </div>
                    <Button onClick={handleCloseDialog} className="w-full">
                      Done
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="My CLI Token"
                                {...field}
                                disabled={createToken.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseDialog}
                          disabled={createToken.isPending}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createToken.isPending}>
                          {createToken.isPending ? 'Creating...' : 'Create Token'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : tokens && tokens.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(token.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {token.lastUsedAt
                          ? formatDistanceToNow(new Date(token.lastUsedAt), { addSuffix: true })
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeToken.mutate(token.id)}
                          disabled={revokeToken.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No API tokens yet. Create one to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
