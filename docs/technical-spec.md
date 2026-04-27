# CaterFlow Technical Specification

**Version:** 1.0
**Client:** Heavenly Kitchen (@heav.enly_kitchen)
**Timeline:** 10 weeks
**Stack:** Next.js 14 + Supabase + Stripe + Resend

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [API Endpoints](#2-api-endpoints)
3. [Screen Specifications](#3-screen-specifications)
4. [Implementation Tickets](#4-implementation-tickets)

---

## 1. Database Schema

### Supabase DDL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- OPERATORS (business accounts)
-- ============================================
CREATE TABLE operators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    phone TEXT,
    logo_url TEXT,
    stripe_account_id TEXT,
    stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
    venmo_handle TEXT,
    zelle_info TEXT,
    cashapp_handle TEXT,
    default_deposit_percent INTEGER DEFAULT 30,
    default_tax_rate DECIMAL(5,2) DEFAULT 0,
    quote_expiration_days INTEGER DEFAULT 7,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENTS (customers of operators)
-- ============================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    source TEXT, -- 'instagram', 'facebook', 'referral', 'google', 'text', 'other'
    referred_by_client_id UUID REFERENCES clients(id),
    dietary_restrictions JSONB DEFAULT '[]',
    preferences JSONB DEFAULT '{}',
    notes TEXT,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    event_count INTEGER DEFAULT 0,
    last_event_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(operator_id, email),
    UNIQUE(operator_id, phone)
);

-- ============================================
-- INQUIRIES (intake form submissions)
-- ============================================
CREATE TYPE inquiry_status AS ENUM ('new', 'viewed', 'quote_sent', 'booked', 'declined');

CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    status inquiry_status DEFAULT 'new',
    event_type TEXT, -- 'birthday', 'wedding', 'corporate', 'quinceañera', 'graduation', 'other'
    event_date DATE NOT NULL,
    event_time TIME,
    guest_count INTEGER NOT NULL,
    location_address TEXT,
    service_type TEXT, -- 'drop_off', 'drop_off_setup', 'full_service'
    budget_range TEXT, -- 'under_300', '300_600', '600_1000', '1000_2000', 'over_2000'
    dietary_restrictions JSONB DEFAULT '[]',
    referral_source TEXT, -- 'instagram', 'facebook', 'referral', 'google', 'text', 'other'
    additional_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENTS (confirmed bookings)
-- ============================================
CREATE TYPE event_status AS ENUM ('confirmed', 'in_progress', 'completed', 'cancelled');

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    inquiry_id UUID REFERENCES inquiries(id),
    status event_status DEFAULT 'confirmed',
    event_date DATE NOT NULL,
    event_time TIME,
    guest_count INTEGER NOT NULL,
    location_address TEXT,
    service_type TEXT,
    total_value DECIMAL(10,2) DEFAULT 0,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT FALSE,
    balance_due DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUOTES
-- ============================================
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');

CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id),
    inquiry_id UUID REFERENCES inquiries(id),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    status quote_status DEFAULT 'draft',
    token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    subtotal DECIMAL(10,2) DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    deposit_percent INTEGER DEFAULT 30,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    expires_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MENU ITEMS (saved items for quick quoting)
-- ============================================
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    default_price DECIMAL(10,2),
    unit TEXT DEFAULT 'each', -- 'each', 'per_person', 'pan', 'tray'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUOTE LINE ITEMS
-- ============================================
CREATE TABLE quote_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES
-- ============================================
CREATE TYPE invoice_status AS ENUM ('pending', 'sent', 'partially_paid', 'paid', 'overdue');

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotes(id),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    status invoice_status DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    deposit_credited DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    due_date DATE,
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TYPE payment_type AS ENUM ('deposit', 'balance', 'full');
CREATE TYPE payment_method AS ENUM ('stripe', 'venmo', 'zelle', 'cashapp', 'cash', 'check', 'other');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id),
    quote_id UUID REFERENCES quotes(id),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    payment_type payment_type NOT NULL,
    payment_method payment_method NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Operators can only see their own data
CREATE POLICY "Operators see own data" ON operators
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Operators see own clients" ON clients
    FOR ALL USING (operator_id = auth.uid());

CREATE POLICY "Operators see own inquiries" ON inquiries
    FOR ALL USING (operator_id = auth.uid());

CREATE POLICY "Operators see own events" ON events
    FOR ALL USING (operator_id = auth.uid());

CREATE POLICY "Operators see own quotes" ON quotes
    FOR ALL USING (operator_id = auth.uid());

CREATE POLICY "Operators see own quote_lines" ON quote_lines
    FOR ALL USING (quote_id IN (SELECT id FROM quotes WHERE operator_id = auth.uid()));

CREATE POLICY "Operators see own menu_items" ON menu_items
    FOR ALL USING (operator_id = auth.uid());

CREATE POLICY "Operators see own invoices" ON invoices
    FOR ALL USING (operator_id = auth.uid());

