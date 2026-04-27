# CaterFlow MVP Plan

**Date:** 2026-04-24
**Phase:** 6 of 6 - MVP STRATEGY
**The question this document answers:** What is the smallest thing that makes this caterer cancel Bookbee and throw away the notebook?

---

## The Answer (State It First)

The operator cancels Bookbee the day they receive their first inquiry through the intake link, look up a repeat client in under 10 seconds, and send a quote that collects a deposit automatically.

That is one workflow: inquiry arrives complete, client record exists, quote goes out, deposit comes in.

Everything in this document is in service of making that workflow flawless.

---

## Part 1: The MVP Scope - What Ships in 10 Weeks

This is the exhaustive list. If a feature is not listed here, it does not exist in the MVP. No exceptions.

### What Ships

**Module 1: Operator Onboarding**

- Screen 1 (Signup): Email input only. Magic link sent. No password.
- Screen 2 (Setup): Business name input. That is all that is required.
- Dashboard shown immediately after. Sample inquiry card visible to illustrate the product.
- Intake link generated automatically and displayed prominently: "Share this link to start receiving inquiries."
- Nothing else required to proceed. Logo is optional (upload later in Settings). Menu items are optional (enter during first quote). Stripe is optional (connect later when ready to take online payments).

**Module 2: Intake Form (Public, No Login Required)**

- 4 screens, mobile-first, works on any phone browser without app download.
- Screen 1 - Contact: First name, last name, phone number, email address.
- Screen 2 - Event Basics: Event date (date picker), approximate start time, guest count (number field), service location (text address field).
- Screen 3 - Service Details: Event type (dropdown: birthday, wedding, corporate, quinceañera, graduation, other), service style (dropdown: drop-off only, drop-off + setup, full service with staff), dietary restrictions (checkboxes: nut-free, gluten-free, vegan, vegetarian, no pork, halal, kosher, other - text field), approximate budget range (dropdown: under $300, $300-$600, $600-$1,000, $1,000-$2,000, over $2,000).
- Screen 4 - Final Details: How did you hear about us? (dropdown: Instagram, Facebook, referral from a friend, Google, text from operator, other), additional notes (text area, optional).
- Confirmation screen shown after submission: "We received your inquiry. Expect a response within 24 hours." No account creation required from the customer.
- Form is accessible at: `caterflow.app/book/[operator-slug]`
- Operator slug is auto-generated from business name during onboarding (editable in Settings).

**Module 3: Inquiry Queue (Operator View)**

- Inquiry list page: All inquiries in reverse chronological order. Status tags: New, Viewed, Quote Sent, Booked, Declined.
- Each inquiry card shows: client name, event date, guest count, event type, received timestamp, status.
- Filter by status. Search by client name.
- Inquiry detail page: Full details from the intake form. Referral source displayed prominently.
- One-tap action: "Create Quote" - opens the quote builder pre-filled with inquiry details.
- One-tap action: "Decline" - marks inquiry as declined (no automated message to client in MVP).
- Inquiry detail shows existing client record if the same phone or email has submitted before.

**Module 4: Client Records (CRM)**

- Every intake form submission automatically creates or updates a client record. No manual data entry required from the operator.
- If a submission uses the same phone number or email as an existing client, it links to that client (not a duplicate).
- Client list page: All clients in alphabetical order. Search by name, phone, or email.
- Each client card shows: name, total events, total revenue, last event date.
- Client detail page shows:
  - Contact info (name, phone, email, address if captured via intake)
  - How they were first acquired (referral source from first inquiry)
  - All past inquiries and events, listed chronologically
  - Total number of bookings
  - Total revenue from this client
  - Dietary restrictions and preferences (populated from intake forms)
  - Internal notes field (operator can type anything here)
- Operator can manually create a client record (for repeat clients who text instead of using the form). Fields: name, phone, email, notes.
- Operator can manually create an inquiry from an existing client record (for the "I just text" customer scenario). This creates an inquiry without requiring the client to fill out the form.

**Module 5: Quote Builder**

- Accessible from inquiry detail (pre-fills event date, guest count, client name, location) or standalone from the dashboard.
- Line items section: Add/edit/remove line items. Each line item has: description (text), quantity (number), unit price (dollar amount), line total (auto-calculated). Operator can reorder line items by dragging.
- Free-text entry: No menu item library required. Operator types "Jerk Chicken Platter" and enters price. After 5 quotes are created, the platform shows: "Save these items for faster quoting?" If yes, they are saved to the operator's menu item library for future use.
- Optional fields below line items:
  - Additional fees line: Label (text, e.g., "Delivery Fee", "Setup Fee", "Travel") and dollar amount. Can add multiple.
  - Discount line: Label and dollar amount (reduces total).
  - Tax rate: Percentage field. Applied to subtotal + fees. Optional.
- Summary: Subtotal, fees, discount, tax, total - all auto-calculated.
- Deposit section: Operator sets deposit percentage. Options: no deposit, 25%, 30%, 50%, or custom dollar amount. Default is 30% (configurable in Settings). Remaining balance auto-calculated.
- Notes field: Operator can add notes visible to the client on the quote (e.g., "Includes 2 hours of serving staff. Setup begins 1 hour before event time.").
- Quote expiration: Optional date field. Default: 7 days from send date.
- Preview button: Shows the client-facing quote view before sending.
- Send button: Sends quote to client via email.

