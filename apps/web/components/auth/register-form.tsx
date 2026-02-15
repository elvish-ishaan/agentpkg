'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Username must be lowercase letters, numbers, and hyphens only'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      await register(data)
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Dark Dot Matrix Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
              radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
            imageRendering: 'pixelated',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Header */}
          <div className="space-y-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white">Join the AI Revolution</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-della-respira)' }}
            >
              Create an Account
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg font-body text-gray-400 font-light"
            >
              Get started with AgentPkg and publish your first agent
            </motion.p>
          </div>

          {/* Form */}
          <Form {...form}>
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-body">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        disabled={isLoading}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:ring-white/20"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-body">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="my-username"
                        {...field}
                        disabled={isLoading}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:ring-white/20"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 font-body text-sm">
                      This will be your default organization name
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-body">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:ring-white/20"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 font-body font-normal"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </motion.form>
          </Form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-sm font-body"
          >
            <span className="text-gray-400">Already have an account?</span>{' '}
            <Link
              href="/login"
              className="font-medium text-white hover:text-gray-300 underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/diqurtmad/image/upload/v1771148050/Gemini_Generated_Image_x1cwimx1cwimx1cw_clgolc.png)',
          }}
        >
          {/* Subtle Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/5 to-black/20" />
        </div>
      </div>
    </div>
  )
}
