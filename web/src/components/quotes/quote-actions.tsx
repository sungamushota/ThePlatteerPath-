'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Check, Loader2 } from 'lucide-react'

interface QuoteActionsProps {
  quoteId: string
  depositAmount: number
}

export function QuoteActions({ quoteId, depositAmount }: QuoteActionsProps) {
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)

    const supabase = createClient()

    const { error } = await supabase
      .from('quotes')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', quoteId)

    if (error) {
      console.error('Failed to accept quote:', error)
      alert('Something went wrong. Please try again.')
      setIsAccepting(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleAccept}
        disabled={isAccepting}
        className="w-full"
        size="lg"
      >
        {isAccepting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Accepting...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Accept Quote — ${depositAmount.toFixed(2)} deposit
          </>
        )}
      </Button>
      <p className="text-center text-xs text-stone-500">
        By accepting, you agree to the deposit amount above. Payment details
        will be shared by the caterer.
      </p>
    </div>
  )
}
