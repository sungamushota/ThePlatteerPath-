'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Users } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  notes: string | null
  created_at: string
  inquiry_count: number
}

interface ClientSearchProps {
  clients: Client[]
}

export function ClientSearch({ clients }: ClientSearchProps) {
  const [query, setQuery] = useState('')

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    )
  })

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-base text-stone-900 placeholder:text-stone-400 transition-all duration-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/10"
        />
      </div>

      {/* Client list */}
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="divide-y divide-stone-100">
            {filtered.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-stone-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 font-display font-semibold text-gold-700">
                    {client.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 truncate">
                      {client.name}
                    </p>
                    <p className="text-sm text-stone-500 truncate">
                      {client.phone || client.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-stone-400 sm:inline">
                    {client.inquiry_count}{' '}
                    {client.inquiry_count === 1 ? 'inquiry' : 'inquiries'}
                  </span>
                  <ChevronRight className="h-4 w-4 text-stone-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-50">
            <Users className="h-8 w-8 text-stone-300" />
          </div>
          <p className="font-medium text-stone-700">
            {query ? 'No clients match your search' : 'No clients yet'}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            {query
              ? 'Try a different search term'
              : 'Clients are added automatically when inquiries come in'}
          </p>
        </div>
      )}
    </>
  )
}
