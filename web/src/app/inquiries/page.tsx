import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  FileText,
  ChevronRight,
  Settings,
  Filter,
  Inbox,
} from 'lucide-react'

interface Inquiry {
  id: string
  event_date: string
  guest_count: number
  event_type: string
  service_type: string
  status: string
  created_at: string
  clients: { name: string; phone: string }[] | { name: string; phone: string } | null
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function InquiriesPage({ searchParams }: PageProps) {
  const { status: filterStatus } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Build query
  let query = supabase
    .from('inquiries')
    .select(
      `
      id,
      event_date,
      guest_count,
      event_type,
      service_type,
      status,
      created_at,
      clients (
        name,
        phone
      )
    `
    )
    .eq('operator_id', user.id)
    .order('created_at', { ascending: false })

  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus)
  }

  const { data: inquiriesData } = await query

  const inquiries = (inquiriesData || []) as Inquiry[]

  // Get counts for tabs
  const { count: allCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', user.id)

  const { count: newCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', user.id)
    .eq('status', 'new')

  const { count: quotedCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', user.id)
    .eq('status', 'quoted')

  const { count: bookedCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', user.id)
    .eq('status', 'booked')

  const tabs = [
    { label: 'All', value: 'all', count: allCount || 0 },
    { label: 'New', value: 'new', count: newCount || 0 },
    { label: 'Quoted', value: 'quoted', count: quotedCount || 0 },
    { label: 'Booked', value: 'booked', count: bookedCount || 0 },
  ]

  const activeTab = filterStatus || 'all'

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

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
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/inquiries">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-gold-50 text-gold-700"
                >
                  Inquiries
                </Button>
              </Link>
              <Link href="/clients">
                <Button variant="ghost" size="sm">
                  Clients
                </Button>
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">
              Inquiries
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Manage incoming booking requests
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Filter className="h-4 w-4" />
            {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-6 flex gap-1 rounded-xl bg-stone-100 p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/inquiries${tab.value === 'all' ? '' : `?status=${tab.value}`}`}
              className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs ${
                    activeTab === tab.value
                      ? 'bg-gold-100 text-gold-700'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Inquiry list */}
        {inquiries.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="divide-y divide-stone-100">
              {inquiries.map((inquiry) => {
                const clientName = Array.isArray(inquiry.clients)
                  ? inquiry.clients[0]?.name
                  : inquiry.clients?.name || 'Unknown'

                return (
                  <Link
                    key={inquiry.id}
                    href={`/inquiries/${inquiry.id}`}
                    className="flex items-center justify-between px-6 py-5 transition-colors hover:bg-stone-50/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-stone-900 truncate">
                          {clientName}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(inquiry.status)}`}
                        >
                          {inquiry.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                        <span>
                          {new Date(inquiry.event_date).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' }
                          )}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span>{inquiry.guest_count} guests</span>
                        <span className="text-stone-300">·</span>
                        <span>{formatEventType(inquiry.event_type)}</span>
                      </div>
                      <p className="mt-1 text-xs text-stone-400">
                        Received{' '}
                        {new Date(inquiry.created_at).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric' }
                        )}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-stone-300" />
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-50">
              <Inbox className="h-8 w-8 text-stone-300" />
            </div>
            <p className="font-medium text-stone-700">
              {filterStatus && filterStatus !== 'all'
                ? `No ${filterStatus} inquiries`
                : 'No inquiries yet'}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              Share your booking link to start receiving inquiries
            </p>
            <Link href="/dashboard" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                Get your link
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
