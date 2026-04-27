# How to Run

1. Unzip into a folder
2. `cd catering-platform`
3. Launch with full autonomy:
   ```
   claude --model claude-opus-4-5 --dangerously-skip-permissions
   ```
4. First message: **"Read CLAUDE.md and begin."**
5. Read the discussion live: `transcripts/discussion.md`
   - Windows PowerShell: `Get-Content transcripts/discussion.md -Wait`
   - Mac/Linux: `tail -f transcripts/discussion.md`
6. Final outputs land in `docs/`

## Agent Model Assignments
- Opus: problem-framer, systems-architect, red-teamer (+ orchestrator)
- Sonnet: domain-researcher, customer-empath, mvp-strategist