**Module 6: Quote Client View and Acceptance**

- Client receives email with subject: "[Business Name] - Your Catering Quote for [Event Date]"
- Email contains: brief summary and link to view quote.
- Quote view page (no login required for client): Shows operator business name, event details, line-item breakdown, fees, tax, total, deposit amount, expiration date, and operator's notes.
- Accept button: Labeled "Accept Quote and Pay Deposit" (if Stripe is connected) or "Accept Quote" (if not connected).

Path A - Stripe connected:
- Clicking "Accept Quote and Pay Deposit" opens Stripe Checkout.
- Client pays the deposit amount by card.
- On success: booking is confirmed automatically. Client sees a confirmation screen. Operator receives email notification: "[Client Name] accepted your quote and paid a $[amount] deposit. Your event on [date] is confirmed."
- Invoice is auto-generated with deposit marked as paid and balance due noted.

Path B - Stripe not connected:
- Clicking "Accept Quote" shows: "To confirm your booking, please send a deposit of $[amount] to [Venmo handle / Zelle info / other]. Once received, your booking will be confirmed." (This text is configurable in Settings.)
- Operator manually marks the deposit as received in the platform, which confirms the booking.

**Module 7: Invoice**

- Invoice is auto-generated from the accepted quote. No re-entry of information.
- Invoice shows: line items (carried from quote), deposit paid, balance due, due date.
- Invoice is accessible to the client via a link in a "Balance Due" email sent when the operator marks the event complete.
- PDF download available for both operator and client.
- Payment status tracking: Unpaid, Partially Paid (deposit only), Paid in Full.
- Operator can manually mark balance as received (for cash, Venmo, Zelle payments).
- If Stripe is connected: balance payment link included in invoice email. Client can pay balance by card.

**Module 8: Settings**