CREATE POLICY "Operators see own payments" ON payments
    FOR ALL USING (operator_id = auth.uid());

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_clients_operator ON clients(operator_id);
CREATE INDEX idx_clients_email ON clients(operator_id, email);
CREATE INDEX idx_clients_phone ON clients(operator_id, phone);
CREATE INDEX idx_inquiries_operator ON inquiries(operator_id);
CREATE INDEX idx_inquiries_status ON inquiries(operator_id, status);
CREATE INDEX idx_inquiries_date ON inquiries(operator_id, event_date);
CREATE INDEX idx_events_operator ON events(operator_id);
CREATE INDEX idx_events_date ON events(operator_id, event_date);
CREATE INDEX idx_quotes_operator ON quotes(operator_id);
CREATE INDEX idx_quotes_token ON quotes(token);
CREATE INDEX idx_invoices_token ON invoices(token);
CREATE INDEX idx_operators_slug ON operators(slug);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_operators_updated_at BEFORE UPDATE ON operators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate slug from business name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;
```

---

## 2. API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/magic-link` | Send magic link email |
| GET | `/api/auth/callback` | Handle magic link callback |
| POST | `/api/auth/logout` | Log out operator |
| GET | `/api/auth/me` | Get current operator |

### Operators

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/operators` | Create operator (on first login) |
| GET | `/api/operators/me` | Get current operator profile |
| PATCH | `/api/operators/me` | Update operator profile |
| POST | `/api/operators/me/logo` | Upload logo |

### Public Intake Form

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/operators/[slug]` | Get operator info for intake form |
| POST | `/api/public/inquiries` | Submit intake form |

### Inquiries

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inquiries` | List all inquiries (filterable) |
| GET | `/api/inquiries/[id]` | Get inquiry detail |
| PATCH | `/api/inquiries/[id]` | Update inquiry status |
| POST | `/api/inquiries/manual` | Create manual inquiry |

### Clients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients (searchable) |
| GET | `/api/clients/[id]` | Get client detail |
| POST | `/api/clients` | Create manual client |
| PATCH | `/api/clients/[id]` | Update client |

### Quotes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quotes` | List all quotes |
| GET | `/api/quotes/[id]` | Get quote detail |
| POST | `/api/quotes` | Create quote |
| PATCH | `/api/quotes/[id]` | Update quote |
| POST | `/api/quotes/[id]/send` | Send quote email |
| POST | `/api/quotes/[id]/lines` | Add line item |
| PATCH | `/api/quotes/[id]/lines/[lineId]` | Update line item |
| DELETE | `/api/quotes/[id]/lines/[lineId]` | Remove line item |

### Public Quote View

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/quotes/[token]` | Get quote by token |
| POST | `/api/public/quotes/[token]/accept` | Accept quote |

### Payments (Stripe)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stripe/connect` | Start Stripe Connect onboarding |
| GET | `/api/stripe/connect/callback` | Handle Connect callback |
| POST | `/api/stripe/checkout` | Create checkout session for deposit |
| POST | `/api/webhooks/stripe` | Handle Stripe webhooks |

### Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List all invoices |
| GET | `/api/invoices/[id]` | Get invoice detail |
| POST | `/api/invoices/[id]/mark-paid` | Mark as paid manually |
| GET | `/api/invoices/[id]/pdf` | Download PDF |

### Public Invoice View

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/invoices/[token]` | Get invoice by token |

### Menu Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu-items` | List menu items |
| POST | `/api/menu-items` | Create menu item |
| PATCH | `/api/menu-items/[id]` | Update menu item |
| DELETE | `/api/menu-items/[id]` | Archive menu item |

---

## 3. Screen Specifications

### 3.1 Public: Intake Form (`/book/[slug]`)

**4 screens, no auth required**

#### Screen 1: Contact Info
- First name (required, text)
- Last name (required, text)
- Phone (required, tel input with formatting)
- Email (required, email validation)
- Progress: "Step 1 of 4"
- Button: "Next"

#### Screen 2: Event Basics
- Event date (required, date picker, must be future)
- Approximate start time (optional, time picker)
- Guest count (required, number, min 1)
- Event location (required, text/address)
- Progress: "Step 2 of 4"
- Buttons: "Back", "Next"

#### Screen 3: Service Details
- Event type (required, dropdown):
  - Birthday Party
  - Wedding
  - Corporate Event
  - Quinceañera
  - Graduation
  - Other
- Service style (required, dropdown):
  - Drop-off Only
  - Drop-off + Setup
  - Full Service with Staff
- Dietary restrictions (optional, checkboxes):
  - Nut-free
  - Gluten-free
  - Vegan
  - Vegetarian
  - No Pork
  - Halal
  - Kosher
  - Other (text field)
- Budget range (optional, dropdown):
  - Under $300
  - $300 - $600
  - $600 - $1,000
  - $1,000 - $2,000
  - Over $2,000
- Progress: "Step 3 of 4"
- Buttons: "Back", "Next"

#### Screen 4: Final Details
- How did you hear about us? (required, dropdown):
  - Instagram
  - Facebook
  - Referral from a friend
  - Google
  - Text from [Business Name]
  - Other
- Additional notes (optional, textarea, 500 char max)
- Progress: "Step 4 of 4"
- Buttons: "Back", "Submit Request"

#### Confirmation Screen
- Checkmark icon
- "Thank you! We received your inquiry."
- "Expect a response within 24 hours."
- Business name displayed

### 3.2 Operator: Login (`/login`)

