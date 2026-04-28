import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Check, Calendar, Users, MapPin } from 'lucide-react'
import { QuoteActions } from '@/components/quotes/quote-actions'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment?: string }>
}

interface QuoteDetail {
  id: string
  status: string
  subtotal: number
  total: number
  deposit_percent: number
  deposit_amount: number
  notes: string | null
  created_at: string
  operators: {
    business_name: string
    slug: string
    logo_url: string | null
  } | null
  clients: {
    name: string
  } | null
  inquiries: {
    event_date: string
    event_time: string | null
    guest_count: number
    event_type: string
    service_type: string
    location_address: string
  } | null
  quote_lines: {
    id: string
    description: string
    quantity: number
    unit_price: number
    line_total: number
    sort_order: number
  }[]
}

export default async function QuoteClientViewPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { payment } = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quotes')
    .select(
      `
      id,
      status,
      subtotal,
      total,
      deposit_percent,
      deposit_amount,
      notes,
      created_at,
      operators (
        business_name,
        slug,
        logo_url
      ),
      clients (
        name
      ),
      inquiries (
        event_date,
        event_time,
        guest_count,
        event_type,
        service_type,
        location_address
      ),
      quote_lines (
        id,
        description,
        quantity,
        unit_price,
        line_total,
        sort_order
      )
    `
    )
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const quote = data as unknown as QuoteDetail
  const operator = quote.operators
  const client = quote.clients
  const inquiry = quote.inquiries
  const lines = (quote.quote_lines || []).sort((a, b) => a.sort_order - b.sort_order)

  const formatEventType = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const formatServiceType = (type: string) => {
    const map: Record<string, string> = {
      drop_off: 'Drop-off Only',
      drop_off_setup: 'Drop-off + Setup',
      full_service: 'Full Service with Staff',
    }
    return map[type] || formatEventType(type)
  }

  const isAccepted = quote.status === 'accepted'
  const paymentSuccess = payment === 'success'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-50/50 via-cream to-cream">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* Payment success banner */}
        {paymentSuccess && !isAccepted && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4">
            <Check className="h-5 w-5 text-gold-600" />
            <div>
              <p className="font-medium text-gold-800">Payment received!</p>
              <p className="text-sm text-gold-700">
                Your deposit is being processed. This page will update shortly.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          {operator?.logo_url ? (
            <img
              src={operator.logo_url}
              alt={operator.business_name}
              className="mx-auto mb-4 h-16 w-16 rounded-2xl object-cover shadow-lg ring-4 ring-white"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 font-display text-2xl font-bold text-white shadow-lg ring-4 ring-white">
              {operator?.business_name?.charAt(0) || 'C'}
            </div>
          )}
          <h1 className="font-display text-xl font-semibold text-stone-900">
            {operator?.business_name}
          </h1>
          <p className="mt-1 text-sm text-stone-500">Catering Quote</p>
        </div>

        {/* Accepted banner */}
        {isAccepted && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <Check className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-800">Quote Accepted</p>
              <p className="text-sm text-emerald-700">
                Thank you! The caterer will be in touch with next steps.
              </p>
            </div>
          </div>
        )}

        {/* Quote card */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-lg overflow-hidden">
          {/* Client & Event Info */}
          <div className="border-b border-stone-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Prepared for</p>
                <p className="font-display text-lg font-semibold text-stone-900">
                  {client?.name || 'Client'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-stone-500">Date</p>
                <p className="font-medium text-stone-900">
                  {new Date(quote.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {inquiry && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Calendar className="h-3.5 w-3.5 text-gold-500" />
                  {new Date(inquiry.event_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Users className="h-3.5 w-3.5 text-gold-500" />
                  {inquiry.guest_count} guests
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600 col-span-2 sm:col-span-1">
                  <MapPin className="h-3.5 w-3.5 text-gold-500" />
                  <span className="truncate">{inquiry.location_address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="px-6 py-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs font-medium text-stone-500">
                  <th className="pb-3">Item</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {lines.map((line) => (
                  <tr key={line.id}>
                    <td className="py-3 text-sm text-stone-900">
                      {line.description}
                    </td>
                    <td className="py-3 text-center text-sm text-stone-600">
                      {line.quantity}
                    </td>
                    <td className="py-3 text-right text-sm text-stone-600">
                      ${line.unit_price.toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-stone-900">
                      ${line.line_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-stone-200 bg-stone-50/50 px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-medium text-stone-900">
                ${quote.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
              <div>
                <span className="font-display text-lg font-semibold text-stone-900">
                  Deposit Due ({quote.deposit_percent}%)
                </span>
                <p className="text-xs text-stone-500">
                  Remaining balance due before event
                </p>
              </div>
              <span className="font-display text-2xl font-bold text-gold-600">
                ${quote.deposit_amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="border-t border-stone-100 px-6 py-4">
              <p className="text-xs font-medium text-stone-500 mb-1">Notes</p>
              <p className="text-sm text-stone-700 whitespace-pre-wrap">
                {quote.notes}
              </p>
            </div>
          )}

          {/* Accept action */}
          {!isAccepted && quote.status !== 'declined' && (
            <div className="border-t border-stone-200 px-6 py-5">
              <QuoteActions quoteId={quote.id} depositAmount={quote.deposit_amount} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-stone-400">
            Powered by{' '}
            <span className="font-display font-semibold text-stone-500">
              The PlatterPath
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('quotes')
    .select('operators (business_name)')
    .eq('id', id)
    .single()

  const operator = (data as unknown as { operators: { business_name: string } | null })?.operators

  return {
    title: operator
      ? `Quote from ${operator.business_name}`
      : 'Catering Quote',
    description: 'Review and accept your catering quote',
  }
}
