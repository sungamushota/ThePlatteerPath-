'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Lock, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setIsDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (isDone) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-50 via-cream to-gold-100/30" />
        <div className="relative w-full max-w-sm text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/50">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-3 font-display text-3xl font-semibold text-stone-900">
            Password updated
          </h1>
          <p className="text-stone-500">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-50 via-cream to-gold-100/30" />
      <div className="pointer-events-none absolute top-20 right-20 h-[400px] w-[400px] rounded-full bg-gold-200/30 blur-[100px]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8">
          <span className="font-display text-2xl font-semibold tracking-tight text-stone-900">
            The PlatterPath
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-stone-900">
            Set your password
          </h1>
          <p className="mt-2 text-stone-500">
            Choose a password for your account
          </p>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white/80 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Set Password
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
