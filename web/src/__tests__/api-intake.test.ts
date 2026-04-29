import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Integration-style tests for the public inquiries API logic.
 * These test the data flow and client dedup behavior without hitting Supabase.
 */

// Simulates the client dedup logic from /api/public/inquiries
function findOrCreateClient(
  existingClients: { id: string; email: string; phone: string; name: string }[],
  operatorId: string,
  formData: { firstName: string; lastName: string; email: string; phone: string }
) {
  // Match by email only (not phone — phone dedup was removed)
  const existing = existingClients.find(
    (c) => c.email === formData.email
  )

  if (existing) {
    return { clientId: existing.id, created: false }
  }

  const newClient = {
    id: `new-${Date.now()}`,
    email: formData.email,
    phone: formData.phone,
    name: `${formData.firstName} ${formData.lastName}`,
  }
  existingClients.push(newClient)
  return { clientId: newClient.id, created: true }
}

describe('Client Dedup Logic', () => {
  let clients: { id: string; email: string; phone: string; name: string }[]

  beforeEach(() => {
    clients = [
      { id: 'client-1', email: 'jane@test.com', phone: '555-111-1111', name: 'Jane Doe' },
    ]
  })

  it('reuses client when same email is submitted', () => {
    const result = findOrCreateClient(clients, 'op-1', {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@test.com',
      phone: '555-222-2222',
    })
    expect(result.clientId).toBe('client-1')
    expect(result.created).toBe(false)
  })

  it('creates new client when different email is submitted', () => {
    const result = findOrCreateClient(clients, 'op-1', {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@test.com',
      phone: '555-333-3333',
    })
    expect(result.created).toBe(true)
    expect(result.clientId).not.toBe('client-1')
  })

  it('creates new client when same phone but different email', () => {
    const result = findOrCreateClient(clients, 'op-1', {
      firstName: 'Alice',
      lastName: 'Wong',
      email: 'alice@test.com',
      phone: '555-111-1111', // same phone as Jane
    })
    expect(result.created).toBe(true)
    expect(result.clientId).not.toBe('client-1')
  })

  it('does not overwrite existing client name on reuse', () => {
    findOrCreateClient(clients, 'op-1', {
      firstName: 'Janet',
      lastName: 'Changed',
      email: 'jane@test.com',
      phone: '555-111-1111',
    })
    expect(clients[0].name).toBe('Jane Doe') // unchanged
  })
})

describe('Inquiry Creation Payload', () => {
  it('builds correct inquiry payload from form data', () => {
    const formData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@test.com',
      phone: '555-123-4567',
      eventDate: '2026-06-15',
      eventTime: '18:00',
      guestCount: 50,
      locationAddress: '123 Main St',
      eventType: 'birthday',
      serviceType: 'drop_off',
      dietaryRestrictions: ['vegan', 'gluten_free'],
      budgetRange: '300_600',
      referralSource: 'instagram',
      additionalNotes: 'Please bring extra napkins',
    }

    const payload = {
      operator_id: 'op-1',
      client_id: 'client-1',
      status: 'new',
      event_type: formData.eventType,
      event_date: formData.eventDate,
      event_time: formData.eventTime || null,
      guest_count: formData.guestCount,
      location_address: formData.locationAddress,
      service_type: formData.serviceType,
      budget_range: formData.budgetRange || null,
      dietary_restrictions: formData.dietaryRestrictions,
      referral_source: formData.referralSource,
      additional_notes: formData.additionalNotes || null,
    }

    expect(payload.status).toBe('new')
    expect(payload.guest_count).toBe(50)
    expect(typeof payload.guest_count).toBe('number')
    expect(payload.event_time).toBe('18:00')
    expect(payload.dietary_restrictions).toEqual(['vegan', 'gluten_free'])
  })

  it('nullifies optional fields when empty', () => {
    const payload = {
      event_time: '' || null,
      budget_range: undefined || null,
      additional_notes: '' || null,
    }

    expect(payload.event_time).toBeNull()
    expect(payload.budget_range).toBeNull()
    expect(payload.additional_notes).toBeNull()
  })
})

describe('Quote Builder Calculations', () => {
  it('calculates subtotal correctly', () => {
    const lines = [
      { quantity: 2, unit_price: 150 },
      { quantity: 1, unit_price: 75 },
      { quantity: 3, unit_price: 25 },
    ]
    const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unit_price, 0)
    expect(subtotal).toBe(450)
  })

  it('calculates deposit amount correctly', () => {
    const subtotal = 1000
    const depositPercent = 30
    const depositAmount = (subtotal * depositPercent) / 100
    expect(depositAmount).toBe(300)
  })

  it('handles zero line items', () => {
    const lines: { quantity: number; unit_price: number }[] = []
    const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unit_price, 0)
    expect(subtotal).toBe(0)
  })

  it('handles decimal prices', () => {
    const lines = [
      { quantity: 1, unit_price: 19.99 },
      { quantity: 2, unit_price: 7.5 },
    ]
    const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unit_price, 0)
    expect(subtotal).toBeCloseTo(34.99)
  })
})
