import { z } from 'zod'

// Step 1: Contact Info
export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
})

// Step 2: Event Basics
export const eventBasicsSchema = z.object({
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  guestCount: z.number().min(1, 'Guest count must be at least 1'),
  locationAddress: z.string().min(1, 'Event location is required'),
})

// Step 3: Service Details
export const serviceDetailsSchema = z.object({
  eventType: z.string().min(1, 'Please select an event type'),
  serviceType: z.string().min(1, 'Please select a service style'),
  dietaryRestrictions: z.array(z.string()).optional(),
  otherDietary: z.string().optional(),
  budgetRange: z.string().optional(),
})

// Step 4: Final Details
export const finalDetailsSchema = z.object({
  referralSource: z.string().min(1, 'Please tell us how you heard about us'),
  additionalNotes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
})

// Complete form schema
export const intakeFormSchema = contactSchema
  .merge(eventBasicsSchema)
  .merge(serviceDetailsSchema)
  .merge(finalDetailsSchema)

export type IntakeFormData = z.infer<typeof intakeFormSchema>

// Options for dropdowns
export const eventTypeOptions = [
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'quinceanera', label: 'Quinceañera' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'other', label: 'Other' },
]

export const serviceTypeOptions = [
  { value: 'drop_off', label: 'Drop-off Only' },
  { value: 'drop_off_setup', label: 'Drop-off + Setup' },
  { value: 'full_service', label: 'Full Service with Staff' },
]

export const dietaryOptions = [
  { value: 'nut_free', label: 'Nut-free' },
  { value: 'gluten_free', label: 'Gluten-free' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'no_pork', label: 'No Pork' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'other', label: 'Other' },
]

export const budgetOptions = [
  { value: 'under_300', label: 'Under $300' },
  { value: '300_600', label: '$300 - $600' },
  { value: '600_1000', label: '$600 - $1,000' },
  { value: '1000_2000', label: '$1,000 - $2,000' },
  { value: 'over_2000', label: 'Over $2,000' },
]

export const referralOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'referral', label: 'Referral from a friend' },
  { value: 'google', label: 'Google' },
  { value: 'text', label: 'Text message' },
  { value: 'other', label: 'Other' },
]
