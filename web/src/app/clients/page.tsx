import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Users,
  ChevronRight,
  Settings,
  Search,
  UserPlus,
} from 'lucide-react'
import { ClientSearch } from '@/components/clients/client-search'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  notes: string | null
  created_at: string
  inquiry_count: number
}

export default async function ClientsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all clients with inquiry count
  const { data: clientsData } = await supabase
    .from('clients')
    .select('id, name, email, phone, notes, created_at')
    .eq('operator_id', user.id)
    .order('name', { ascending: true })

  // Get inquiry counts per client
  const clients: Client[] = []
  for (const c of clientsData || []) {
    const { count } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', c.id)

    clients.push({
      ...c,
      inquiry_count: count || 0,
    })
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">
              Clients
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              {clients.length} {clients.length === 1 ? 'client' : 'clients'} in your database
            </p>
          </div>
          <Link href="/clients/new">
            <Button size="sm">
              <UserPlus className="mr-1.5 h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>

        {/* Search */}
        <ClientSearch clients={clients} />
      </main>
    </div>
  )
}
