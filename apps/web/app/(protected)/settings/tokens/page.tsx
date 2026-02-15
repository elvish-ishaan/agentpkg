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
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
          API Tokens
        </h1>
        <p className="text-gray-400 mt-2 font-body">
          Manage your API tokens for programmatic access
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
                Your API Tokens
              </CardTitle>
              <CardDescription className="text-gray-400 font-body">
                Use these tokens to authenticate with the AgentPkg CLI
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-gray-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Token
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/95 border-white/10 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-white" style={{ fontFamily: 'var(--font-della-respira)' }}>
                    Create API Token
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 font-body">
                    Create a new API token for programmatic access
                  </DialogDescription>
                </DialogHeader>

                {newToken ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2 text-white font-body">Your new token:</p>
                      <div className="flex gap-2">
                        <Input value={newToken} readOnly className="font-mono text-sm bg-white/5 border-white/10 text-white" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToken(newToken)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400 mt-2 font-body">
                        Make sure to copy your token now. You won't be able to see it again!
                      </p>
                    </div>
                    <Button onClick={handleCloseDialog} className="w-full bg-white text-black hover:bg-gray-200">
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
                            <FormLabel className="text-white font-body">Token Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="My CLI Token"
                                {...field}
                                disabled={createToken.isPending}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
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
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createToken.isPending} className="bg-white text-black hover:bg-gray-200">
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
            <div className="border border-white/10 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-400 font-body">Name</TableHead>
                    <TableHead className="text-gray-400 font-body">Created</TableHead>
                    <TableHead className="text-gray-400 font-body">Last Used</TableHead>
                    <TableHead className="w-[100px] text-gray-400 font-body">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white font-body">{token.name}</TableCell>
                      <TableCell className="text-gray-400 font-body">
                        {formatDistanceToNow(new Date(token.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-gray-400 font-body">
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
            <div className="text-center py-8 text-gray-400 font-body">
              No API tokens yet. Create one to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
