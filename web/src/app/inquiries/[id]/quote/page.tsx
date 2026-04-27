'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Send,
  Settings,
} from 'lucide-react'

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
}

interface InquiryInfo {
  id: string
  guest_count: number
  event_type: string
  event_date: string
  client_name: string
  client_id: string
}

export default function QuoteBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const inquiryId = params.id as string

  const [inquiry, setInquiry] = useState<InquiryInfo | null>(null)
  const [lines, setLines] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 },
  ])
  const [depositPercent, setDepositPercent] = useState(30)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadInquiry() {
      const supabase = createClient()
      const { data } = await supabase
        .from('inquiries')
        .select(
          `
          id,
          guest_count,
          event_type,
          event_date,
          clients (
            id,
            name
          )
        `
        )
        .eq('id', inquiryId)
        .single()

      if (data) {
        const client = Array.isArray(data.clients)
          ? data.clients[0]
          : data.clients
        setInquiry({
          id: data.id,
          guest_count: data.guest_count,
          event_type: data.event_type,
          event_date: data.event_date,
          client_name: client?.name || 'Unknown',
          client_id: client?.id || '',
        })
      }
      setIsLoading(false)
    }
    loadInquiry()
  }, [inquiryId])

  const addLine = () => {
    setLines([
      ...lines,
      { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 },
    ])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter((l) => l.id !== id))
    }
  }

  const updateLine = (id: string, field: keyof LineItem, value: string | number) => {
    setLines(
      lines.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  const subtotal = lines.reduce(
    (sum, l) => sum + l.quantity * l.unit_price,
    0
  )
  const depositAmount = (subtotal * depositPercent) / 100

  const handleSave = async () => {
    // Validate
    const validLines = lines.filter((l) => l.description.trim() && l.unit_price > 0)
    if (validLines.length === 0) {
      setError('Add at least one line item with a description and price.')
      return
    }

    setIsSaving(true)
    setError('')

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !inquiry) {
      setError('Not authenticated')
      setIsSaving(false)
      return
    }

    // Create quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        operator_id: user.id,
        inquiry_id: inquiry.id,
        client_id: inquiry.client_id,
        status: 'draft',
        subtotal,
        total: subtotal,
        deposit_percent: depositPercent,
        deposit_amount: depositAmount,
        notes: notes || null,
      })
      .select('id')
      .single()

    if (quoteError || !quote) {
      console.error('Error creating quote:', quoteError)
      setError('Failed to create quote. Please try again.')
      setIsSaving(false)
      return
    }

    // Create line items
    const lineItems = validLines.map((l, i) => ({
      quote_id: quote.id,
      description: l.description,
      quantity: l.quantity,
      unit_price: l.unit_price,
      line_total: l.quantity * l.unit_price,
      sort_order: i,
    }))

    const { error: linesError } = await supabase
      .from('quote_lines')
      .insert(lineItems)

    if (linesError) {
      console.error('Error creating line items:', linesError)
      setError('Quote created but failed to save line items.')
      setIsSaving(false)
      return
    }

    // Update inquiry status to quoted
    await supabase
      .from('inquiries')
      .update({ status: 'quoted' })
      .eq('id', inquiry.id)

    // Send quote email to client
    try {
      await fetch('/api/quotes/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id }),
      })
    } catch {
      // Non-critical — quote still saved even if email fails
    }

    router.push(`/inquiries/${inquiry.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-stone-600">Inquiry not found</p>
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
                CaterFlow
              </span>
            </Link>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Back */}
        <Link
          href={`/inquiries/${inquiry.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Inquiry
        </Link>

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Build Quote
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            {inquiry.client_name} · {inquiry.guest_count} guests ·{' '}
            {new Date(inquiry.event_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Line Items */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-stone-100 px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-stone-900">
              Line Items
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Header row */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_80px_100px_32px] sm:gap-3 text-xs font-medium text-stone-500">
              <span>Description</span>
              <span>Qty</span>
              <span>Price</span>
              <span></span>
            </div>

            {/* Line items */}
            {lines.map((line) => (
              <div
                key={line.id}
                className="grid gap-3 sm:grid-cols-[1fr_80px_100px_32px] items-start"
              >
                <Input
                  placeholder="Jerk chicken tray (serves 10)"
                  value={line.description}
                  onChange={(e) =>
                    updateLine(line.id, 'description', e.target.value)
                  }
                />
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) =>
                    updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)
                  }
                />
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={line.unit_price || ''}
                    onChange={(e) =>
                      updateLine(
                        line.id,
                        'unit_price',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="flex h-12 w-full rounded-xl border border-stone-200 bg-white pl-7 pr-4 py-2 text-base text-stone-900 placeholder:text-stone-400 transition-all duration-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/10"
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="mt-3 flex h-6 w-6 items-center justify-center rounded text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                  disabled={lines.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Line Item
            </button>
          </div>

          {/* Totals */}
          <div className="border-t border-stone-100 bg-stone-50/50 px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-semibold text-stone-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-stone-600">Deposit</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={depositPercent}
                  onChange={(e) =>
                    setDepositPercent(parseInt(e.target.value) || 0)
                  }
                  className="h-7 w-14 rounded-lg border border-stone-200 px-2 text-center text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/10"
                />
                <span className="text-stone-500">%</span>
              </div>
              <span className="font-semibold text-gold-700">
                ${depositAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <Textarea
            label="Quote Notes (optional)"
            placeholder="Any terms, delivery details, or notes for the client..."
            maxLength={1000}
            showCount
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link href={`/inquiries/${inquiry.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Save Quote
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
