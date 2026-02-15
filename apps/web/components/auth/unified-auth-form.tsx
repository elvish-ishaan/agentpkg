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
import { Sparkles, LogIn, UserPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Username must be lowercase letters, numbers, and hyphens only'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

type AuthMode = 'login' | 'register'

interface UnifiedAuthFormProps {
  defaultMode?: AuthMode
}

export function UnifiedAuthForm({ defaultMode = 'login' }: UnifiedAuthFormProps) {
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<AuthMode>(defaultMode)

  const loginForm = useForm<LoginFormValues>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const registerForm = useForm<RegisterFormValues>({
    // @ts-expect-error - Zod version compatibility issue
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      await login(data)
      toast.success('Successfully logged in!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  const onRegisterSubmit = async (data: RegisterFormValues) => {
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

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    loginForm.reset()
    registerForm.reset()
  }

  const isLogin = mode === 'login'

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
              <span className="text-white">
                {isLogin ? 'Welcome Back' : 'Join the AI Revolution'}
              </span>
            </motion.div>

            {/* Mode Toggle Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all font-body ${
                  isLogin
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all font-body ${
                  !isLogin
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className="text-4xl md:text-5xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-della-respira)' }}
                >
                  {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h1>

                <p className="text-lg font-body text-gray-400 font-light mt-2">
                  {isLogin
                    ? 'Enter your credentials to access your account'
                    : 'Get started with AgentPkg and publish your first agent'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
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
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
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
                      control={registerForm.control}
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
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
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
