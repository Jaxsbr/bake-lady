# Build Loop — Progress State

> Single source of truth for the agentic build loop. Every iteration MUST read this first and update it before finishing.

## Config

- **verify**: `npm run lint && npm run test && npm run test:e2e`
- **checkpoint-interval**: 10
- **max-tasks-per-phase**: 200

## Current State

- **task-number**: 8
- **phase**: unit-install
- **phase-complete**: true
- **status**: running
- **last-result**: investigated
- **next-task**: none
- **tasks-since-checkpoint**: 7

## next-task values

- `none` — no task queued; agent must investigate and log a new one
- `"<description>"` — agent must execute this task, verify, then clear or replace

## Phase goal

**Phase: unit-install** — replace the free-text unit field in the ingredient form with a dropdown, and create a `install.sh` script plus install guide so a non-technical Mac user can get the app running from GitHub with a single command.

Completion criteria (ALL must be true before marking phase-complete):
1. Unit dropdown: the ingredient unit field in RecipeForm is a `<select>` with options: `—`, `tsp`, `tbsp`, `cup`, `ml`, `l`, `g`, `kg`, `oz`, `lb`, `fl oz`, `pinch`, `slice`, `piece`
2. Unit dropdown meets 44px tap-target on mobile; no horizontal overflow at 375px
3. Existing recipes with any stored unit value display correctly in the detail view (graceful fallback)
4. `install.sh` at repo root: checks for Homebrew (installs if missing), checks for Node.js (installs via Homebrew if missing), runs `npm install && npm run build`, copies `dist/index.html` to `~/Bake\ Lady/index.html`, opens it in the default browser
5. `install.sh` is executable (`chmod +x`) and prints friendly plain-English status messages at each step
6. `INSTALL.md` at repo root: a 5-step guide for non-technical Mac users (download ZIP → unzip → open Terminal → paste one command → done); no jargon; link to Apple's "How to open Terminal" page
7. All existing Playwright e2e tests continue to pass (no regressions)
8. `npm run lint` and `npm run test` pass with zero errors

## Log

| # | Time | Task | Result | Notes |
|---|------|------|--------|-------|
| 1 | 2026-03-13T15:49:37+1300 | Investigate — queue unit dropdown task | investigated | Free-text unit input needs replacing; install.sh/INSTALL.md don't exist yet; starting with dropdown |
| 2 | 2026-03-13T15:52:19+1300 | Replace unit text input with <select> dropdown + UNITS type + seed data fixes + 7 e2e tests | pass | 17 unit + 100 e2e pass; criteria 1-3 met |
| 3 | 2026-03-13T15:52:44+1300 | Investigate — queue install.sh | investigated | Criteria 4-5 unmet: no install.sh exists; queuing it before INSTALL.md |
| 4 | 2026-03-13T15:55:04+1300 | Write install.sh: Homebrew check/install, Node.js check/install, npm install+build, copy to ~/Bake Lady/, open in browser | pass | 100 e2e pass; criteria 4-5 met; script syntax-checked and executable |
| 5 | 2026-03-13T15:56:11+1300 | Investigate — queue INSTALL.md | investigated | Criteria 1-5 met; only criterion 6 (INSTALL.md) remains |
| 6 | 2026-03-13T15:58:52+1300 | Write INSTALL.md: 5-step guide for non-technical Mac users with Terminal link | pass | 100 e2e pass; criterion 6 met; all 8 criteria now satisfied |
| 7 | 2026-03-13T16:00:11+1300 | Investigate — all 8 unit-install criteria met; marking phase complete | investigated | unit dropdown, install.sh (executable, friendly output), INSTALL.md all done; 17 unit + 100 e2e pass |
