import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Phone,
  Mail,
  UtensilsCrossed,
  DollarSign,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { InquiryActions } from '@/components/inquiries/inquiry-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

interface InquiryDetail {
  id: string
  event_date: string
  event_time: string | null
  guest_count: number
  event_type: string
  service_type: string
  location_address: string
  dietary_restrictions: string[] | null
  budget_range: string | null
  referral_source: string | null
  additional_notes: string | null
  status: string
  created_at: string
  clients: {
    id: string
    name: string
    email: string
    phone: string
  }[] | {
    id: string
    name: string
    email: string
    phone: string
  } | null
}

export default async function InquiryDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('inquiries')
    .select(
      `
      id,
      event_date,
      event_time,
      guest_count,
      event_type,
      service_type,
      location_address,
      dietary_restrictions,
      budget_range,
      referral_source,
      additional_notes,
      status,
      created_at,
      clients (
        id,
        name,
        email,
        phone
      )
    `
    )
    .eq('id', id)
    .eq('operator_id', user.id)
    .single()

  if (error || !data) {
    notFound()
  }

  const inquiry = data as InquiryDetail
  const client = Array.isArray(inquiry.clients)
    ? inquiry.clients[0]
    : inquiry.clients

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

  const formatBudget = (budget: string) => {
    const map: Record<string, string> = {
      under_300: 'Under $300',
      '300_600': '$300 - $600',
      '600_1000': '$600 - $1,000',
      '1000_2000': '$1,000 - $2,000',
      over_2000: 'Over $2,000',
    }
    return map[budget] || budget
  }

  const formatDietary = (restrictions: string[]) =>
    restrictions.map((r) => r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-gold-50 text-gold-700 ring-1 ring-gold-200'
      case 'quoted':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
      case 'booked':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
      case 'declined':
        return 'bg-red-50 text-red-700 ring-1 ring-red-200'
      default:
        return 'bg-stone-50 text-stone-600 ring-1 ring-stone-200'
    }
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
                <Button variant="ghost" size="sm" className="bg-gold-50 text-gold-700">Inquiries</Button>
              </Link>
              <Link href="/clients">
                <Button variant="ghost" size="sm">Clients</Button>
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

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Back link */}
        <Link
          href="/inquiries"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Inquiries
        </Link>

        {/* Header section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold text-stone-900">
                {client?.name || 'Unknown Client'}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(inquiry.status)}`}
              >
                {inquiry.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Received{' '}
              {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <InquiryActions inquiryId={inquiry.id} currentStatus={inquiry.status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content - left 2 cols */}
          <div className="space-y-6 lg:col-span-2">
            {/* Event Details */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-stone-900">
                Event Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-gold-500" />
                  <div>
                    <p className="text-xs font-medium text-stone-500">Date</p>
                    <p className="text-stone-900">
                      {new Date(inquiry.event_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {inquiry.event_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-gold-500" />
                    <div>
                      <p className="text-xs font-medium text-stone-500">Time</p>
                      <p className="text-stone-900">{inquiry.event_time}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-gold-500" />
                  <div>
                    <p className="text-xs font-medium text-stone-500">Guests</p>
                    <p className="text-stone-900">{inquiry.guest_count} people</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-gold-500" />
                  <div>
                    <p className="text-xs font-medium text-stone-500">Location</p>
                    <p className="text-stone-900">{inquiry.location_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-stone-900">
                Service Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <UtensilsCrossed className="mt-0.5 h-4 w-4 text-gold-500" />
                  <div>
                    <p className="text-xs font-medium text-stone-500">Event Type</p>
                    <p className="text-stone-900">{formatEventType(inquiry.event_type)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UtensilsCrossed className="mt-0.5 h-4 w-4 text-gold-500" />
                  <div>
                    <p className="text-xs font-medium text-stone-500">Service Style</p>
                    <p className="text-stone-900">{formatServiceType(inquiry.service_type)}</p>
                  </div>
                </div>

                {inquiry.budget_range && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="mt-0.5 h-4 w-4 text-gold-500" />
                    <div>
                      <p className="text-xs font-medium text-stone-500">Budget Range</p>
                      <p className="text-stone-900">{formatBudget(inquiry.budget_range)}</p>
                    </div>
                  </div>
                )}

                {inquiry.dietary_restrictions && inquiry.dietary_restrictions.length > 0 && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <UtensilsCrossed className="mt-0.5 h-4 w-4 text-gold-500" />
                    <div>
                      <p className="text-xs font-medium text-stone-500">Dietary Restrictions</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {formatDietary(inquiry.dietary_restrictions).map((d) => (
                          <span
                            key={d}
                            className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            {inquiry.additional_notes && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 font-display text-lg font-semibold text-stone-900">
                  <MessageSquare className="mr-2 inline h-4 w-4 text-gold-500" />
                  Additional Notes
                </h2>
                <p className="whitespace-pre-wrap text-stone-700 leading-relaxed">
                  {inquiry.additional_notes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - right col */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-stone-900">
                Client
              </h2>
              {client ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 font-display font-semibold text-gold-700">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{client.name}</p>
                      <Link
                        href={`/clients/${client.id}`}
                        className="text-xs text-gold-600 hover:underline"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <a
                      href={`tel:${client.phone}`}
                      className="flex items-center gap-2 text-sm text-stone-700 hover:text-gold-600 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-stone-400" />
                      {client.phone}
                    </a>
                    <a
                      href={`mailto:${client.email}`}
                      className="flex items-center gap-2 text-sm text-stone-700 hover:text-gold-600 transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 text-stone-400" />
                      {client.email}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-500">No client info available</p>
              )}
            </div>

            {/* Referral Source */}
            {inquiry.referral_source && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 font-display text-lg font-semibold text-stone-900">
                  How They Found You
                </h2>
                <p className="text-stone-700 capitalize">
                  {inquiry.referral_source.replace(/_/g, ' ')}
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-2xl border border-gold-200 bg-gold-50/50 p-6">
              <h2 className="mb-2 font-display text-lg font-semibold text-gold-900">
                Next Step
              </h2>
              <p className="mb-4 text-sm text-gold-700">
                Ready to send a quote for this event?
              </p>
              <Link href={`/inquiries/${inquiry.id}/quote`}>
                <Button className="w-full">
                  Create Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
