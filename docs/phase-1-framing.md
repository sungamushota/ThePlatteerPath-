# Phase 1: Problem Framing

## The Problem Restated Three Ways

### Restatement 1: The Operational View
A small catering operator is drowning in operational friction. Customer inquiries arrive through five different channels (social DMs, texts, Bookbee link, phone calls, word-of-mouth). Each inquiry requires manual transcription into a notebook. Quotes are generated in Bookbee but client history lives elsewhere. Employees clock in somehow, but payroll is disconnected. The operator spends mental energy context-switching between tools instead of cooking food and delighting customers.

**Core problem:** Information entropy. Data exists but is scattered, duplicated, or lost.

### Restatement 2: The Economic View
This operator pays $50/month for Bookbee (quoting, invoicing, payments) but still needs a notebook for CRM, has no loyalty/referral system to increase customer lifetime value, and lacks integrated payroll. They are paying for fragmentation. Every hour spent reconciling systems is an hour not spent on revenue-generating activities.

**Core problem:** The cost of NOT having a unified system exceeds the cost of Bookbee - but the cost is hidden in time, missed follow-ups, and lost repeat business.

### Restatement 3: The Growth Constraint View
This operator cannot scale. A notebook CRM works for 20 regular clients. It breaks at 50. Manual inquiry handling works for 5 events/month. It fails at 15. The current stack is a growth ceiling disguised as a workflow.

**Core problem:** The operator has outgrown their tools but cannot justify enterprise software ($200-500/month). They are stuck in the "messy middle."

---

## Unstated Assumptions (Dangerous Territory)

### Assumption 1: "One platform" is the right goal
**Challenge:** The operator asked for "one platform" but may actually need "fewer platforms that talk to each other." Building a monolithic system that does CRM + quoting + invoicing + payments + loyalty + referrals + payroll + time tracking + employee management is a 2-year, $500K+ endeavor. Is the real need integration, not consolidation?

**What we should validate:** Would the operator be equally satisfied with Bookbee + a lightweight CRM + Gusto for payroll, connected via Zapier? If yes, we are solving the wrong problem.

### Assumption 2: Payroll belongs in this platform
**Challenge:** Payroll is a heavily regulated, compliance-intensive domain (tax withholding, W-2s, state-specific rules, direct deposit). Every serious player (Gusto, Square Payroll, ADP) has spent millions on compliance. Including payroll in an MVP is scope creep of the most dangerous kind.

**What we should validate:** Does "payroll" mean actual payroll processing, or does it mean "I want to see hours worked and calculate what I owe"? The latter is time tracking with reporting. The former is a regulatory minefield.

### Assumption 3: The operator will actually use software
**Challenge:** They currently track clients in a physical notebook. This is not a technology problem - it is a habit problem. A $50/month Bookbee subscription suggests low software budget tolerance. A notebook suggests low software adoption tolerance.

**What we should validate:** Has this operator tried and abandoned other tools? What made them stick with the notebook? If the answer is "it's just easier," no software will fix this without significant behavior change support.

### Assumption 4: Loyalty and referral programs will drive meaningful revenue
**Challenge:** Loyalty programs work for high-frequency, low-ticket businesses (coffee shops, restaurants). Catering is low-frequency, high-ticket. A customer ordering catering for a corporate event once per quarter does not need points - they need reliability and relationship.

**What we should validate:** What does "loyalty" mean for catering? Is it points-based rewards, or is it "remember my preferences and make re-ordering easy"? The latter is CRM, not a loyalty program.

### Assumption 5: The problem is software, not process
**Challenge:** "Customer inquiries come from everywhere" is a channel problem, not a software problem. A single intake form solves this - and Typeform + Bookbee integration already exists. The operator may need a process consultant, not a new platform.

**What we should validate:** If we gave this operator a single intake link today and told them to put it in their Instagram bio, text it to inquiries, and print it on business cards - would that solve 60% of the problem?

### Assumption 6: Video monitoring is part of the platform scope
**Challenge:** The PROBLEM.md mentions "watches video to check on operations/staff" but does not list it as a requirement. This is surveillance/operations software, an entirely different domain. Including it would be catastrophic scope creep.

**Decision:** Explicitly exclude video monitoring from scope unless the operator clarifies this is a core need.

### Assumption 7: "Small-to-medium catering operators" is a viable market segment
**Challenge:** This phrasing suggests we are building a product, not a solution for one operator. If this is a custom solution for one caterer, scope should be ruthlessly narrow. If this is a SaaS play, we need market validation beyond one customer's pain points.