- Email input
- Button: "Send Magic Link"
- Success message: "Check your email for the login link"

### 3.3 Operator: Onboarding (`/onboarding`)

#### Screen 1: Welcome
- "Welcome to CaterFlow"
- "Let's set up your account in 60 seconds"
- Button: "Get Started"

#### Screen 2: Business Info
- Business name (required)
- Preview of generated slug: "Your booking link: caterflow.app/book/heavenly-kitchen"
- Button: "Continue to Dashboard"

### 3.4 Operator: Dashboard (`/dashboard`)

**Layout:**
- Header: Business name, Settings icon
- Main content area

**Components:**
- **Intake Link Card**
  - "Share this link to receive inquiries"
  - `caterflow.app/book/[slug]`
  - Copy button
- **Stats Row**
  - New Inquiries (count, links to /inquiries?status=new)
  - Pending Quotes (count)
  - Upcoming Events (count)
  - Revenue This Month (dollar amount)
- **Recent Inquiries** (last 5)
  - Client name, event date, guest count, status badge
  - "View All" link

### 3.5 Operator: Inquiry List (`/inquiries`)

**Layout:**
- Filter tabs: All, New, Quote Sent, Booked, Declined
- Search bar (by client name)
- Inquiry cards in list

**Inquiry Card:**
- Client name (bold)
- Event date | Guest count | Event type
- Status badge (color-coded)
- Received timestamp
- Tap to open detail

### 3.6 Operator: Inquiry Detail (`/inquiries/[id]`)

**Layout:**
- Back button
- Client name (header)
- Status badge

**Sections:**
- **Event Details**
  - Date, Time, Guest count, Location
  - Event type, Service style
- **Contact Info**
  - Phone (tap to call), Email (tap to email)
  - Link to client record
- **Dietary Restrictions** (if any)
- **Budget Range** (if provided)
- **Referral Source**
- **Additional Notes** (if any)
- **Existing Client** (if repeat): "This client has booked X events totaling $Y"

**Actions:**
- "Create Quote" button (primary)
- "Decline" button (secondary)
- Status dropdown (New, Viewed, Quote Sent, Booked, Declined)

### 3.7 Operator: Client List (`/clients`)

**Layout:**
- Search bar (searches name, phone, email)
- "Add Client" button
- Client cards in list

**Client Card:**
- Name (bold)
- Phone | Email
- X events | $Y total
- Last event: [date]

### 3.8 Operator: Client Detail (`/clients/[id]`)

**Layout:**
- Back button
- Client name (header)
- Edit button

**Sections:**
- **Contact Info**
  - Name, Phone, Email, Address
- **Acquisition**
  - Source: Instagram (from first inquiry)
  - First inquiry: [date]
- **Stats**
  - Total events: X
  - Total revenue: $Y
  - Last event: [date]
- **Dietary Restrictions & Preferences**
- **Internal Notes** (editable textarea)
- **Event History**
  - List of all inquiries/events
  - Status, date, amount

**Actions:**
- "Create Inquiry" button (for manual booking)

### 3.9 Operator: Quote Builder (`/quotes/new` or `/quotes/[id]`)

**Layout:**
- Back button
- Auto-save indicator

**Header Section:**
- Client name (linked to client)
- Event date, Guest count, Location (if from inquiry)

**Line Items Section:**
- Table/List:
  - Description | Qty | Unit Price | Total | Delete
- "Add Line Item" button
- As user types description, show suggestions from menu items

**Fees & Discounts:**
- Additional Fees:
  - Label input | Amount input | Delete
  - "Add Fee" button
- Discount:
  - Label input | Amount input
  - (Only one discount allowed)

**Calculations:**
- Subtotal: $X
- Fees: +$Y
- Discount: -$Z
- Tax (W%): $T
- **Total: $N**

**Deposit Section:**
- Dropdown: No deposit, 25%, 30%, 50%, Custom
- If custom: amount input
- Deposit amount: $D
- Balance due: $B

**Notes Section:**
- Textarea: "Notes visible to client"

**Expiration:**
- Date picker (default: 7 days from today)

**Actions:**
- "Preview" button
- "Save Draft" button
- "Send Quote" button (primary)

### 3.10 Operator: Quote Preview (`/quotes/[id]/preview`)

**Shows exactly what client will see:**
- Business name/logo
- "Quote for [Client Name]"
- Event details
- Line items table
- Fees, tax, total
- Deposit amount, balance
- Notes
- Expiration date
- (Accept button shown but disabled in preview)

**Actions:**
- "Edit" button
- "Send to Client" button

### 3.11 Public: Quote View (`/q/[token]`)

**No auth required**

**Layout:**
- Business name/logo (if uploaded)
- "Quote for [Event Date]"

**Content:**
- Event details (date, location, guest count)
- Line items table
- Fees, discounts
- Tax
- **Total**
- Deposit required: $X
- Balance due after event: $Y
- Operator notes
- Expires: [date]

**Actions:**
- If Stripe connected: "Accept Quote & Pay Deposit ($X)" button
- If Stripe not connected: "Accept Quote" button

**After Accept (Stripe path):**
- Redirect to Stripe Checkout
- On success: Confirmation page

**After Accept (Manual path):**
- Show: "To confirm your booking, send $X deposit via:"
  - Venmo: @handle
  - Zelle: email/phone
  - CashApp: $handle
