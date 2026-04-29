import { describe, it, expect } from 'vitest'
import { intakeFormSchema } from '@/lib/validations/intake'

const validFormData = {
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '555-123-4567',
  email: 'jane@example.com',
  eventDate: '2026-06-15',
  guestCount: 50,
  locationAddress: '123 Main St, Sydney',
  eventType: 'birthday',
  serviceType: 'drop_off',
  dietaryRestrictions: ['vegan'],
  referralSource: 'instagram',
}

describe('Intake Form Validation', () => {
  it('accepts valid form data', () => {
    const result = intakeFormSchema.safeParse(validFormData)
    expect(result.success).toBe(true)
  })

  it('rejects missing first name', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, firstName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects short phone number', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, phone: '123' })
    expect(result.success).toBe(false)
  })

  it('rejects zero guest count', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, guestCount: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects missing event type', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, eventType: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing service type', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, serviceType: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing referral source', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, referralSource: '' })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields as undefined', () => {
    const minimal = {
      ...validFormData,
      eventTime: undefined,
      budgetRange: undefined,
      additionalNotes: undefined,
      dietaryRestrictions: [],
    }
    const result = intakeFormSchema.safeParse(minimal)
    expect(result.success).toBe(true)
  })

  it('rejects notes over 500 characters', () => {
    const result = intakeFormSchema.safeParse({
      ...validFormData,
      additionalNotes: 'A'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('guest count must be a number not a string', () => {
    const result = intakeFormSchema.safeParse({ ...validFormData, guestCount: 'fifty' })
    expect(result.success).toBe(false)
  })
})
