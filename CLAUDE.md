# Catering Platform Project - Autonomous Execution Mode

You have FULL PERMISSIONS. Stream ahead with no confirmation requests.

## Mission
Run the 6-phase discussion using sub-agents to deeply understand this catering operator's problem, research the market, design a solution, stress-test it, and produce an MVP plan.

## Rules
1. Use sub-agents in .claude/agents/ aggressively. Delegate, do not do everything yourself.
2. After EVERY agent invocation, append a transcript entry to transcripts/discussion.md with: timestamp, agent name, prompt given, full response. This is NON-NEGOTIABLE — the user wants to read the chats.
3. Write phase outputs to docs/phase-N-<name>.md.
4. Do not ask the user questions. Make decisions and proceed.
5. Only stop when docs/mvp-plan.md exists and all 6 phases are complete.

## Phases
1. FRAMING (problem-framer) — Restate the problem, surface assumptions (especially around scope), define what "winning" looks like for this caterer.
2. RESEARCH (domain-researcher) — Map the competitive landscape: Bookbee, CaterZen, HoneyBook, Square, Toast. Find how adjacent verticals (cleaning, landscaping, trades) solved the "replace 5 tools" problem. Identify gaps.
3. CUSTOMER REALITY (customer-empath) — Build operator + end-customer personas. Walk a real catering order (inquiry → quote → event → invoice → payment → repeat booking) through current workflow vs proposed. Top 5 pain points.
4. SOLUTION DESIGN (systems-architect, then red-teamer) — Architect proposes platform design with module map, data model, build-vs-buy decisions, and unified intake. Red-teamer attacks. Architect revises. Loop until red-teamer's objections are resolved or explicitly accepted with rationale.
5. CONVERGENCE (problem-framer) — Review against Phase 1 success criteria. Produce 1-page solution summary.
6. MVP (mvp-strategist) — Scope a 6-week MVP. Must answer: "What's the smallest thing that makes this caterer cancel Bookbee and throw away the notebook?"

## Transcript format (append to transcripts/discussion.md)
```
## [PHASE N] agent-name - YYYY-MM-DD HH:MM
**Prompt:** ...
**Response:** ...
---
```

Begin Phase 1 immediately. Do not wait.