- "Once received, your event will be confirmed."

### 3.12 Operator: Invoice List (`/invoices`)

**Layout:**
- Filter tabs: All, Pending, Sent, Paid
- Invoice cards in list

**Invoice Card:**
- Client name
- Event date
- Amount due
- Status badge
- Sent date

### 3.13 Operator: Invoice Detail (`/invoices/[id]`)

**Layout:**
- Back button
- Status badge

**Content:**
- Client info
- Event info
- Line items (from quote)
- Deposit credited: -$X
- Balance due: $Y
- Due date
- Payment history

**Actions:**
- "Send Invoice" button
- "Mark as Paid" button (opens modal for payment method/notes)
- "Download PDF" button

### 3.14 Public: Invoice View (`/i/[token]`)

**Similar to quote view but:**
- Shows deposit already credited
- Shows balance due
- If Stripe: "Pay Balance" button
- If manual: payment instructions

### 3.15 Operator: Settings (`/settings`)

**Sections:**

**Business Info:**
- Business name (editable)
- Slug (editable, shows preview URL)
- Logo (upload/change)

**Payment Methods:**
- Stripe Connect status
  - If not connected: "Connect Stripe" button
  - If connected: "Connected" badge, account email
- Venmo handle (optional)
- Zelle info (optional)
- CashApp handle (optional)

**Defaults:**
- Default deposit % (dropdown: 25, 30, 50, custom)
- Default tax rate (number input)
- Quote expiration (number of days)

**Menu Items:**
- List of saved items
- Add/Edit/Archive buttons

**Account:**
- Email (read-only, shows current login)
- "Export All Data" button (downloads CSV)
- "Delete Account" button (confirmation required)

---

## 4. Implementation Tickets

### Week 1: Foundation

#### Ticket W1-1: Initialize Next.js Project
**Acceptance Criteria:**
- [ ] Next.js 14 with App Router
- [ ] TypeScript configured
- [ ] Tailwind CSS configured
- [ ] ESLint + Prettier configured
- [ ] `/app` directory structure created
- [ ] Deployed to Vercel (main branch auto-deploy)

**Estimate:** 0.5 days

#### Ticket W1-2: Supabase Setup
**Acceptance Criteria:**
- [ ] Supabase project created
- [ ] All tables created per DDL above
- [ ] RLS policies enabled and tested
- [ ] Indexes created
- [ ] Triggers created
- [ ] Environment variables documented in `.env.example`

**Estimate:** 1 day

#### Ticket W1-3: Supabase Client Configuration
**Acceptance Criteria:**
- [ ] `@supabase/supabase-js` installed
- [ ] Server-side client helper created
- [ ] Client-side client helper created
- [ ] Middleware for auth sessions configured

**Estimate:** 0.5 days

#### Ticket W1-4: Magic Link Authentication
**Acceptance Criteria:**
- [ ] `/login` page with email input
- [ ] POST `/api/auth/magic-link` sends email via Supabase
- [ ] `/api/auth/callback` handles redirect and creates session
- [ ] Session persists across page refreshes
- [ ] Logout clears session
- [ ] Works on mobile Safari and Chrome

**Estimate:** 1 day

#### Ticket W1-5: Basic Routing Structure
**Acceptance Criteria:**
- [ ] `/login` - public
- [ ] `/onboarding` - requires auth, no operator record yet
- [ ] `/dashboard` - requires auth + operator record
- [ ] `/inquiries` - requires auth
- [ ] `/clients` - requires auth
- [ ] `/settings` - requires auth
- [ ] `/book/[slug]` - public intake form
- [ ] Auth middleware redirects appropriately

**Estimate:** 0.5 days

#### Ticket W1-6: Operator Onboarding Flow
**Acceptance Criteria:**
- [ ] After first login, redirect to `/onboarding`
- [ ] Screen 1: Welcome message
- [ ] Screen 2: Business name input
- [ ] Auto-generate slug from business name
- [ ] Create operator record in database
- [ ] Redirect to dashboard on completion
- [ ] If operator record exists, skip onboarding

**Estimate:** 1 day

#### Ticket W1-7: Dashboard Skeleton
**Acceptance Criteria:**
- [ ] Dashboard shows business name in header
- [ ] Shows intake link with copy-to-clipboard
- [ ] Shows placeholder stats (all zeros)
- [ ] Shows "No inquiries yet" message
- [ ] Mobile-responsive layout

**Estimate:** 0.5 days

---

### Week 2: Intake Form

#### Ticket W2-1: Intake Form - Screen 1 (Contact)
**Acceptance Criteria:**
- [ ] `/book/[slug]` fetches operator by slug
- [ ] Shows operator business name
- [ ] First name, last name, phone, email inputs
- [ ] Phone input with formatting (xxx-xxx-xxxx)
- [ ] Email validation
- [ ] All fields required
- [ ] "Next" button advances to screen 2
- [ ] Mobile-first layout
- [ ] Progress indicator: "Step 1 of 4"

**Estimate:** 1 day

#### Ticket W2-2: Intake Form - Screen 2 (Event Basics)
**Acceptance Criteria:**
- [ ] Event date picker (no past dates)
- [ ] Time picker (optional)
- [ ] Guest count number input (min 1)
- [ ] Location/address text input
- [ ] Back/Next buttons
- [ ] Progress indicator: "Step 2 of 4"

