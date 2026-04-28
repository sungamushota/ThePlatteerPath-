import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(request: Request) {
  try {
    const { quoteId } = await request.json()

    if (!quoteId) {
      return NextResponse.json({ error: 'Missing quoteId' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get quote with related data
    const { data: quote, error } = await supabase
      .from('quotes')
      .select(
        `
        id,
        status,
        deposit_amount,
        subtotal,
        total,
        operators (
          business_name
        ),
        clients (
          name,
          email
        ),
        inquiries (
          event_date,
          event_type,
          guest_count
        )
      `
      )
      .eq('id', quoteId)
      .single()

    if (error || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    const q = quote as unknown as {
      id: string
      status: string
      deposit_amount: number
      subtotal: number
      total: number
      operators: { business_name: string }
      clients: { name: string; email: string }
      inquiries: { event_date: string; event_type: string; guest_count: number }
    }

    if (q.status === 'accepted' || q.status === 'paid') {
      return NextResponse.json(
        { error: 'Quote already accepted' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theplatterpath.com'
    const eventType = q.inquiries.event_type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase())

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: q.clients?.email || undefined,
      metadata: {
        quote_id: q.id,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Catering Deposit — ${q.operators.business_name}`,
              description: `${eventType} for ${q.inquiries.guest_count} guests on ${new Date(q.inquiries.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
            },
            unit_amount: Math.round(q.deposit_amount * 100), // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/quotes/${q.id}?payment=success`,
      cancel_url: `${appUrl}/quotes/${q.id}?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
