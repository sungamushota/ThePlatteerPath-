'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface InquiryActionsProps {
  inquiryId: string
  currentStatus: string
}

export function InquiryActions({ inquiryId, currentStatus }: InquiryActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', inquiryId)

    if (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status. Please try again.')
    } else {
      router.refresh()
    }

    setIsUpdating(false)
  }

  if (currentStatus === 'declined') {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus('new')}
          disabled={isUpdating}
        >
          {isUpdating && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          Reopen
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === 'new' && (
        <Button
          size="sm"
          onClick={() => updateStatus('quoted')}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
          )}
          Mark Quoted
        </Button>
      )}

      {currentStatus === 'quoted' && (
        <Button
          size="sm"
          onClick={() => updateStatus('booked')}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
          )}
          Mark Booked
        </Button>
      )}

      {(currentStatus === 'new' || currentStatus === 'quoted') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateStatus('declined')}
          disabled={isUpdating}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <XCircle className="mr-1 h-3.5 w-3.5" />
          Decline
        </Button>
      )}
    </div>
  )
}