**Estimate:** 0.5 days

#### Ticket W2-3: Intake Form - Screen 3 (Service Details)
**Acceptance Criteria:**
- [ ] Event type dropdown (6 options + other)
- [ ] Service style dropdown (3 options)
- [ ] Dietary restrictions checkboxes (8 options)
- [ ] "Other" checkbox reveals text input
- [ ] Budget range dropdown (5 options)
- [ ] Back/Next buttons
- [ ] Progress indicator: "Step 3 of 4"

**Estimate:** 0.5 days

#### Ticket W2-4: Intake Form - Screen 4 (Final Details)
**Acceptance Criteria:**
- [ ] Referral source dropdown (6 options)
- [ ] Additional notes textarea (500 char limit)
- [ ] Character counter
- [ ] Back/Submit buttons
- [ ] Progress indicator: "Step 4 of 4"

**Estimate:** 0.5 days

#### Ticket W2-5: Intake Form - Submission Logic
**Acceptance Criteria:**
- [ ] POST to `/api/public/inquiries`
- [ ] Create or update client record:
  - [ ] If email matches existing client → link to that client
  - [ ] If phone matches existing client → link to that client
  - [ ] Otherwise create new client
- [ ] Create inquiry record with all form data
- [ ] Update client's dietary_restrictions from form
- [ ] Return success response
- [ ] Show confirmation screen

**Estimate:** 1 day

#### Ticket W2-6: Intake Form - Operator Notification
**Acceptance Criteria:**
- [ ] Configure Resend with API key
- [ ] On inquiry creation, send email to operator
- [ ] Email subject: "New Inquiry - [Client Name] - [Event Date]"
- [ ] Email body: Client name, event date, guest count, event type, location
- [ ] Include link to inquiry in dashboard
- [ ] Email arrives within 60 seconds

**Estimate:** 0.5 days

#### Ticket W2-7: Intake Form - Mobile Testing
**Acceptance Criteria:**
- [ ] Tested on iPhone SE (375px width)
- [ ] Tested on iPhone 15 (390px width)
- [ ] Tested on Samsung Galaxy S23 (360px width)
- [ ] No horizontal scroll
- [ ] All touch targets ≥44px
- [ ] Form completable in <3 minutes
- [ ] Date picker works on iOS Safari
- [ ] Date picker works on Chrome Android

**Estimate:** 0.5 days

---

### Week 3: Inquiry Queue + Client Records

#### Ticket W3-1: Inquiry List Page
**Acceptance Criteria:**
- [ ] GET `/api/inquiries` returns operator's inquiries
- [ ] Filter by status (All, New, Quote Sent, Booked, Declined)
- [ ] Default sort: newest first
- [ ] Search by client name
- [ ] Each card shows: client name, event date, guest count, event type, status badge
- [ ] Status badges color-coded
- [ ] Tap card navigates to detail

**Estimate:** 1 day

#### Ticket W3-2: Inquiry Detail Page
**Acceptance Criteria:**
- [ ] GET `/api/inquiries/[id]` returns full inquiry with client
- [ ] Display all fields from intake form
- [ ] Display client contact info with tap-to-call/email
- [ ] If repeat client, show: "This client has booked X events ($Y)"
- [ ] Status dropdown to update status
- [ ] "Create Quote" button navigates to quote builder

**Estimate:** 1 day

#### Ticket W3-3: Client List Page
**Acceptance Criteria:**
- [ ] GET `/api/clients` returns operator's clients
- [ ] Search bar searches name, phone, email
- [ ] Results update as user types (debounced)
- [ ] Each card shows: name, phone, email, event count, total revenue
- [ ] "Add Client" button
- [ ] Tap card navigates to detail

**Estimate:** 0.5 days

#### Ticket W3-4: Client Detail Page
**Acceptance Criteria:**
- [ ] GET `/api/clients/[id]` returns client with all inquiries/events
- [ ] Display contact info
- [ ] Display source (referral_source from first inquiry)
- [ ] Display stats: total events, total revenue, last event date
- [ ] Display dietary restrictions
- [ ] Editable notes field (auto-save)
- [ ] List all inquiries/events chronologically
- [ ] "Create Inquiry" button for manual booking

**Estimate:** 1 day

#### Ticket W3-5: Manual Client Creation
**Acceptance Criteria:**
- [ ] POST `/api/clients` creates client
- [ ] Modal/form with: name, phone, email, notes
- [ ] Validate phone/email uniqueness for this operator
- [ ] Returns to client list with new client

**Estimate:** 0.5 days

#### Ticket W3-6: Manual Inquiry Creation
**Acceptance Criteria:**
- [ ] POST `/api/inquiries/manual` creates inquiry for existing client
- [ ] Form: event date, time, guest count, location, event type, service style, notes
- [ ] Pre-fills client info
- [ ] Creates inquiry linked to client
- [ ] Navigates to inquiry detail

**Estimate:** 0.5 days

---

### Week 4: Quote Builder (Part 1)

