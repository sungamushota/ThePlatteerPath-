'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, CheckCircle, ArrowLeft, Lock } from 'lucide-react'

type Mode = 'magic' | 'password' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<Mode>('password')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setIsSent(true)
    }

    setIsLoading(false)
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/onboarding')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    }

    setIsLoading(false)
  }

  if (isSent) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-50 via-cream to-gold-100/30" />
        <div className="pointer-events-none absolute top-20 right-20 h-[400px] w-[400px] rounded-full bg-gold-200/30 blur-[100px]" />

        <div className="relative w-full max-w-sm text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/50">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-3 font-display text-3xl font-semibold text-stone-900">
            Check your email
          </h1>
          <p className="mb-2 text-stone-500">We sent a login link to</p>
          <p className="mb-8 font-medium text-stone-900">{email}</p>
          <p className="text-sm text-stone-400">
            Click the link in the email to sign in. It expires in 1 hour.
          </p>
          <button
            onClick={() => setIsSent(false)}
            className="mt-8 inline-flex cursor-pointer items-center gap-2 text-sm text-gold-600 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-50 via-cream to-gold-100/30" />
      <div className="pointer-events-none absolute top-20 right-20 h-[400px] w-[400px] rounded-full bg-gold-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-20 left-20 h-[300px] w-[300px] rounded-full bg-gold-100/40 blur-[80px]" />

      <div className="relative w-full max-w-sm">
        {/* Back to home */}
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-stone-400 transition-colors hover:text-stone-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mb-8">
          <span className="font-display text-2xl font-semibold tracking-tight text-stone-900">
            The PlatterPath
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-stone-900">
            {mode === 'signup' ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-stone-500">
            {mode === 'signup'
              ? 'Get started with The PlatterPath'
              : 'Sign in to manage your catering business'}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white/80 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-sm">
          {mode === 'magic' ? (
            <form onSubmit={handleMagicLink} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePassword} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                required
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-xs text-stone-400">or</span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          {/* Toggle method */}
          {mode === 'magic' ? (
            <button
              type="button"
              onClick={() => { setMode('password'); setError('') }}
              className="w-full cursor-pointer rounded-xl border border-stone-200 py-3 text-center text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              <Lock className="mr-2 inline h-4 w-4" />
              Sign in with password
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setMode('magic'); setError('') }}
              className="w-full cursor-pointer rounded-xl border border-stone-200 py-3 text-center text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              <Mail className="mr-2 inline h-4 w-4" />
              Sign in with magic link
            </button>
          )}

          {/* Sign up / Sign in toggle */}
          <p className="mt-5 text-center text-sm text-stone-400">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('password'); setError('') }}
                  className="cursor-pointer text-gold-600 hover:text-gold-700"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError('') }}
                  className="cursor-pointer text-gold-600 hover:text-gold-700"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
