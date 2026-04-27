'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  intakeFormSchema,
  type IntakeFormData,
  eventTypeOptions,
  serviceTypeOptions,
  dietaryOptions,
  budgetOptions,
  referralOptions,
} from '@/lib/validations/intake'
import { cn } from '@/lib/utils'
import { ChevronLeft, Check, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface IntakeFormProps {
  operatorSlug: string
  businessName: string
}

export function IntakeForm({ operatorSlug, businessName }: IntakeFormProps) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<IntakeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(intakeFormSchema) as any,
    defaultValues: {
      dietaryRestrictions: [],
    },
  })

  const watchDietary = watch('dietaryRestrictions') || []

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const validateStep = async () => {
    let fieldsToValidate: (keyof IntakeFormData)[] = []
    switch (step) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'phone', 'email']
        break
      case 2:
        fieldsToValidate = ['eventDate', 'guestCount', 'locationAddress']
        break
      case 3:
        fieldsToValidate = ['eventType', 'serviceType']
        break
      case 4:
        fieldsToValidate = ['referralSource']
        break
    }
    return await trigger(fieldsToValidate)
  }

  const nextStep = async () => {
    const isValid = await validateStep()
    if (isValid && step < 4) {
      setDirection(1)
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1)
      setStep(step - 1)
    }
  }

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, operatorSlug }),
      })
      if (!response.ok) throw new Error('Failed to submit inquiry')
      setIsComplete(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepLabels = ['Contact', 'Event', 'Details', 'Final']

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
          <Check className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold text-stone-900">
          Thank you!
        </h2>
        <p className="text-stone-500">We received your inquiry.</p>
        <p className="mt-1 text-stone-500">
          Expect a response within 24 hours.
        </p>
        <div className="mx-auto mt-6 h-0.5 w-12 rounded-full bg-gold-300" />
        <p className="mt-4 text-sm text-stone-400">{businessName}</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Progress indicator */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          {stepLabels.map((label, i) => {
            const s = i + 1
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-300',
                      s < step && 'bg-gold-500 text-white',
                      s === step &&
                        'bg-gold-500 text-white ring-4 ring-gold-100',
                      s > step && 'bg-stone-100 text-stone-400'
                    )}
                  >
                    {s < step ? <Check className="h-3.5 w-3.5" /> : s}
                  </div>
                  <span
                    className={cn(
                      'mt-1.5 text-[10px] font-medium',
                      s <= step ? 'text-gold-600' : 'text-stone-400'
                    )}
                  >
                    {label}
                  </span>
                </div>
                {s < 4 && (
                  <div
                    className={cn(
                      'mx-1 h-0.5 w-8 rounded-full transition-colors duration-300 sm:w-14',
                      s < step ? 'bg-gold-400' : 'bg-stone-100'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Animated step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Contact Information
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  How can we reach you?
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  placeholder="Jane"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="555-123-4567"
                error={errors.phone?.message}
                {...register('phone', {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
          )}

          {/* Step 2: Event Basics */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Event Details
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Tell us about your event
                </p>
              </div>

              <Input
                label="Event Date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                error={errors.eventDate?.message}
                {...register('eventDate')}
              />

              <Input
                label="Approximate Start Time (optional)"
                type="time"
                error={errors.eventTime?.message}
                {...register('eventTime')}
              />

              <Input
                label="Number of Guests"
                type="number"
                min={1}
                placeholder="35"
                error={errors.guestCount?.message}
                {...register('guestCount', { valueAsNumber: true })}
              />

              <Input
                label="Event Location"
                placeholder="123 Main St, Houston, TX"
                error={errors.locationAddress?.message}
                {...register('locationAddress')}
              />
            </div>
          )}

          {/* Step 3: Service Details */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Service Details
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  What type of service do you need?
                </p>
              </div>

              <Select
                label="Event Type"
                placeholder="Select event type"
                options={eventTypeOptions}
                error={errors.eventType?.message}
                {...register('eventType')}
              />

              <Select
                label="Service Style"
                placeholder="Select service style"
                options={serviceTypeOptions}
                error={errors.serviceType?.message}
                {...register('serviceType')}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-stone-500">
                  Dietary Restrictions (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 transition-all duration-200',
                        watchDietary.includes(option.value)
                          ? 'border-gold-400 bg-gold-50 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300'
                      )}
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        className="h-4 w-4 rounded border-stone-300 text-gold-500 focus:ring-gold-400"
                        {...register('dietaryRestrictions')}
                      />
                      <span className="text-sm text-stone-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {watchDietary.includes('other') && (
                <Input
                  label="Please specify"
                  placeholder="Other dietary requirements..."
                  {...register('otherDietary')}
                />
              )}

              <Select
                label="Budget Range (optional)"
                placeholder="Select budget range"
                options={budgetOptions}
                {...register('budgetRange')}
              />
            </div>
          )}

          {/* Step 4: Final Details */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Almost Done!
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Just a couple more questions
                </p>
              </div>

              <Select
                label="How did you hear about us?"
                placeholder="Select an option"
                options={referralOptions}
                error={errors.referralSource?.message}
                {...register('referralSource')}
              />

              <Textarea
                label="Additional Notes (optional)"
                placeholder="Any special requests, menu preferences, or details we should know..."
                maxLength={500}
                showCount
                value={watch('additionalNotes') || ''}
                {...register('additionalNotes')}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        )}

        {step < 4 ? (
          <Button type="button" onClick={nextStep} className="flex-1">
            Next
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        )}
      </div>
    </form>
  )
}