#### Ticket W4-1: Quote Data Model + API
**Acceptance Criteria:**
- [ ] POST `/api/quotes` creates quote
- [ ] GET `/api/quotes/[id]` returns quote with lines
- [ ] PATCH `/api/quotes/[id]` updates quote
- [ ] Quote auto-populates from inquiry (if inquiry_id provided)
- [ ] Quote calculates: subtotal, fees, discount, tax, total, deposit
- [ ] All money stored as cents, displayed as dollars

**Estimate:** 1 day

#### Ticket W4-2: Quote Builder - Line Items UI
**Acceptance Criteria:**
- [ ] Add line item: description, quantity, unit price
- [ ] Line total auto-calculates (qty × price)
- [ ] Edit any field inline
- [ ] Delete line item
- [ ] Drag to reorder (or up/down buttons on mobile)
- [ ] Subtotal updates in real-time

**Estimate:** 1.5 days

#### Ticket W4-3: Quote Builder - Fees Section
**Acceptance Criteria:**
- [ ] "Add Fee" adds fee row
- [ ] Fee row: label input, amount input
- [ ] Multiple fees allowed
- [ ] Delete fee
- [ ] Fees total displayed

**Estimate:** 0.5 days

#### Ticket W4-4: Quote Builder - Discount + Tax
**Acceptance Criteria:**
- [ ] Single discount: label + amount
- [ ] Tax rate input (percentage)
- [ ] Tax calculated on (subtotal + fees - discount)
- [ ] Tax amount displayed
- [ ] Total = subtotal + fees - discount + tax

**Estimate:** 0.5 days

#### Ticket W4-5: Quote Builder - Deposit Section
**Acceptance Criteria:**
- [ ] Deposit dropdown: None, 25%, 30%, 50%, Custom
- [ ] Custom shows amount input
- [ ] Deposit amount calculated from total
- [ ] Balance due = total - deposit
- [ ] Both displayed

**Estimate:** 0.5 days

#### Ticket W4-6: Quote Builder - Auto-Save
**Acceptance Criteria:**
- [ ] Quote saved as draft every 30 seconds
- [ ] Show "Saving..." / "Saved" indicator
- [ ] Navigate away → draft persists
- [ ] Return to draft → all data intact

**Estimate:** 0.5 days

---

### Week 5: Quote Builder (Part 2) + Send

#### Ticket W5-1: Quote Preview Modal
**Acceptance Criteria:**
- [ ] "Preview" button opens full-screen preview
- [ ] Shows exactly what client will see
- [ ] Business name/logo at top
- [ ] Event details
- [ ] Line items table
- [ ] Fees, discount, tax, total
- [ ] Deposit + balance
- [ ] Notes
- [ ] Expiration date
- [ ] Close button returns to builder

**Estimate:** 1 day

#### Ticket W5-2: Quote Email Template
**Acceptance Criteria:**
- [ ] React Email template created
- [ ] Subject: "[Business Name] - Your Catering Quote for [Event Date]"
- [ ] Body: Brief summary, link to view full quote
- [ ] Mobile-friendly HTML
- [ ] Plain text fallback

**Estimate:** 0.5 days

#### Ticket W5-3: Send Quote Flow
**Acceptance Criteria:**
- [ ] POST `/api/quotes/[id]/send`
- [ ] Sends email via Resend
- [ ] Updates quote status to 'sent'
- [ ] Sets sent_at timestamp
- [ ] Shows success toast
- [ ] Updates inquiry status to 'quote_sent'

**Estimate:** 0.5 days

#### Ticket W5-4: Public Quote View Page
**Acceptance Criteria:**
- [ ] `/q/[token]` accessible without login
- [ ] GET `/api/public/quotes/[token]` returns quote data
- [ ] Display all quote details (matches preview)
- [ ] "Accept Quote" button visible
- [ ] If expired, show "This quote has expired"
- [ ] Track viewed_at on first view

**Estimate:** 1 day

#### Ticket W5-5: Menu Item Suggestions
**Acceptance Criteria:**
- [ ] After 5 quotes created, prompt: "Save these items for faster quoting?"
- [ ] If yes, create menu_items from recent quote lines
- [ ] In quote builder, show dropdown suggestions as user types
- [ ] Selecting suggestion fills description + price
- [ ] Can still free-type

**Estimate:** 1 day

#### Ticket W5-6: Email Deliverability Setup
**Acceptance Criteria:**
- [ ] Dedicated sending domain configured (e.g., mail.caterflow.app)
- [ ] SPF record added
- [ ] DKIM record added
- [ ] DMARC record added
- [ ] Verified working in Resend dashboard
- [ ] Test emails land in inbox for Gmail, Outlook, Apple Mail

**Estimate:** 0.5 days

---

### Week 6: Payment Flow (Stripe)

#### Ticket W6-1: Stripe Connect Onboarding
**Acceptance Criteria:**
- [ ] POST `/api/stripe/connect` creates Connect account (Express)
- [ ] Returns onboarding URL
- [ ] Operator redirected to Stripe
- [ ] `/api/stripe/connect/callback` handles return
- [ ] Save stripe_account_id to operator
- [ ] Set stripe_onboarding_complete when charges_enabled

**Estimate:** 1 day

