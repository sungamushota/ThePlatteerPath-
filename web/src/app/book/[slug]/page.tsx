import { IntakeForm } from '@/components/forms/intake-form'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface Operator {
  id: string
  business_name: string
  slug: string
  logo_url: string | null
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operators')
    .select('id, business_name, slug, logo_url')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    notFound()
  }

  const operator = data as Operator

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-50/50 via-cream to-cream">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          {operator.logo_url ? (
            <img
              src={operator.logo_url}
              alt={operator.business_name}
              className="mx-auto mb-5 h-20 w-20 rounded-2xl object-cover shadow-lg ring-4 ring-white"
            />
          ) : (
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 font-display text-3xl font-bold text-white shadow-lg ring-4 ring-white">
              {operator.business_name.charAt(0)}
            </div>
          )}
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            {operator.business_name}
          </h1>
          <p className="mt-2 text-stone-500">Request a Catering Quote</p>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-gold-300" />
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-stone-100 bg-white/80 p-6 shadow-xl shadow-stone-200/10 backdrop-blur-sm sm:p-8">
          <IntakeForm
            operatorSlug={operator.slug}
            businessName={operator.business_name}
          />
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-stone-400">
            Powered by{' '}
            <span className="font-display font-semibold text-stone-500">
              CaterFlow
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('operators')
    .select('business_name')
    .eq('slug', slug)
    .single()

  const operator = data as { business_name: string } | null

  return {
    title: operator
      ? `Request a Quote — ${operator.business_name}`
      : 'Request a Quote',
    description: 'Submit an inquiry for catering services',
  }
}
