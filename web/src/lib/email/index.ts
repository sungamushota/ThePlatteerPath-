import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'The PlatterPath <notifications@theplatterpath.com>'

interface NewInquiryEmailProps {
  operatorEmail: string
  operatorName: string
  clientName: string
  eventDate: string
  guestCount: number
  eventType: string
  inquiryId: string
}

export async function sendNewInquiryEmail({
  operatorEmail,
  operatorName,
  clientName,
  eventDate,
  guestCount,
  eventType,
  inquiryId,
}: NewInquiryEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] Skipping - no RESEND_API_KEY configured')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theplatterpath.com'
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  })
  const formattedType = eventType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: operatorEmail,
      subject: `New Inquiry: ${clientName} — ${formattedType} for ${guestCount} guests`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #1C1917; margin-bottom: 4px;">New Inquiry Received</h2>
          <p style="color: #57534E; margin-top: 4px;">Hi ${operatorName}, you have a new booking request!</p>

          <div style="background: #FAF6F0; border: 1px solid #E6D5AE; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; color: #57534E; font-size: 14px;"><strong>Client:</strong> ${clientName}</p>
            <p style="margin: 0 0 8px; color: #57534E; font-size: 14px;"><strong>Event:</strong> ${formattedType}</p>
            <p style="margin: 0 0 8px; color: #57534E; font-size: 14px;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 0; color: #57534E; font-size: 14px;"><strong>Guests:</strong> ${guestCount}</p>
          </div>

          <a href="${appUrl}/inquiries/${inquiryId}" style="display: inline-block; background: #A88734; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px;">
            View Inquiry
          </a>

          <p style="color: #A8A29E; font-size: 12px; margin-top: 32px;">
            — The PlatterPath
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[Email] Failed to send new inquiry notification:', err)
  }
}

interface QuoteReadyEmailProps {
  clientEmail: string
  clientName: string
  operatorName: string
  quoteId: string
  depositAmount: number
  eventDate: string
}

export async function sendQuoteReadyEmail({
  clientEmail,
  clientName,
  operatorName,
  quoteId,
  depositAmount,
  eventDate,
}: QuoteReadyEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] Skipping - no RESEND_API_KEY configured')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://theplatterpath.com'
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  })

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `Your catering quote from ${operatorName} is ready`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #1C1917; margin-bottom: 4px;">Your Quote is Ready</h2>
          <p style="color: #57534E; margin-top: 4px;">Hi ${clientName}, ${operatorName} has prepared a quote for your event.</p>

          <div style="background: #FAF6F0; border: 1px solid #E6D5AE; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; color: #57534E; font-size: 14px;"><strong>Event Date:</strong> ${formattedDate}</p>
            <p style="margin: 0; color: #57534E; font-size: 14px;"><strong>Deposit Required:</strong> $${depositAmount.toFixed(2)}</p>
          </div>

          <a href="${appUrl}/quotes/${quoteId}" style="display: inline-block; background: #A88734; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px;">
            View & Accept Quote
          </a>

          <p style="color: #A8A29E; font-size: 12px; margin-top: 32px;">
            — ${operatorName} via The PlatterPath
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[Email] Failed to send quote ready notification:', err)
  }
}
