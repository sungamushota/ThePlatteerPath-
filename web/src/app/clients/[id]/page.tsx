import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Users,
  ChevronRight,
  FileText,
  Settings,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

interface ClientDetail {
  id: string
  name: string
  email: string
  phone: string
  notes: string | null
  created_at: string
}

interface ClientInquiry {
  id: string
  event_date: string
  guest_count: number
  event_type: string
  status: string
  created_at: string
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: clientData, error } = await supabase
    .from('clients')
    .select('id, name, email, phone, notes, created_at')
    .eq('id', id)
    .eq('operator_id', user.id)
    .single()

  if (error || !clientData) {
    notFound()
  }

  const client = clientData as ClientDetail

  // Get client's inquiries
  const { data: inquiriesData } = await supabase
    .from('inquiries')
    .select('id, event_date, guest_count, event_type, status, created_at')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const inquiries = (inquiriesData || []) as ClientInquiry[]

  const formatEventType = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-gold-50 text-gold-700 ring-1 ring-gold-200'
      case 'quoted':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
      case 'booked':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
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

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Back */}
        <Link
          href="/clients"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Clients
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client Info Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 font-display text-xl font-semibold text-gold-700">
                {client.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-stone-900">
                  {client.name}
                </h1>
                <p className="text-xs text-stone-500">
                  Client since{' '}
                  {new Date(client.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-stone-100 pt-4">
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-2.5 text-sm text-stone-700 transition-colors hover:text-gold-600"
              >
                <Phone className="h-4 w-4 text-stone-400" />
                {client.phone}
              </a>
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-2.5 text-sm text-stone-700 transition-colors hover:text-gold-600"
              >
                <Mail className="h-4 w-4 text-stone-400" />
                {client.email}
              </a>
            </div>

            {client.notes && (
              <div className="mt-4 border-t border-stone-100 pt-4">
                <p className="text-xs font-medium text-stone-500 mb-1">Notes</p>
                <p className="text-sm text-stone-700 whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-100 pt-4">
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <p className="font-display text-xl font-bold text-stone-900">
                  {inquiries.length}
                </p>
                <p className="text-xs text-stone-500">Inquiries</p>
              </div>
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <p className="font-display text-xl font-bold text-stone-900">
                  {inquiries.filter((i) => i.status === 'booked').length}
                </p>
                <p className="text-xs text-stone-500">Booked</p>
              </div>
            </div>
          </div>

          {/* Inquiry History */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-stone-100 px-6 py-4">
                <h2 className="font-display text-lg font-semibold text-stone-900">
                  Inquiry History
                </h2>
              </div>

              {inquiries.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {inquiries.map((inquiry) => (
                    <Link
                      key={inquiry.id}
                      href={`/inquiries/${inquiry.id}`}
                      className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-stone-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-stone-900">
                            {formatEventType(inquiry.event_type)}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(inquiry.status)}`}
                          >
                            {inquiry.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(inquiry.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          <span className="text-stone-300">·</span>
                          <Users className="h-3 w-3" />
                          {inquiry.guest_count} guests
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-stone-300" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <FileText className="mx-auto h-8 w-8 text-stone-300" />
                  <p className="mt-2 text-sm text-stone-500">No inquiries from this client yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
