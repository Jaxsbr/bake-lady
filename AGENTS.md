# Bake Lady — Agent Guide

Purpose: A locally-hosted recipe management web app that replaces Google Docs for a home baker — easy to edit, great on a phone in the kitchen, prints beautifully. Builds to a single `index.html`.

## Tech stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Bundler     | Vite                           |
| Language    | TypeScript (strict)            |
| UI          | Preact                         |
| Styling     | Vanilla CSS + custom properties|
| Persistence | localStorage (JSON)            |
| Build       | vite-plugin-singlefile         |
| Testing     | Vitest + Preact Testing Library|
| Linting     | ESLint + Prettier              |

## Non-negotiable invariants

1. **TypeScript strict mode** — no `any`, no `ts-ignore`.
2. **All persistence through the store layer** — components never read/write `localStorage` directly.
3. **Every feature has tests** — at least one happy-path test per view, unit tests for utilities.
4. **Conventional commits** — `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
5. **Mobile-first responsive design** — every component must work on 375px+ viewports.
6. **Print is a first-class feature** — never break print layout; test with `@media print`.
7. **Single-file output** — `npm run build` must produce a working standalone `index.html`.

## Layer rules

```
src/
├── components/   → Preact UI components (render only, no direct localStorage)
├── store/        → State management and localStorage persistence
├── lib/          → Pure utilities: scaling, search, formatting, validation
├── types/        → Shared TypeScript types and interfaces
└── styles/       → CSS files (base, components, print)
```

**Dependency direction (strict):**
- `components/` → `store/`, `lib/`, `types/`
- `store/` → `lib/`, `types/`
- `lib/` → `types/`
- `types/` → nothing (leaf)
- `styles/` → standalone (no TS imports)

**Violations:** `components/` must NEVER import from `localStorage` directly — always go through `store/`. `lib/` must NEVER import from `store/` or `components/`.

## Where changes belong

| Change type           | Directory              |
|-----------------------|------------------------|
| UI component          | `src/components/`      |
| State / persistence   | `src/store/`           |
| Pure utility          | `src/lib/`             |
| Type definitions      | `src/types/`           |
| Base styles / theme   | `src/styles/base.css`  |
| Component styles      | `src/styles/components.css` |
| Print styles          | `src/styles/print.css` |
| Static assets         | `public/`              |
| Config                | project root           |

## Spec files

| Spec                 | Path                              | Describes                                |
|----------------------|-----------------------------------|------------------------------------------|
| Product requirements | `docs/product/PRD.md`             | Use case, features, phases, acceptance   |
| Sample recipes       | `docs/product/sample-recipes.md`  | Real recipe examples + JSON seed fixtures|
| Architecture         | `docs/ARCHITECTURE.md`            | Tech stack, data model, key decisions    |
| Build loop state     | `docs/plan/PROGRESS.md`           | Current task, phase, log                 |

## Workflow

1. Read this file and `docs/plan/PROGRESS.md` before starting any work.
2. Check the relevant spec file for the current phase.
3. Make changes. Keep each commit small and focused.
4. Run `npm run lint && npm run test` before committing.
5. Run `npm run build` and verify the output `index.html` works standalone.
6. **Self-verify with Playwright** — after every feature addition, run `npm run test:e2e` to confirm functionality and aesthetics (see Playwright section below).
7. Commit with conventional format.

## Playwright self-verification

Every non-trivial change MUST be verified with Playwright before committing. Tests live in `e2e/`.

### What to verify

**Functionality checks** (automated assertions):
- Core user flows: view recipe list, open recipe detail, create/edit/delete recipe
- localStorage persistence: reload page and verify data survives
- Search and filter: confirm results update correctly
- Form validation: empty/invalid inputs show errors

**Aesthetic checks** (visual + structural assertions):
- No layout overflow: `expect(await page.locator('body').evaluate(el => el.scrollWidth <= window.innerWidth)).toBeTruthy()` on mobile viewport (375px)
- Text legibility: key headings and body text have `font-size >= 16px`
- Tap targets: buttons and interactive elements have `min-height >= 44px`
- Print layout: switch to print media, confirm ingredient and step sections are visible
- Warm visual identity: confirm CSS custom properties (`--color-warm`, `--font-heading`) are applied

### Playwright setup (scaffold during foundation phase)

```bash
npm install -D @playwright/test
npx playwright install chromium
```

`playwright.config.ts` — two projects:
- `desktop`: 1280×720
- `mobile`: 375×812 (iPhone SE)

Run: `npx playwright test` (alias: `npm run test:e2e`)

### Test file conventions

- `e2e/smoke.spec.ts` — basic app loads, no console errors
- `e2e/recipe-crud.spec.ts` — create, view, edit, delete flows
- `e2e/kitchen-view.spec.ts` — mobile cooking experience
- `e2e/print.spec.ts` — print layout assertions
- `e2e/aesthetics.spec.ts` — responsive layout, font sizes, tap targets

### Verify command (build loop)

The build loop `verify` config must be:
```
npm run lint && npm run test && npm run test:e2e
```

Update `docs/plan/PROGRESS.md` Config section once Playwright is installed.

## Agent operating rules

- Read docs/ before asking questions.
- Prefer explicit files over implicit conventions.
- Keep changes small and reviewable — one concern per commit.
- When adding a dependency, strongly prefer zero-dependency or tiny packages. Every byte ends up in the single `index.html`.
- UI should feel warm, personal, and characterful — classic recipe-book aesthetic with quirky touches. This is not enterprise software.
- Always consider the phone-in-kitchen scenario: large tap targets, readable text, no tiny controls.
- Always consider print: will this change break the print layout?
