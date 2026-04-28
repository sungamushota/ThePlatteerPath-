'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)
  }

  const slug = generateSlug(businessName)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated')
      setIsLoading(false)
      return
    }

    // Find a unique slug — append number if taken
    let uniqueSlug = slug
    let suffix = 0
    while (true) {
      const { data: existing } = await supabase
        .from('operators')
        .select('id')
        .eq('slug', uniqueSlug)
        .maybeSingle()

      if (!existing) break
      suffix++
      uniqueSlug = `${slug}-${suffix}`
    }

    const { error: insertError } = await supabase.from('operators').insert({
      id: user.id,
      email: user.email!,
      business_name: businessName,
      slug: uniqueSlug,
    })

    if (insertError) {
      console.error('Error creating operator:', insertError)
      setError('Failed to create account. Please try again.')
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-50 via-cream to-gold-100/30" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-gold-200/30 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-100 ring-8 ring-gold-50">
                <Sparkles className="h-10 w-10 text-gold-500" />
              </div>
              <h1 className="mb-3 font-display text-4xl font-semibold text-stone-900">
                Welcome to The PlatterPath
              </h1>
              <p className="mb-10 text-lg text-stone-500">
                Let&apos;s set up your catering business in 60 seconds.
              </p>
              <Button
                size="lg"
                onClick={() => setStep(2)}
                className="min-w-[200px]"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl border border-stone-100 bg-white/80 p-8 shadow-xl shadow-stone-200/20 backdrop-blur-sm">
                <h2 className="mb-2 font-display text-2xl font-semibold text-stone-900">
                  What&apos;s your business called?
                </h2>
                <p className="mb-8 text-stone-500">
                  This will appear on your booking page and quotes.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Business Name"
                    placeholder="Heavenly Kitchen"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    error={error}
                    required
                  />

                  {businessName && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="rounded-xl border border-gold-100 bg-gold-50 p-4"
                    >
                      <p className="mb-1 text-xs font-medium text-gold-600">
                        YOUR BOOKING LINK
                      </p>
                      <p className="font-mono text-sm text-gold-800">
                        theplatterpath.com/book/{slug || '...'}
                      </p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || !businessName.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Continue to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
