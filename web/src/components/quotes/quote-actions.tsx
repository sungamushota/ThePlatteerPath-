'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2 } from 'lucide-react'

interface QuoteActionsProps {
  quoteId: string
  depositAmount: number
}

export function QuoteActions({ quoteId, depositAmount }: QuoteActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setIsLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Button
        onClick={handlePay}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting to payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Deposit — ${depositAmount.toFixed(2)}
          </>
        )}
      </Button>
      <p className="text-center text-xs text-stone-500">
        Secure payment powered by Stripe. You&apos;ll be redirected to complete payment.
      </p>
    </div>
  )
}
