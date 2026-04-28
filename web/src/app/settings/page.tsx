'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Loader2,
  Save,
  LogOut,
  Settings,
} from 'lucide-react'

interface OperatorSettings {
  id: string
  business_name: string
  slug: string
  email: string
  phone: string | null
  address: string | null
  logo_url: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    business_name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('operators')
        .select('id, business_name, slug, email, phone, address, logo_url')
        .eq('id', user.id)
        .single()

      if (data) {
        const op = data as OperatorSettings
        setForm({
          business_name: op.business_name,
          phone: op.phone || '',
          address: op.address || '',
        })
      }
      setIsLoading(false)
    }
    loadSettings()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated')
      setIsSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('operators')
      .update({
        business_name: form.business_name,
        phone: form.phone || null,
        address: form.address || null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error saving settings:', updateError)
      setError('Failed to save. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setIsSaving(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
                The PlatterPath
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
                <Button variant="ghost" size="sm">Clients</Button>
              </Link>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="bg-gold-50 text-gold-700">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        <h1 className="mb-8 font-display text-2xl font-semibold text-stone-900">
          Settings
        </h1>

        {/* Business Info */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 font-display text-lg font-semibold text-stone-900">
            Business Information
          </h2>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {saved && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Settings saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <Input
              label="Business Name"
              value={form.business_name}
              onChange={(e) =>
                setForm({ ...form, business_name: e.target.value })
              }
              required
            />

            <Input
              label="Business Phone"
              type="tel"
              placeholder="555-123-4567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <Input
              label="Business Address"
              placeholder="123 Main St, Houston, TX"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <Button
              type="submit"
              disabled={isSaving || !form.business_name.trim()}
              className="w-full"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold text-stone-900">
            Account
          </h2>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  )
}
