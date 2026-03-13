# Bake Lady — Product Requirements

## Vision

A beautiful, locally-hosted recipe management app that replaces a messy collection of Google Docs with something purpose-built for a home baker — easy to edit, great on a phone in the kitchen, and prints beautifully.

## The problem (real use case)

She finds a recipe online — say [Sourdough Discard Protein Bagels](https://www.thisjess.com/sourdough-discard-protein-bagels/) via Pinterest. The recipe site is cluttered with ads, life stories, and pop-ups. She creates a Google Doc and copies over the parts she cares about: ingredients, method, maybe some notes. Over time she tweaks the recipe — adjusts quantities, adds her own tips, changes steps.

**What breaks down:**

1. **Finding recipes** — they're scattered across Google Drive with inconsistent naming. Search sometimes works, sometimes doesn't.
2. **Editing on the phone** — Google Docs is clunky on mobile. Formatting goes haywire, selection is fiddly.
3. **Cooking from the phone** — she has to scroll up and down between the ingredient list and the method steps. Constantly losing her place.
4. **Cooking from the laptop** — means carrying the laptop to the kitchen, or printing. She often prints.
5. **Printing** — Google Docs prints okay but wastes space, includes headers/footers she doesn't want, and doesn't optimise layout for a recipe format.

## User persona

- **Name**: The Baker
- **Context**: Bakes regularly at home — sourdough, cakes, cookies, pastries
- **Devices**: Phone in the kitchen (primary cooking device), laptop for entering/editing recipes
- **Current workflow**: Pinterest/web → Google Docs → print → kitchen
- **Frustrations**: can't find recipes, phone UX is terrible for cooking, printing wastes paper

## Design principles

1. **Kitchen-first** — the phone cooking experience is the primary design target
2. **Print is a first-class feature** — not an afterthought
3. **Warm and characterful** — classic or quirky visual personality, not corporate/sterile
4. **Zero infrastructure** — runs from a local file, no server, no account, no internet required
5. **Her data, her computer** — everything in localStorage, exportable, no cloud lock-in

## Core features

### F1 — Recipe CRUD

- Create a recipe with: title, description, category, prep time, cook time, servings, ingredients list, method steps, source URL, personal notes
- Edit and delete recipes
- Ingredients: name, quantity, unit
- Method steps: ordered, plain text
- Simple, forgiving editor — no rich text complexity

### F2 — Browse & find

- Home view shows all recipes as cards (title, category, time estimate)
- Filter by category (bread, cakes, cookies, pastry, savoury, other)
- Search across title, ingredients, and notes
- Sort by: recently added, alphabetical

### F3 — Kitchen view (split-pane on phone)

- Recipe view with ingredients pinned/visible while scrolling through steps
- Large, readable text
- Step highlighting or tap-to-advance
- Wake Lock API to keep screen on

### F4 — Print

- Dedicated print layout optimised for recipes
- Compact: ingredients in columns, steps numbered cleanly
- Customisation: include/exclude notes, source URL, adjust font size
- `@media print` CSS — no JS hacks
- Print preview before printing

### F5 — Ingredient scaling

- Adjust serving count on recipe view
- Quantities recalculate proportionally
- Sensible rounding (no "0.333 cups")

### F6 — Import (stretch)

- Paste a URL, extract structured recipe data (JSON-LD / schema.org)
- Review and edit before saving

### F7 — Export / backup

- Export all recipes as JSON
- Import from JSON backup
- Guards against localStorage loss

## MVP scope (Phase 1 + 2 + 3)

The MVP delivers **F1 + F2** plus the install script — she can create, browse, and search recipes, and a non-technical user can get it running from GitHub with a single command.

## Phased build plan

### Phase 1 — Foundation

**Goal**: Vite project scaffolded, localStorage persistence working, one hardcoded recipe renders on screen. App builds to a single `index.html`.

- Initialise Vite + TypeScript + CSS
- Configure `vite-plugin-singlefile` for single-file output
- Define recipe data types
- Implement localStorage read/write with JSON serialisation
- Seed with 2-3 sample recipes (including the sourdough bagels)
- Render a minimal recipe list
- Verify: `npm run build` produces a working `index.html`

### Phase 2 — Recipe CRUD + browse

**Goal**: Full create/edit/delete, category filter, search. Usable as a Google Docs replacement.

- Recipe detail view
- Create/edit recipe form (modal or dedicated view)
- Delete with confirmation
- Category filter on home view
- Search bar
- Form validation
- Responsive layout: phone-friendly cards and forms
- Visual design pass: warm colour palette, quirky typography, classic recipe-book feel

### Phase 3 — Unit selection + install

**Goal**: Improve ingredient entry UX and make the app installable by a non-technical Mac user.

#### Unit selection dropdown

- Replace the free-text unit field in the ingredient row with a `<select>` dropdown
- Predefined unit list: `—` (none/whole), `tsp`, `tbsp`, `cup`, `ml`, `l`, `g`, `kg`, `oz`, `lb`, `fl oz`, `pinch`, `slice`, `piece`
- Unit label renders as the selected value on the detail view (no change needed there)
- Existing recipes with free-text units gracefully fall back to the closest match or display as-is
- All unit-selection inputs in the form meet the 44px tap-target requirement

#### macOS install (non-technical user)

- `install.sh` at the repo root: a single shell script a non-technical Mac user can double-click or paste into Terminal
- Script checks for Homebrew; installs it if missing (with user confirmation prompt)
- Script checks for Node.js; installs via Homebrew if missing
- Runs `npm install && npm run build` to produce `dist/index.html`
- Copies `dist/index.html` to `~/Bake Lady/index.html` (user's home folder, easy to find)
- Opens `~/Bake Lady/index.html` in the default browser at the end
- Prints friendly, plain-English status messages throughout — no jargon
- `README.md` (or `INSTALL.md`) with a 5-step illustrated guide: download ZIP from GitHub → unzip → open Terminal → paste one command → done
- The install guide assumes zero developer knowledge; links to "How to open Terminal on Mac" if needed

### Phase 4 — Kitchen view + print

**Goal**: Phone cooking experience and beautiful print output.

- Split-pane / pinned-ingredients layout for phone
- Step-by-step mode with tap navigation
- Wake Lock integration
- `@media print` stylesheet
- Print customisation (toggle notes, source, font size)
- Print preview

### Phase 5 — Scaling + polish

**Goal**: Ingredient scaling, visual refinement, accessibility.

- Serving adjuster with proportional recalculation
- Rounding logic for quantities
- Visual polish pass
- Keyboard navigation
- Accessibility audit (contrast, labels)

### Phase 6 — Import + export

**Goal**: URL import, JSON backup/restore.

- JSON export of all recipes
- JSON import (merge or replace)
- URL recipe extractor (JSON-LD / schema.org parsing, client-side)
- Preview before save

## Deployment

- **Primary**: `index.html` opened directly in browser from local filesystem, or served via a minimal local HTTP server
- **macOS install**: LaunchAgent `.plist` that starts a lightweight local server (e.g. `python3 -m http.server`) and opens the browser — makes it feel like a native app
- **Backup**: the `index.html` plus a `recipes-backup.json` export can be copied anywhere

## Acceptance criteria (global)

- App runs from a single `index.html` file with no server required
- Data persists in localStorage across browser restarts
- All text legible at arm's length on a phone (kitchen counter distance)
- Prints cleanly on A4 paper — no wasted space, no browser chrome
- Works offline (no network requests for core functionality)
- Warm, characterful visual design — feels personal, not like a SaaS product
