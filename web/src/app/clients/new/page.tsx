'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Settings } from 'lucide-react'

export default function NewClientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

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

    const { error: insertError } = await supabase.from('clients').insert({
      operator_id: user.id,
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      notes: form.notes || null,
    })

    if (insertError) {
      console.error('Error creating client:', insertError)
      setError('Failed to create client. Please try again.')
      setIsLoading(false)
      return
    }

    router.push('/clients')
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
                CaterFlow
              </span>
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/inquiries">
                <Button variant="ghost" size="sm">Inquiries</Button>
              </Link>
              <Link href="/clients">
                <Button variant="ghost" size="sm" className="bg-gold-50 text-gold-700">Clients</Button>
              </Link>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-8">
        <Link
          href="/clients"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Clients
        </Link>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-2 font-display text-2xl font-semibold text-stone-900">
            Add a Client
          </h1>
          <p className="mb-6 text-sm text-stone-600">
            Manually add a client to your database.
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Marcus Johnson"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="555-123-4567"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: formatPhoneNumber(e.target.value) })
              }
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="marcus@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Textarea
              label="Notes (optional)"
              placeholder="Repeat customer, prefers jerk chicken, always orders for 30+..."
              maxLength={500}
              showCount
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <Button
              type="submit"
              disabled={isLoading || !form.name.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Client'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
