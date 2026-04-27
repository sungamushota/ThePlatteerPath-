'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
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
            CaterFlow
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-stone-900">
            Welcome back
          </h1>
          <p className="mt-2 text-stone-500">
            Sign in to manage your catering business
          </p>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white/80 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
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

          <p className="mt-6 text-center text-sm text-stone-400">
            No password needed — we&apos;ll email you a secure login link.
          </p>
        </div>
      </div>
    </div>
  )
}
