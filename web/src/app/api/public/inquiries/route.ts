import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { intakeFormSchema } from '@/lib/validations/intake'
import { sendNewInquiryEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { operatorSlug, ...formData } = body

    // Validate form data
    const validatedData = intakeFormSchema.parse(formData)

    const cookieStore = await cookies()

    // Create untyped client for public API
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore
            }
          },
        },
      }
    )

    // Get operator by slug
    const { data: operator, error: operatorError } = await supabase
      .from('operators')
      .select('id, email, business_name')
      .eq('slug', operatorSlug)
      .single()

    if (operatorError || !operator) {
      return NextResponse.json(
        { error: 'Operator not found' },
        { status: 404 }
      )
    }

    const operatorId = (operator as { id: string }).id

    // Check if client exists (by email or phone)
    let clientId: string | null = null

    const { data: existingClientByEmail } = await supabase
      .from('clients')
      .select('id')
      .eq('operator_id', operatorId)
      .eq('email', validatedData.email)
      .maybeSingle()

    if (existingClientByEmail) {
      clientId = (existingClientByEmail as { id: string }).id
    } else {
      const { data: existingClientByPhone } = await supabase
        .from('clients')
        .select('id')
        .eq('operator_id', operatorId)
        .eq('phone', validatedData.phone)
        .maybeSingle()

      if (existingClientByPhone) {
        clientId = (existingClientByPhone as { id: string }).id
      }
    }

    // Create client if doesn't exist
    if (!clientId) {
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          operator_id: operatorId,
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          email: validatedData.email,
          phone: validatedData.phone,
          source: validatedData.referralSource,
          dietary_restrictions: validatedData.dietaryRestrictions,
        })
        .select('id')
        .single()

      if (clientError || !newClient) {
        console.error('Error creating client:', clientError)
        return NextResponse.json(
          { error: 'Failed to create client' },
          { status: 500 }
        )
      }

      clientId = (newClient as { id: string }).id
    } else {
      // Update existing client with any new dietary restrictions
      await supabase
        .from('clients')
        .update({
          dietary_restrictions: validatedData.dietaryRestrictions,
        })
        .eq('id', clientId)
    }

    // Create inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert({
        operator_id: operatorId,
        client_id: clientId,
        status: 'new',
        event_type: validatedData.eventType,
        event_date: validatedData.eventDate,
        event_time: validatedData.eventTime || null,
        guest_count: validatedData.guestCount,
        location_address: validatedData.locationAddress,
        service_type: validatedData.serviceType,
        budget_range: validatedData.budgetRange || null,
        dietary_restrictions: validatedData.dietaryRestrictions,
        referral_source: validatedData.referralSource,
        additional_notes: validatedData.additionalNotes || null,
      })
      .select('id')
      .single()

    if (inquiryError || !inquiry) {
      console.error('Error creating inquiry:', inquiryError)
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: 500 }
      )
    }

    // Send notification email to operator
    const op = operator as { id: string; email: string; business_name: string }
    await sendNewInquiryEmail({
      operatorEmail: op.email,
      operatorName: op.business_name,
      clientName: `${validatedData.firstName} ${validatedData.lastName}`,
      eventDate: validatedData.eventDate,
      guestCount: validatedData.guestCount,
      eventType: validatedData.eventType,
      inquiryId: (inquiry as { id: string }).id,
    })

    return NextResponse.json({
      success: true,
      inquiryId: (inquiry as { id: string }).id,
    })
  } catch (error) {
    console.error('Error processing inquiry:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