#### Ticket W6-2: Settings - Stripe Section
**Acceptance Criteria:**
- [ ] If not connected: "Connect Stripe" button
- [ ] If connected but incomplete: "Complete Stripe Setup" button
- [ ] If connected and complete: Show "Connected" badge + account email
- [ ] Refresh status on page load

**Estimate:** 0.5 days

#### Ticket W6-3: Quote Accept - Stripe Path
**Acceptance Criteria:**
- [ ] If operator has Stripe connected:
- [ ] "Accept Quote & Pay Deposit" button
- [ ] POST `/api/stripe/checkout` creates Checkout session
- [ ] Deposit amount charged
- [ ] Application fee collected (optional for MVP)
- [ ] Redirect to Stripe Checkout
- [ ] Success URL returns to confirmation

**Estimate:** 1 day

#### Ticket W6-4: Stripe Webhook Handler
**Acceptance Criteria:**
- [ ] POST `/api/webhooks/stripe`
- [ ] Verify webhook signature
- [ ] Handle `checkout.session.completed`:
  - [ ] Mark quote as accepted
  - [ ] Create event record (status: confirmed)
  - [ ] Create payment record
  - [ ] Update inquiry status to 'booked'
  - [ ] Send confirmation email to client
  - [ ] Send notification email to operator

**Estimate:** 1 day

#### Ticket W6-5: Quote Accept - Manual Path
**Acceptance Criteria:**
- [ ] If operator has no Stripe:
- [ ] "Accept Quote" button
- [ ] POST `/api/public/quotes/[token]/accept`
- [ ] Show page with payment instructions
- [ ] Display operator's Venmo/Zelle/CashApp handles
- [ ] "Once received, your event will be confirmed"
- [ ] Send email to operator: "[Client] accepted quote, awaiting deposit"

**Estimate:** 0.5 days

#### Ticket W6-6: Manual Deposit Marking
**Acceptance Criteria:**
- [ ] On inquiry detail (after quote accepted):
- [ ] "Mark Deposit Received" button
- [ ] Modal: payment method dropdown, amount, notes
- [ ] Creates payment record
- [ ] Creates event record (confirmed)
- [ ] Updates inquiry status to 'booked'
- [ ] Sends confirmation email to client

**Estimate:** 0.5 days

---

### Week 7: Invoice + Manual Payment

#### Ticket W7-1: Mark Event Complete Flow
**Acceptance Criteria:**
- [ ] On event detail: "Mark Event Complete" button
- [ ] Updates event status to 'completed'
- [ ] Auto-generates invoice:
  - [ ] Amount = quote total
  - [ ] Deposit credited
  - [ ] Balance due = total - deposit
  - [ ] Due date = 7 days from now
- [ ] Sends balance due email to client

**Estimate:** 1 day

#### Ticket W7-2: Invoice Detail Page
**Acceptance Criteria:**
- [ ] GET `/api/invoices/[id]` returns invoice with event/quote
- [ ] Display event summary
- [ ] Display line items (from quote)
- [ ] Deposit credited: -$X
- [ ] Balance due: $Y
- [ ] Status badge
- [ ] Payment history list

**Estimate:** 0.5 days

#### Ticket W7-3: Invoice Email Template
**Acceptance Criteria:**
- [ ] Subject: "[Business Name] - Balance Due for [Event Date]"
- [ ] Body: Event summary, balance amount, due date, pay link
- [ ] Mobile-friendly

**Estimate:** 0.5 days

#### Ticket W7-4: Public Invoice View
**Acceptance Criteria:**
- [ ] `/i/[token]` accessible without login
- [ ] Display invoice details
- [ ] If Stripe: "Pay Balance" button → Checkout
- [ ] If manual: payment instructions
- [ ] If paid: "Paid in Full" message

**Estimate:** 0.5 days

#### Ticket W7-5: Invoice Balance Payment (Stripe)
**Acceptance Criteria:**
- [ ] "Pay Balance" creates Checkout session for balance_due
- [ ] On success: update invoice status to 'paid'
- [ ] Record payment
- [ ] Update client total_revenue
- [ ] Send receipt email

**Estimate:** 0.5 days

#### Ticket W7-6: Manual Balance Payment
**Acceptance Criteria:**
- [ ] On invoice detail: "Mark as Paid" button
- [ ] Modal: payment method, amount (default: balance), notes
- [ ] Creates payment record
- [ ] Updates invoice status
- [ ] Updates client total_revenue

**Estimate:** 0.5 days

#### Ticket W7-7: Invoice PDF Generation
**Acceptance Criteria:**
- [ ] GET `/api/invoices/[id]/pdf` generates PDF
- [ ] PDF shows: business info, client info, event date, line items, deposit, balance, due date
- [ ] Clean, professional layout
- [ ] Download works on mobile

**Estimate:** 1 day

---

### Week 8: Settings + Polish

#### Ticket W8-1: Settings - Business Info
**Acceptance Criteria:**
- [ ] Edit business name
- [ ] Edit slug (validate uniqueness)
- [ ] Show intake link preview
- [ ] Upload logo (Supabase Storage)
- [ ] Logo appears on quote/invoice pages

**Estimate:** 1 day

#### Ticket W8-2: Settings - Payment Methods
**Acceptance Criteria:**
- [ ] Venmo handle input
- [ ] Zelle info input (phone or email)
- [ ] CashApp handle input
- [ ] Save all fields
- [ ] These appear on manual payment pages

