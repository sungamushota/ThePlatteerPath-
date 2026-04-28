import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if this is a password recovery flow
        const isRecovery = user.recovery_sent_at &&
          new Date(user.recovery_sent_at).getTime() > Date.now() - 60 * 60 * 1000

        if (isRecovery) {
          return NextResponse.redirect(`${origin}/reset-password`)
        }

        const { data: operator } = await supabase
          .from('operators')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!operator) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
