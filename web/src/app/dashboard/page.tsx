import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  ChevronRight,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { CopyButton } from '@/components/ui/copy-button'

interface Operator {
  id: string
  business_name: string
  slug: string
}

interface Inquiry {
  id: string
  event_date: string
  guest_count: number
  event_type: string
  status: string
  created_at: string
  clients: { name: string }[] | { name: string } | null
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: operatorData } = await supabase
    .from('operators')
    .select('id, business_name, slug')
    .eq('id', user.id)
    .single()

  if (!operatorData) {
    redirect('/onboarding')
  }

  const operator = operatorData as Operator

  const { count: newInquiriesCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', user.id)
    .eq('status', 'new')

  const { count: totalClientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', user.id)

  const { data: recentInquiriesData } = await supabase
    .from('inquiries')
    .select(
      `
      id,
      event_date,
      guest_count,
      event_type,
      status,
      created_at,
      clients (
        name
      )
    `
    )
    .eq('operator_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const recentInquiries = (recentInquiriesData || []) as Inquiry[]

  const bookingLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://theplatterpath.com'}/book/${operator.slug}`

  const statCards = [
    {
      label: 'New Inquiries',
      value: newInquiriesCount || 0,
      icon: FileText,
      bg: 'bg-gold-50',
      iconColor: 'text-gold-600',
      ring: 'hover:ring-gold-100',
      href: '/inquiries?status=new',
    },
    {
      label: 'Total Clients',
      value: totalClientsCount || 0,
      icon: Users,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      ring: 'hover:ring-blue-100',
      href: '/clients',
    },
    {
      label: 'Upcoming Events',
      value: 0,
      icon: Calendar,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      ring: 'hover:ring-emerald-100',
      href: '#',
    },
    {
      label: 'Revenue This Month',
      value: '$0',
      icon: DollarSign,
      bg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      ring: 'hover:ring-violet-100',
      href: '#',
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
              The PlatterPath
            </span>
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-gold-50 text-gold-700"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/inquiries">
                <Button variant="ghost" size="sm">
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
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-stone-600 sm:inline">
              {operator.business_name}
            </span>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Welcome back
          </h1>
          <p className="mt-1 text-stone-600">
            Here&apos;s what&apos;s happening with {operator.business_name}
          </p>
        </div>

        {/* Booking Link Card */}
        <div className="mb-8 rounded-2xl border border-gold-200 bg-gradient-to-r from-gold-50 to-gold-100 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 font-display text-lg font-semibold text-gold-900">
                Your Booking Link
              </h2>
              <p className="mb-4 text-sm text-gold-700/70">
                Share this link to receive inquiries from clients
              </p>
              <div className="flex items-center gap-2">
                <code className="truncate rounded-lg border border-gold-200/50 bg-white/80 px-4 py-2.5 font-mono text-sm text-gold-800 max-w-md">
                  {bookingLink}
                </code>
                <CopyButton text={bookingLink} />
              </div>
            </div>
            <Link
              href={`/book/${operator.slug}`}
              target="_blank"
              className="hidden items-center gap-1.5 text-sm text-gold-600 transition-colors hover:text-gold-700 sm:inline-flex"
            >
              Preview
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <div
                className={`rounded-2xl border border-stone-100 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:shadow-stone-100 hover:ring-2 ${stat.ring}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-stone-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-stone-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Inquiries */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
            <h2 className="font-display text-lg font-semibold text-stone-900">
              Recent Inquiries
            </h2>
            <Link
              href="/inquiries"
              className="text-sm font-medium text-gold-600 transition-colors hover:text-gold-700"
            >
              View all
            </Link>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="divide-y divide-stone-50">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/inquiries/${inquiry.id}`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-stone-50/50"
                >
                  <div>
                    <p className="font-medium text-stone-900">
                      {Array.isArray(inquiry.clients)
                        ? inquiry.clients[0]?.name
                        : inquiry.clients?.name || 'Unknown'}
                    </p>
                    <p className="mt-0.5 text-sm text-stone-400">
                      {new Date(inquiry.event_date).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}{' '}
                      · {inquiry.guest_count} guests · {inquiry.event_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        inquiry.status === 'new'
                          ? 'bg-gold-50 text-gold-700 ring-1 ring-gold-200'
                          : inquiry.status === 'booked'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-stone-50 text-stone-600 ring-1 ring-stone-200'
                      }`}
                    >
                      {inquiry.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-stone-300" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-50">
                <FileText className="h-8 w-8 text-stone-300" />
              </div>
              <p className="font-medium text-stone-600">No inquiries yet</p>
              <p className="mt-1 text-sm text-stone-400">
                Share your booking link to start receiving inquiries
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
