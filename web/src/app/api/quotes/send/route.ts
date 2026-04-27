import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendQuoteReadyEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { quoteId } = await request.json()

    if (!quoteId) {
      return NextResponse.json({ error: 'Missing quoteId' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify user owns this quote
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get quote with related data
    const { data: quote, error } = await supabase
      .from('quotes')
      .select(
        `
        id,
        deposit_amount,
        operator_id,
        operators (
          business_name
        ),
        clients (
          name,
          email
        ),
        inquiries (
          event_date
        )
      `
      )
      .eq('id', quoteId)
      .eq('operator_id', user.id)
      .single()

    if (error || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    const q = quote as unknown as {
      id: string
      deposit_amount: number
      operators: { business_name: string }
      clients: { name: string; email: string }
      inquiries: { event_date: string }
    }

    if (!q.clients?.email) {
      return NextResponse.json(
        { error: 'Client has no email address' },
        { status: 400 }
      )
    }

    // Send email
    await sendQuoteReadyEmail({
      clientEmail: q.clients.email,
      clientName: q.clients.name,
      operatorName: q.operators.business_name,
      quoteId: q.id,
      depositAmount: q.deposit_amount,
      eventDate: q.inquiries.event_date,
    })

    // Update quote status to sent
    await supabase
      .from('quotes')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', quoteId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error sending quote:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