**What we should validate:** Is this a consulting engagement (solve this operator's problem) or a startup (build a scalable product)? The MVP strategy differs dramatically.

---

## What "Winning" Looks Like: Measurable Success Criteria

### 6-Month Success Metrics

| Metric | Current State | Target State | How to Measure |
|--------|---------------|--------------|----------------|
| **Tools in active use** | 3+ (Bookbee, notebook, texts, social DMs) | 1-2 (primary platform + optional payroll) | Count of systems operator touches daily |
| **Time to process inquiry** | Unknown (estimate: 10-15 min with back-and-forth) | Under 5 minutes (structured intake) | Time from inquiry receipt to quote sent |
| **Client information accessibility** | Notebook (not searchable, not shareable) | Digital CRM (searchable, mobile-accessible) | Can operator pull up client history in <30 seconds? |
| **Repeat booking rate** | Unknown (not tracked) | Tracked, with target of 30%+ of revenue from repeat clients | % revenue from clients with 2+ bookings |
| **Referral tracking** | None | Source attribution on 80%+ of new inquiries | "How did you hear about us?" captured and reported |
| **Invoice collection time** | Unknown | Under 7 days average | Days from invoice sent to payment received |
| **Employee hours visibility** | Unknown | Real-time dashboard showing hours by employee | Operator can answer "how many hours did X work this month?" instantly |
| **Monthly software spend** | $50 (Bookbee) + hidden costs (time) | Under $100/month for primary platform | Total subscription cost |
| **Operator satisfaction** | Frustrated (implied) | "I could not go back to the old way" | Qualitative interview at 6 months |

### The Ultimate Success Test
**In 6 months, the operator should be able to:**
1. Receive an inquiry from any channel and route it to one intake system in under 1 minute
2. Pull up a client's full history (past orders, preferences, payment history) in under 30 seconds
3. Generate and send a quote in under 5 minutes
4. See which clients are due for re-engagement (have not ordered in 90+ days)
5. Know how many hours each employee worked last pay period without asking anyone
6. Answer "where do my customers come from?" with data, not guesses

---

## Scope Creep Flags

### RED FLAGS - Explicitly Out of Scope for MVP
1. **Full payroll processing** - Too regulated, too complex. Time tracking with export to Gusto/Square Payroll is acceptable.
2. **Video monitoring integration** - Different domain entirely.
3. **Menu/recipe management** - Nice to have, not core to the stated problems.
4. **Inventory tracking** - Not mentioned as a pain point.
5. **Multi-location support** - Not mentioned, premature optimization.
6. **Mobile app** - Web-responsive is sufficient for MVP.
7. **Customer-facing loyalty point redemption** - Track loyalty internally first.

### YELLOW FLAGS - Validate Before Including
1. **Referral program mechanics** - Is this tracking referrals or automating rewards? Start with tracking.
2. **Employee management beyond time tracking** - Scheduling? Permissions? Performance? Clarify scope.
3. **"Single platform" as literal requirement** - Would "primary platform + payroll integration" satisfy the need?

### GREEN FLAGS - Core to MVP
1. **Unified inquiry intake** - Single link/form capturing all necessary booking details
2. **Basic CRM** - Client contact info, booking history, notes, tags
3. **Quote generation** - From inquiry to quote with menu items and pricing
4. **Invoice and payment tracking** - Link to existing payment processors (Stripe, Square)
5. **Employee time clock** - Clock in/out with hours reporting

---

## Critical Questions for Phase 2 Research

1. How do competitors (CaterZen, HoneyBook, Toast) handle the payroll question? Build, partner, or exclude?
2. What is the actual TAM for "catering operators in the messy middle" ($50-150/month software budget)?
3. How did vertical SaaS in adjacent industries (cleaning: Jobber; landscaping: ServiceTitan; trades: Housecall Pro) sequence their feature rollout?
4. What is the minimum feature set that would make this operator cancel Bookbee?

---

## Phase 1 Conclusion

This operator does not need "one platform that does everything." They need:
1. **A single intake funnel** to stop losing information across channels
2. **A searchable client record** to replace the notebook
3. **Visibility into employee hours** for payroll preparation
4. **A reason for customers to come back** (which may be "easy re-ordering" not "loyalty points")

The danger is building a mediocre version of 9 tools instead of an excellent version of 3. Phase 2 research should validate which 3 matter most and how competitors sequenced their own feature sprawl.

**Recommended framing for MVP:** "The system that replaces Bookbee + the notebook + the scattered texts." Everything else is Phase 2.