- Business name (editable)
- Business slug (editable, controls intake form URL)
- Logo upload (optional)
- Venmo handle (optional, shown to clients when Stripe is not connected)
- Zelle info (optional)
- CashApp handle (optional)
- Default deposit percentage (default: 30%)
- Default tax rate (optional)
- Quote expiration default (default: 7 days)
- Stripe Connect: button to connect Stripe account (opens Stripe onboarding flow)
- Menu item library (add/edit/archive saved menu items for faster quoting)
- Intake form preview (view and share the operator's intake form link)

**What Does NOT Exist in MVP**

The following features are explicitly excluded. If an operator asks for them, the response is "coming soon":

- Employee time tracking and clock-in/clock-out
- Payroll export to Gusto or Square Payroll
- Automated follow-up emails (post-event thank-you, re-booking prompts)
- Automated payment reminders (overdue invoice nudges)
- SMS intake or notifications via Twilio
- Google Calendar or Apple Calendar sync
- Event calendar view within the platform (operators use their phone calendar)
- Per-head pricing calculations
- Tiered pricing or minimum charges
- Food cost tracking or recipe costing
- Kitchen prep lists or BEO (Banquet Event Order) generation
- Loyalty points program
- Referral link tracking (referral source is captured as a field, not tracked via link)
- Review request automation
- Client-facing portal or account creation for clients
- Online ordering portal
- Multi-user team accounts (single operator login only in MVP)
- Push notifications (email only in MVP)
- Multi-location support
- White-label or custom domain for intake form
- Native iOS or Android app
- Video monitoring
- Inventory tracking
- Delivery route optimization
- Client chat or messaging within the platform
- Staff scheduling

---

## Part 2: Week-by-Week Build Plan

**Team assumed:** 2 builders (1 full-stack lead, 1 full-stack support). Both contribute to all areas. Lead owns architecture decisions and integrations. Support owns UI implementation and testing.

**Tech stack:**
- Framework: Next.js 14 (App Router, React Server Components)
- Database: Supabase (PostgreSQL + Auth + Storage + Row-Level Security)
- Styling: Tailwind CSS
- Email: Resend (transactional, dedicated sending domain)
- Payments: Stripe (Stripe Connect for operator accounts, Stripe Checkout for client payments)
- PDF generation: react-pdf or Puppeteer for invoice/quote PDFs
- Deployment: Vercel
- Monitoring: Vercel Analytics + UptimeRobot for status monitoring

---

### Week 1 - Foundation

**Goal:** The skeleton works. Auth works. Database schema exists. Nothing crashes.

**Deliverables:**
- Supabase project initialized. Full database schema created (all tables: operator, client, inquiry, event, quote, quote_line, menu_item, invoice, payment).
- Row-Level Security policies configured. Operator can only see their own data.
- Magic link auth working end-to-end. Operator emails their address, receives link, clicks link, is logged in.
- Basic routing in Next.js. Pages exist for: `/login`, `/dashboard`, `/inquiries`, `/clients`, `/settings`. None have real content yet.
- Onboarding flow: Screen 1 (email), Screen 2 (business name). Operator record created in database.
- Dashboard shows "You have no inquiries yet. Share this link: [intake URL]" with the intake link copied to clipboard.
- Vercel deployment pipeline working. Main branch auto-deploys.
- `.env` variables documented. No secrets in repo.

**Milestone check:** Lead can sign up, log in, and see dashboard on both desktop and iPhone Safari.

---

### Week 2 - Intake Form

**Goal:** A customer can fill out the intake form and the operator sees the inquiry.

**Deliverables:**
- Public intake form built at `/book/[slug]`. All 4 screens implemented. Mobile-first layout.
- All form fields from the spec above are present and validated (required fields, date in future, guest count positive integer).
- Progress indicator on the form (Step 1 of 4, etc.).
- Form submission creates inquiry record in database. Creates client record if phone or email is new. Links to existing client record if phone or email matches.
- Confirmation screen shown to customer after submission.
- Operator email notification sent via Resend when new inquiry arrives. Email contains: client name, event date, guest count, event type, location.
- Intake form tested on iPhone SE (smallest common screen), iPhone 15, Samsung Galaxy S23.
- Intake form tested on iOS Safari, Chrome Android, Chrome desktop.

**Milestone check:** Tap the intake link on an iPhone, fill the form in under 3 minutes, and see an email notification arrive in the operator's inbox.

---

### Week 3 - Inquiry Queue and Client Records

**Goal:** The operator can see all inquiries and look up any client instantly.

**Deliverables:**
- Inquiry list page: all inquiries visible, sorted by date received. Status badges.
- Inquiry detail page: full intake form data displayed. Status update actions (Mark as Viewed, Decline).
- Duplicate client detection working: if same phone or email submits again, links to existing client.
- Client list page: all clients visible, alphabetical order. Search bar (searches name, phone, email).
- Client detail page: contact info, all past inquiries, total events, total revenue, dietary preferences, internal notes field.
- Manual client creation form: operator can add a client not from the intake form.
- Manual inquiry creation: operator can create an inquiry for an existing client (for "I just texted" scenarios). Fields mirror the intake form.
- "Create Quote" button on inquiry detail navigates to quote builder with fields pre-filled.

**Milestone check:** Search "Maria" in client list. Client appears. Click into her record. See all her past inquiries. Add a note. Note saves. Under 30 seconds total.

---

### Week 4 - Quote Builder (Part 1)

**Goal:** The operator can build a quote with line items and get a real dollar total.

**Deliverables:**
- Quote builder page: accessible from inquiry detail and from dashboard "New Quote" button.
- When accessed from inquiry detail: event date, guest count, client name, location auto-populated in quote header.
- Line items section: add line item (description, quantity, unit price). Line total auto-calculates. Operator can remove any line item. Operator can drag to reorder (or use up/down arrows as fallback for mobile).
- Additional fees section: add fee (label + dollar amount). Multiple fees supported.
- Discount section: add discount (label + dollar amount). Total reduces.
- Tax rate field: enter percentage. Tax calculated on (subtotal + fees - discount).
- Summary: subtotal, fees, discount, tax, total - all update in real time as values change.
- Deposit section: percentage selector (None, 25%, 30%, 50%, Custom). Deposit amount and remaining balance shown.
- Notes field for client-facing notes.
- Quote expiration date field.
- All calculated correctly. No rounding errors (use integer cents internally).
- Quote saved as draft when operator navigates away (auto-save to database every 30 seconds).

**Milestone check:** Build a quote for a 35-person party: add 4 line items, a travel fee, 8% tax, 30% deposit. Total is correct. Refresh the page. Quote is still there.

---

### Week 5 - Quote Builder (Part 2) and Quote Send

**Goal:** The client receives a professional quote email and can view it.

**Deliverables:**
- Menu item library: after 5 quotes created, prompt appears to save line items. Operator can save frequently used items. In quote builder, saved items appear as suggestions (dropdown appears when typing in description field).
- Quote preview mode: shows client-facing view before sending. Looks professional. Business name visible. All line items, fees, tax, total, deposit amount, notes, expiration date shown.
- Send button: generates quote email and sends via Resend to client's email address on file.
- Quote email: subject "[Business Name] - Your Catering Quote for [Event Date]". Clean plain-text email with summary and a link to view the full quote.
- Quote view page at `/quotes/[quote-token]` (no login required). Mobile-first. Shows full quote details. Accept button visible.
- Quote status updated to "Sent" after email sent.
- Operator can resend quote from inquiry detail if needed.
- Email deliverability: dedicated sending domain configured in Resend. SPF, DKIM, DMARC records set. Verified by sending 20 test quotes to Gmail, Outlook, Yahoo, and Apple Mail accounts and checking inbox placement.

**Milestone check:** Build a quote, click Send, open the email on an iPhone, click the link, see the quote. Under 2 minutes from click to client view.

---

### Week 6 - Payment Flow (Stripe Connect and Stripe Checkout)

**Goal:** The client pays a deposit and the booking is confirmed automatically.

**Deliverables:**
- Settings page includes "Connect Stripe" button. Clicking it opens Stripe Connect onboarding (Express account flow).
- Operator can complete Stripe Connect or skip it. If skipped, payment settings show Venmo/Zelle/CashApp fields instead.
- Quote accept flow - Stripe path:
  - "Accept Quote and Pay Deposit" button on quote view page.
  - Clicking creates a Stripe Checkout session for the deposit amount.
  - Client completes Stripe Checkout (card payment).
  - Stripe webhook fires on payment success.
  - Webhook handler marks quote as accepted, creates booking record, records payment, sends confirmation email to client and notification to operator.
- Quote accept flow - Manual path:
  - "Accept Quote" button shows a page with payment instructions (operator's Venmo/Zelle info).
  - Operator is notified of acceptance.
  - Operator manually marks deposit as received in the platform.
  - Booking is confirmed when deposit is marked received.
- Stripe webhooks handled correctly: payment_intent.succeeded, checkout.session.completed, account.updated.
- Webhook endpoint secured with Stripe webhook signature verification.
- Stripe test mode used during development. Live mode switch tested before beta.

**Milestone check:** On Stripe test mode, click "Accept and Pay Deposit," enter a Stripe test card, complete payment, verify operator receives confirmation email within 30 seconds and booking appears in dashboard.

---

### Week 7 - Invoice and Manual Payment Tracking

**Goal:** After an event, the balance is invoiced automatically and can be paid or tracked.

**Deliverables:**
- "Mark Event Complete" action on inquiry/booking detail. Operator taps this after the event.
- Marking event complete automatically:
  - Generates invoice for remaining balance (total minus deposit paid).
  - Sends invoice email to client with link to pay balance.
  - Invoice status shows as "Balance Due."
- Invoice view page (client-facing, no login required): Shows event summary, deposit paid, balance due, due date, payment link (if Stripe connected) or payment instructions.
- Operator can manually mark balance as paid (for cash, Venmo, Zelle). Notes field to enter payment method.
- If Stripe connected: client can pay balance via card from invoice page. Stripe Checkout used for balance payment.
- Invoice PDF: downloadable from both operator and client view. Professional layout with business name, client name, event date, line items, deposit credit, balance.
- Invoice list page: all invoices visible. Status: Awaiting Event, Balance Due, Paid in Full.
- Payment history on client detail: all payments linked to that client.

**Milestone check:** Mark an event complete. Open the invoice email on a phone. Click "Pay Balance." Complete Stripe test payment. Invoice status updates to "Paid in Full" within 30 seconds.

---

### Week 8 - Settings, Polish, and Edge Cases

**Goal:** Everything works on mobile. Edge cases handled. Settings complete. No data loss scenarios.

**Deliverables:**
- Settings page complete: business name, slug, logo, payment info (Venmo/Zelle/CashApp), default deposit %, default tax rate, quote expiration default, menu item library management, Stripe connect status.
- Changing the operator slug updates the intake form URL. Old URL redirects to new URL (301 redirect).
- Logo upload to Supabase Storage. Logo appears on quote view page and invoice.
- Mobile optimization pass: every page tested at 375px width (iPhone SE), 390px (iPhone 15), 360px (common Android). Touch targets minimum 44px. No horizontal scroll. Forms usable without zooming.
- Error handling: what happens when Supabase is unreachable (show error message, do not crash). What happens when Stripe Checkout fails (show retry option). What happens when email fails to send (log error, show operator "email failed, here is the link to share manually").
- Edge cases handled:
  - Client submits intake form twice with same email (merges to one client record, creates second inquiry).
  - Operator sends quote, client accepts, then operator tries to edit the quote (block edit, show "Quote is accepted and cannot be modified").
  - Quote expires (show "This quote has expired" to client with option to request new quote).
  - Invoice marked paid manually, then client also pays via Stripe (handle duplicate gracefully).
- Privacy Policy and Terms of Service pages linked in footer of intake form and quote view page. Standard SaaS template (Termly).
- Data export: Settings > Export Data button. Exports all client records, inquiries, quotes, and payments as CSV.
- "Delete Account" option in Settings. Marks account as deleted, data retained for 30 days then purged.

**Milestone check:** Walk through the full workflow on an iPhone SE (smallest screen): fill intake form, view inquiry, create quote, send quote, accept quote, pay deposit, mark event complete, pay balance, download invoice PDF. No broken layouts, no crashes.

---

### Week 9 - Beta Preparation and Pre-Launch Checklist

**Goal:** Ready for first real operators. No known critical bugs. Compliance in order.

**Deliverables:**
- All Stripe test mode payments converted to live mode. Stripe live mode tested with a real $1 payment (refunded immediately).
- Email sending from dedicated domain. No Resend test mode. Real emails to real inboxes.
- PWA manifest and service worker configured. Operators can "Add to Home Screen" on iPhone and Android. Icon appears. App opens without browser chrome.
- PWA tested on iOS Safari (14+) and Chrome Android. "Add to Home Screen" works correctly.
- Uptime monitoring configured (UptimeRobot, free tier). Alerts operator-facing pages every 5 minutes.
- Status page: simple public page at `caterflow.app/status` showing current status.
- Onboarding email sequence (manual, not automated in MVP): when a new operator signs up, founder sends a personal welcome email within 24 hours offering a 30-minute onboarding call.
- Beta operator list identified: 3-5 operators. See Part 6 for acquisition plan.
- Beta operators receive white-glove onboarding: 30-minute call, founder enters their menu items from a photo, founder walks them through creating their first quote.
- Bug tracking: Linear or GitHub Issues. All bugs from onboarding calls logged and triaged.
- No known P0 (crash, data loss, payment failure) bugs before any operator goes live.

**Milestone check:** Founder completes full end-to-end workflow using the live production environment, with a real Stripe payment, from a phone with no desktop access. Under 5 minutes from inquiry to paid deposit.

---

### Week 10 - First Operators Live and Iteration

**Goal:** 3-5 operators are using the platform with real clients. First feedback collected and acted on.

**Deliverables:**
- 3-5 beta operators onboarded. Each has:
  - Completed the 30-minute onboarding call.
  - Received their intake link.
  - Posted it in their Instagram bio or sent it to at least one pending inquiry.
  - Created at least one quote.
- Feedback collected via: daily check-in text from founder to each operator for the first 2 weeks.
- Questions asked each day: Did anything break? Did you use it today? What was confusing? What are you still doing in Bookbee that you wish you could do here?
- Critical bugs fixed within 24 hours (one founder dedicated to support during beta week).
- Non-critical improvement requests logged for Week 11+ iteration.
- At end of Week 10: founder reviews which features operators actually used, which they ignored, and which they asked for that do not exist.
- Decision made: which Phase 2 feature to build first based on operator demand.

**Milestone check:** At least 3 operators have received an inquiry via the intake form, sent a quote from the platform, and either collected a deposit via Stripe or manually. Real money has moved. Real clients have been served.

---

## Part 3: The "Cancel Bookbee" Moment

**When it happens:** End of Week 10, or Week 11 at the latest.

**The specific moment:** The operator opens Bookbee to send an invoice, realizes they already sent it from CaterFlow and the client already paid, and thinks "why am I still paying for this?"

**What must be true for this moment to occur:**

1. The operator has sent at least 3 quotes through CaterFlow. They have seen what a professional quote looks like from the client's perspective.
2. The operator has collected at least one deposit through Stripe Checkout. Money has moved through the platform without any follow-up on their part.
3. The operator has looked up a past client in CaterFlow and found their full history in under 20 seconds.
4. The operator has received at least one new inquiry through their intake link that came in complete, without back-and-forth.

**The trigger:** They try to do something in Bookbee they now do in CaterFlow and realize they just have two tools doing the same job. The Bookbee subscription renews. They cancel it.

**What we do to accelerate this moment:** During the first onboarding call, the founder says: "For the next 30 days, keep Bookbee running alongside CaterFlow. Do everything in both. At the end of 30 days, you will know which one to keep." This removes the switching risk from the operator's perspective, but experience shows they stop going to Bookbee within 2 weeks once the CaterFlow workflow is habit.

**The observable signal:** Operator tells us (in the daily check-in text) "I cancelled Bookbee." Track this. It is the north-star metric for MVP success.

---

## Part 4: The "Throw Away Notebook" Moment

**When it happens:** The first time a repeat client contacts the operator and the operator opens CaterFlow instead of the notebook.

**The specific moment:** A client texts the operator: "Hey, can you do a dinner for us again like last time?" The operator, instead of reaching for the notebook or scrolling through texts to find what "last time" was, opens CaterFlow, searches the client's name, and sees: 2 past events, last order was for 28 people with jerk chicken menu, delivered to 4521 Westheimer Rd, $740 total. The operator responds: "Absolutely! Same menu as March, right? I'll send you a quote shortly." The client feels remembered. The notebook stays in the drawer.

**What must be true for this moment to occur:**

1. The client has at least one past event recorded in CaterFlow. This requires that the operator's past clients have been imported (either via the white-glove onboarding call where the founder enters past clients, or by the operator having used CaterFlow for their first bookings with those clients).
2. The search works on mobile in under 3 taps.
3. The client detail page shows dietary preferences and past menu choices clearly.

**What we do to accelerate this moment:** During the onboarding call, the founder asks: "Tell me your top 5 clients. Give me their names and what they usually order." The founder enters these into CaterFlow while on the call. The operator has an instant CRM with their most important clients already in it. The notebook becomes redundant for those 5 clients within the first week.

**Why this matters more than the Bookbee moment:** Bookbee costs $50/month. The notebook costs nothing. Replacing the notebook is not about saving money - it is about behavior change. Once an operator trusts CaterFlow more than they trust their notebook, they will never leave. This is the retention event, not just the acquisition event.

---

## Part 5: Launch Criteria

Before any paying operator uses CaterFlow with real clients and real money, the following must all be true. Not "mostly true." All of them.

**Technical criteria:**

1. Operator can sign up, complete onboarding, and share their intake link within 3 minutes on an iPhone.
2. A client can fill out the intake form in under 3 minutes on an iPhone SE without any assistance.
3. Operator can send a quote within 5 minutes of receiving an intake form inquiry.
4. Client can accept a quote and pay a deposit in a single session without creating an account.
5. Operator receives a payment confirmation email within 60 seconds of a successful Stripe payment.
6. Invoice auto-generates correctly when operator marks event complete. All line items match the quote. Deposit is correctly credited.
7. Client detail page shows all past events for a repeat customer without any manual data entry by the operator.
8. All pages render correctly on iPhone SE, iPhone 15, and Samsung Galaxy S23.
9. "Add to Home Screen" works on iOS Safari and Android Chrome.
10. Stripe live mode working. A real $1 payment has been processed and refunded.
11. All emails land in inbox (not spam) for Gmail, Outlook, and Apple Mail.
12. Data export works. All operator data is downloadable as CSV.
13. Privacy Policy and Terms of Service are published.
14. No known P0 bugs (crash, data loss, payment failure, data showing to wrong operator).

**Business criteria:**

15. At least 3 operators have agreed to be beta users and have completed the onboarding call.
16. Each beta operator has posted their intake link in their Instagram bio or sent it to a pending inquiry.
17. Founder has completed at least one end-to-end demo with a real inquiry, quote, and payment (even using test accounts) without consulting notes.
18. Founder can explain the value prop in under 60 seconds: "You share one link. Your clients fill out a 3-minute form with everything you need to write a quote. You send the quote from the app. They pay a deposit online. You never open Bookbee or your notebook again."

If any of these 18 criteria is not met, the launch date moves. No exceptions.

---

## Part 6: First 10 Operators Plan

### Finding Them

**Source 1: The operator who inspired this product (1 operator)**
This is the easiest yes. They already articulated the problem. Founder reaches out directly and offers to build this for them, free for 3 months in exchange for honest feedback and weekly check-ins. This operator becomes the reference story.

**Source 2: Instagram hashtag search (3-4 operators)**
Search Instagram for: #cateringhouston, #cateringatlanta, #smallcaterer, #cateringbusiness, #foodcatering, and the city-specific versions. Identify operators who: post frequently (active business), have 500-5,000 followers (small but real), have no link in bio or a Bookbee/Google Form link (using tools we replace), are not already using enterprise software (no CaterZen branding visible).

DM script: "Hi [name], I've been following your page and love your food. I'm building a tool for small catering operators that replaces Bookbee and the notebook chaos - one link for inquiries, CRM that actually works, quotes that collect deposits automatically. I'm looking for 5 caterers to try it for free and give me honest feedback. Is this something you'd want to see?" Keep it short. No pitch decks. No demo links. Just a conversation.

**Source 3: Catering Facebook groups (3-4 operators)**
Groups like "Catering Business Owners," "Food Entrepreneurs Network," "Black Caterers United," and regional catering groups. Provide genuine value first (answer questions about quoting, share advice). After 2-3 helpful posts, make a soft post: "I'm building a tool for operators who are still using Bookbee and a notebook. Looking for 5 people to beta test it free. DM me if interested."

**Source 4: Referral from first 3 operators (2-3 operators)**
Caterers know other caterers. After 2 weeks, ask each beta operator: "Do you know another caterer who would benefit from this? We'll give you both a free month for each referral."

### Onboarding Each of the First 10

**Before the call:**
- Ask for: current tools they pay for, approximate number of events per month, whether they have a way to take online payments today, their Instagram handle.
- Review their Instagram. Note how they currently handle inquiries (link in bio? just DM?). Know their business before the call.

**The 30-minute onboarding call:**

Minutes 0-5: Listen. "Walk me through what happens when someone DMs you asking about catering." Let them describe their current workflow in detail. Take notes. Reflect back: "So you're losing leads in DMs and you're not collecting deposits because the conversation is too casual. Is that right?"

Minutes 5-10: Show the intake form. Share screen or send them the link to a demo intake form. Watch them fill it out. Ask: "Does this capture everything you need to write a quote?"

Minutes 10-20: Build a real quote together. Ask them to describe their most common event type. Enter it live in the platform. Add their actual menu items. Send the quote to their own email address so they see what the client sees.

Minutes 20-25: Enter their top 5 clients. Get name and phone or email. Enter them in CaterFlow. Now they have a real CRM.

Minutes 25-30: Set up their intake link. Walk them through putting it in their Instagram bio. Do it together on the call if possible. Explain: "From now on, every DM that asks about catering, you reply with: 'Here is the link to request a quote: [link]. Fill this out and I'll send you pricing within 24 hours.'"

**After the call:**
- Send a follow-up text (not email): "Great talking with you. Your intake link is [link]. Here's the one thing to do today: put that link in your Instagram bio. That's it. Text me if anything breaks."
- Available via text for 2 weeks. Respond to support questions within 2 hours during business hours.

### What We Learn From the First 10

After 4 weeks, answer these questions from observation and conversations:

1. Did operators actually share their intake link? If not, why not? (resistance = "it feels weird to redirect DMs to a form")
2. Did clients actually fill out the form? What was the completion rate?
3. Did operators build quotes in the platform, or did they still text/DM quotes? What stopped them?
4. How many collected deposits? Did Stripe friction stop any of them?
5. Which screen confused them most? (ask them directly)
6. What did they wish the platform could do that it cannot?
7. Of the 10 operators, how many cancelled Bookbee or said they plan to?
8. At $99/month, what was the reaction? Did any refuse to pay? Did any pay without hesitation?

These answers determine everything about Week 11 onwards.

---

## Part 7: Success Metrics for Week 12

Week 12 is 2 weeks post-launch (assuming launch at end of Week 10). These are the metrics that prove the MVP is working. If any red metric is missed, the team stops adding features and fixes the underlying problem first.

### Green Zone (MVP is working)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Operators on platform | 10 | Count of active accounts |
| Operators who shared intake link | 8 of 10 (80%) | Operator reports or intake form submissions visible |
| Inquiries received via intake form | 30+ total across all operators | Inquiry table count |
| Quotes sent via platform | 20+ total | Quote table, status = Sent |
| Deposits collected via Stripe | 10+ payments | Stripe dashboard |
| Operators who cancelled Bookbee | 5 of 10 (50%) | Operator self-report in weekly check-in |
| Operators who said "I don't use my notebook anymore" | 4 of 10 (40%) | Operator self-report |
| Operator NPS (asked directly: "How likely to recommend on 1-10?") | Average 8.0+ | Weekly check-in question |
| Platform uptime | 99%+ | UptimeRobot |
| Time from inquiry to quote sent (measured for tracked events) | Under 4 hours | Timestamp difference between inquiry created and quote sent |

### Yellow Zone (investigate, do not panic)

| Metric | Concern Threshold |
|--------|-------------------|
| Operators who shared intake link | Below 6 of 10 - means intake link concept has resistance |
| Clients who completed the form after receiving the link | Below 60% completion rate - form is too long or confusing |
| Quotes sent per operator per week | Below 2 - operators are not building quotes in the platform |
| Deposit collection via Stripe | Below 5 payments - Stripe onboarding friction is too high |

### Red Zone (stop and fix before continuing)

| Metric | Critical Failure Threshold |
|--------|---------------------------|
| Operators still active at Week 12 | Below 7 of 10 (churn above 30%) |
| Stripe payment failures | Any unresolved payment failure |
| Data loss events | Any (zero tolerance) |
| Operators who say "I'll never cancel Bookbee for this" | 4 or more of 10 |

### The One Number That Matters Most

**By Week 12, at least 5 of the 10 operators must have explicitly said "I cancelled Bookbee" or "I'm going to cancel it this month."**

If this does not happen, we do not have product-market fit. We have a product that is nice to use alongside their existing tools, which is not the mission.

If it does happen, we have the evidence to go find operators 11-50.

---

## Part 8: Phase Roadmap Beyond MVP

The MVP proves one workflow. The roadmap expands it in the sequence validated by Jobber, HouseCall Pro, and ServiceTitan's playbooks.

### Phase 2 (Months 3-5, after MVP validation)

**Trigger to start Phase 2:** 10+ operators on platform, 80%+ retention, at least 5 Bookbee cancellations confirmed.

Features (in priority order, to be re-ranked based on operator demand data from first 10):

1. **Automated payment reminders** - 3-day and 7-day overdue reminders sent automatically. Reduces cash flow gap without operator chasing clients.
2. **Re-booking prompts** - 60-day post-event automated email to client: "It has been 60 days since your event. Would you like to book again?" One email. No spam sequence.
3. **Google Calendar sync** - Events automatically appear in operator's Google Calendar when a booking is confirmed.
4. **Employee time tracking** - Simple clock-in/clock-out. Employees receive a text with a link to clock in when they arrive at the event. Clock-out same way. Hours tagged to the event record. Monthly hours report by employee.
5. **Payroll export** - Export hours report as CSV compatible with Gusto and Square Payroll. One-click export from the platform.

Pricing moves from $99 to $149/month when Phase 2 features are live.

### Phase 3 (Months 6-9)

**Trigger:** 50+ operators on platform, Phase 2 features used by 60%+ of operators.

1. **SMS intake** - Operator gets a dedicated phone number (via Twilio). When a client texts it, they receive an auto-reply with the intake form link. Operator is notified in the platform. Solves the "some customers just text" problem without requiring the operator to train clients to use the form.
2. **Automated post-event review request** - 48 hours after event marked complete, client receives: "We loved serving you. Would you mind leaving us a quick review? [Google review link]." One message. No follow-up if no response.
3. **Referral link tracking** - "How did you hear about us?" becomes a trackable referral link. Operator can send a personalized link to past clients: "Share this with friends. When they book, you get a $25 credit on your next event."
4. **Multi-user team accounts** - Operator can invite a co-operator or assistant. Both can log in. Same account, same data.

### Phase 4 (Months 9-12)

1. **Client portal** - Clients can log in with their phone number to see past events, download invoices, and submit new inquiries with their info pre-filled.
2. **Online ordering portal** - Operator can publish a menu. Clients can browse and place orders directly. Operator reviews and accepts before confirming.
3. **Loyalty points** - Simple earn-and-redeem. $1 spent = 1 point. 500 points = $25 credit on next booking. Operator controls the earn/redeem rates.

Loyalty and online ordering are Phase 4 because the data from Phases 2 and 3 will determine whether operators' clients are actually repeat customers at a frequency that makes loyalty mechanics worthwhile. Building loyalty for an operator who does 3 events per client per year is wasted effort. Building it for one who does 12 is transformative.

---

## Appendix A: The Demo Scenario (End-to-End)

This is the walkthrough for sales conversations and onboarding calls. The scenario uses Maria and Jasmine from Phase 3 personas.

**The setup:** Maria runs Maria's Kitchen in Houston. She just signed up for CaterFlow 5 minutes ago. Her business name is entered. She has her intake link. She has not connected Stripe yet.

**Step 1 - Inquiry arrives (2 minutes)**
Maria texts Jasmine: "I got your DM about the birthday party! Here is the link to request a quote: caterflow.app/book/marias-kitchen. Fill it out and I'll get back to you within 24 hours."

Jasmine opens the link on her phone. She fills in: her name, phone, email. Then: August 12, 4pm, 35 guests, 1847 Willow Creek Dr, Katy TX. Then: birthday party, full service, no dietary restrictions, budget $600-$1,000. Then: Instagram for referral source, notes "Caribbean food please, and can you do a cocktail hour setup?"

She submits. Confirmation screen: "We received your inquiry. Expect a response within 24 hours."

Maria's phone buzzes (email notification): "New inquiry - Jasmine Rodriguez - Birthday Party - Aug 12 - 35 guests - Katy TX."

**Step 2 - Quote built (3 minutes)**
Maria opens CaterFlow on her phone. She sees Jasmine's inquiry card in the queue. She taps it. All details are visible - no need to DM back and forth.

She taps "Create Quote." The quote builder opens with August 12, 35 guests, Jasmine Rodriguez, and the Katy TX address already filled in.

She adds line items: Jerk Chicken (1 platter, $320), Rice and Peas (1 pan, $80), Coleslaw (1 bowl, $45), Plantains (1 tray, $35), Cocktail Hour Bites (1 package, $120). Subtotal: $600. She adds Travel Fee ($120). Tax: 0% (she does not charge tax in Texas for catering). Total: $720. Deposit: 30% = $216.

She taps Preview. Sees a clean quote with her business name, Jasmine's event details, and the line-item breakdown. Looks professional.

She taps Send. Quote emailed to Jasmine.

**Step 3 - Acceptance and deposit (2 minutes)**
Jasmine receives the email. Clicks the link. Sees the quote. She thinks "wow, this is professional." She taps "Accept Quote."

Maria has not set up Stripe yet, so Jasmine sees: "To confirm your booking, please send a $216 deposit to Maria's Kitchen via Venmo @marias-kitchen or Zelle (713-555-0142). Reply to this email once sent."

Jasmine sends the Venmo payment. She replies to the email.

Maria receives the Venmo notification. She opens CaterFlow, goes to the quote, taps "Mark Deposit Received." The booking is confirmed. The event appears in her inquiry queue as "Booked."

**Step 4 - After the event (2 minutes)**
August 13. Maria taps "Mark Event Complete" on the Jasmine Rodriguez booking.

Balance invoice auto-generates for $504. Email sent to Jasmine: "Your balance of $504 is due. [Pay Here]." (Pay Here shows payment instructions since Stripe is not connected.)

Jasmine Venmoes the balance. Maria marks it paid.

**Total time for Maria: under 10 minutes to manage a $720 booking from inquiry to paid.**

**What changed from before CaterFlow:** Previously this took 3-4 days of back-and-forth DMs and texts, a notebook entry, a manual Bookbee invoice, and a follow-up text to collect the balance. All replaced by 10 minutes across 3 sessions.

**The natural next step in the demo:** "Now watch what happens when Jasmine books again in 6 months. Maria opens CaterFlow, searches Jasmine, sees her full history: 35 guests, Caribbean menu, Katy TX, $720 last time. She knows exactly what to quote. She sends a quote in 3 minutes. She never opens the notebook."

---

## Appendix B: Tech Stack Decision Log

Every decision here is final for MVP. Do not revisit during the 10-week build. If something breaks this constraint, log it and revisit after beta.

| Decision | Choice | Why | Do Not Use |
|----------|--------|-----|------------|
| Framework | Next.js 14 (App Router) | Full-stack, Vercel deployment, RSC reduce client bundle | Remix, SvelteKit (team expertise), plain React (need API routes) |
| Database | Supabase | PostgreSQL + Auth + Storage in one service, RLS for data isolation, generous free tier | PlanetScale (MySQL, no RLS), Firebase (NoSQL wrong shape), raw Postgres on Railway (more ops work) |
| Auth | Supabase Magic Link | No password to forget, frictionless for mobile-first users | Clerk (additional cost), NextAuth (more configuration), passwords (operators forget them) |
| Styling | Tailwind CSS | Rapid UI, no CSS files to maintain | styled-components, CSS modules, Material UI (too opinionated) |
| Email | Resend | Simple API, good deliverability, generous free tier, React Email for templates | SendGrid (overkill), Mailgun (less friendly API), SES (complex setup) |
| Payments | Stripe | Industry standard, Stripe Connect handles operator payouts, Stripe Checkout handles PCI | Square (worse developer experience), PayPal (poor UX), Braintree |
| PDF | react-pdf | Renders PDFs in Node.js, no headless browser needed for MVP | Puppeteer (more infra), jsPDF (layout limitations), external PDF service |
| Deployment | Vercel | Zero-config Next.js, automatic previews per branch, global CDN | Railway (more ops work for this framework), self-hosted |
| Monitoring | UptimeRobot (free) | Checks uptime every 5 minutes, free, immediate | PagerDuty (overkill for 10 operators), no monitoring (not acceptable) |

---

## Appendix C: Pricing Summary

| Tier | Price | Includes | Does Not Include |
|------|-------|----------|-----------------|
| MVP | $99/month | Intake form, CRM, quote builder, invoicing, Stripe payments or manual payment tracking, referral source capture | Time tracking, payroll export, automated reminders, SMS, loyalty |
| Pro | $149/month (Phase 2) | Everything in MVP + employee time tracking, payroll export, automated payment reminders, re-booking prompts, Google Calendar sync | SMS intake, loyalty points, online ordering |

**Infrastructure cost per operator (amortized at 50+ operators):**
- Vercel Pro: $20/month (shared)
- Supabase Pro: $25/month (shared)
- Resend: free up to 3,000 emails/month, $20/month above that
- Stripe: 2.9% + $0.30 per transaction (passed through; no platform cost)
- Total: ~$50/month shared across all operators

**Gross margin at 50 operators:**
- Revenue: $99 x 50 = $4,950/month
- Infrastructure: ~$50/month
- Gross margin: $4,900/month (99%)

**Note:** These margins compress with paid acquisition. The first 50 operators are acquired via founder-led sales (near-zero CAC). Once paid acquisition begins, CAC payback at $99/month with $49/month margin (after scaling infrastructure costs) is approximately 4-6 months. This is viable for bootstrapped growth. It is not viable for VC-funded rapid scaling.

---

*Phase 6 MVP Strategy complete. All 6 phases done. docs/mvp-plan.md is the final deliverable.*