**Estimate:** 0.5 days

#### Ticket W8-3: Settings - Defaults
**Acceptance Criteria:**
- [ ] Default deposit % dropdown
- [ ] Default tax rate input
- [ ] Quote expiration days input
- [ ] All applied to new quotes

**Estimate:** 0.5 days

#### Ticket W8-4: Settings - Menu Items
**Acceptance Criteria:**
- [ ] List all menu items
- [ ] Add new item: name, category, price, unit
- [ ] Edit existing item
- [ ] Archive item (soft delete)
- [ ] Archived items hidden but data preserved

**Estimate:** 0.5 days

#### Ticket W8-5: Settings - Account
**Acceptance Criteria:**
- [ ] Display email (read-only)
- [ ] "Export All Data" button
- [ ] Exports CSV: clients, inquiries, events, quotes, payments
- [ ] "Delete Account" button with confirmation
- [ ] Soft delete (data retained 30 days)

**Estimate:** 0.5 days

#### Ticket W8-6: Mobile Optimization Pass
**Acceptance Criteria:**
- [ ] All pages tested at 375px, 390px, 360px widths
- [ ] No horizontal scroll anywhere
- [ ] All touch targets ≥44px
- [ ] Forms usable without zooming
- [ ] Bottom nav doesn't overlap content
- [ ] Modals scroll properly on small screens

**Estimate:** 1 day

#### Ticket W8-7: Error Handling
**Acceptance Criteria:**
- [ ] Supabase unreachable → friendly error message
- [ ] Stripe Checkout fails → retry option
- [ ] Email send fails → log error, show manual link
- [ ] Form validation errors highlighted
- [ ] 404 pages styled
- [ ] 500 errors logged to Sentry

**Estimate:** 0.5 days

#### Ticket W8-8: Edge Cases
**Acceptance Criteria:**
- [ ] Duplicate intake submission → merge to existing client
- [ ] Edit accepted quote → blocked with message
- [ ] Expired quote → "This quote has expired" + re-request option
- [ ] Double payment (manual + Stripe) → handle gracefully
- [ ] Slug change → 301 redirect from old URL

**Estimate:** 0.5 days

---

### Week 9: Beta Preparation

#### Ticket W9-1: PWA Configuration
**Acceptance Criteria:**
- [ ] manifest.json configured
- [ ] App icons (all sizes)
- [ ] Service worker registered
- [ ] "Add to Home Screen" works on iOS Safari
- [ ] "Add to Home Screen" works on Chrome Android
- [ ] Opens without browser chrome

**Estimate:** 1 day

#### Ticket W9-2: Stripe Live Mode
**Acceptance Criteria:**
- [ ] Switch from test to live keys
- [ ] Process $1 test payment (refund immediately)
- [ ] Webhooks pointed to production endpoint
- [ ] Webhook signature verified

**Estimate:** 0.5 days

#### Ticket W9-3: Production Checklist
**Acceptance Criteria:**
- [ ] All env vars set in Vercel
- [ ] Database has production data (empty tables)
- [ ] RLS verified working
- [ ] Email sending domain verified
- [ ] Status page created (simple uptime check)
- [ ] UptimeRobot monitoring configured

**Estimate:** 0.5 days

#### Ticket W9-4: Legal Pages
**Acceptance Criteria:**
- [ ] `/privacy` - Privacy Policy (Termly template)
- [ ] `/terms` - Terms of Service
- [ ] Linked in footer of public pages
- [ ] Linked during checkout

**Estimate:** 0.5 days

#### Ticket W9-5: End-to-End Test
**Acceptance Criteria:**
- [ ] Founder completes full workflow on production
- [ ] Using real phone (no desktop)
- [ ] Real Stripe payment processed
- [ ] Under 5 minutes from signup to paid deposit

**Estimate:** 0.5 days

---

### Week 10: First Operators Live

#### Ticket W10-1: Heavenly Kitchen Onboarding
**Acceptance Criteria:**
- [ ] 30-minute video call with operator
- [ ] Enter their menu items (from photos/documents)
- [ ] Enter their top 5 clients
- [ ] Walk through creating first quote
- [ ] Help place intake link in Instagram bio
- [ ] Confirm they received a test inquiry notification

**Estimate:** 0.5 days (call) + ongoing support

#### Ticket W10-2: Daily Check-in Process
**Acceptance Criteria:**
- [ ] Template text messages for daily check-in
- [ ] Tracking sheet for feedback
- [ ] Bug triage process defined
- [ ] Critical bug SLA: fix within 24 hours

**Estimate:** Ongoing

---

## Appendix: Tech Stack Summary

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14 (App Router) | RSC, API routes, Vercel deploy |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | + shadcn/ui components |
| Database | Supabase (PostgreSQL) | RLS, Auth, Storage |
| Auth | Supabase Magic Link | No passwords |
| Payments | Stripe | Connect + Checkout |
| Email | Resend | React Email templates |
| PDF | @react-pdf/renderer | Invoice/quote PDFs |
| Deployment | Vercel | Auto-deploy main branch |
| Monitoring | UptimeRobot | Free tier |

---

## Appendix: Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://caterflow.app
```
