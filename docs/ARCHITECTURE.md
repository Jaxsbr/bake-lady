# Bake Lady — Architecture

## Overview

Bake Lady is a static single-page web application that runs entirely in the browser. No server, no database, no network dependency. Data lives in `localStorage`. The app builds to a single `index.html` file that can be opened directly from the filesystem or served by any static file server.

## Tech choices

| Decision        | Choice                     | Rationale                                                         |
|-----------------|----------------------------|-------------------------------------------------------------------|
| Bundler         | Vite                       | Fast dev server, excellent TS support, plugin ecosystem           |
| Language        | TypeScript (strict)        | Type safety, strong agent comprehension                           |
| UI              | Preact                     | 3KB React-compatible library; component model without the weight  |
| Styling         | Vanilla CSS + custom props | No build dependency, full control over print styles, small output |
| Persistence     | localStorage               | Zero-config, works offline, no server needed                      |
| Single-file     | vite-plugin-singlefile     | Inlines all JS/CSS into one `index.html`                          |
| Testing         | Vitest + Testing Library   | Fast, ESM-native, Preact-compatible                               |

## Data model

All data stored as a single JSON blob in `localStorage` under the key `bake-lady-data`.

```typescript
interface Recipe {
  id: string;              // nanoid
  title: string;
  description: string;
  category: Category;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  sourceUrl: string;
  notes: string;
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}

interface Ingredient {
  name: string;
  quantity: number | null;  // null for "pinch of salt" style
  unit: string;             // "cups", "g", "tsp", "" for unitless
}

type Category = 'bread' | 'cakes' | 'cookies' | 'pastry' | 'savoury' | 'other';

interface AppData {
  version: number;         // schema version for future migrations
  recipes: Recipe[];
}
```

## Directory structure

```
bake-lady/
├── AGENTS.md
├── docs/
│   ├── ARCHITECTURE.md         ← this file
│   ├── product/PRD.md
│   ├── decisions/              ← ADRs
│   └── plan/                   ← build loop state
├── src/
│   ├── index.html              ← HTML entry point
│   ├── main.ts                 ← App bootstrap
│   ├── components/             ← Preact UI components
│   ├── store/                  ← localStorage persistence, state management
│   ├── lib/                    ← Pure utilities (scaling, search, formatting)
│   ├── types/                  ← TypeScript types and interfaces
│   └── styles/                 ← CSS files (including print styles)
│       ├── base.css            ← Reset, typography, custom properties
│       ├── components.css      ← Component styles
│       └── print.css           ← @media print overrides
├── public/                     ← Static assets (favicon, etc.)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Key architectural decisions

### 1. Static SPA over server framework

The user wants to host this as a local `index.html`. No Node.js runtime, no server process for the app itself. This rules out Next.js, Remix, and similar. A Vite-built SPA with client-side routing (hash-based) is the simplest path.

### 2. Preact over React or vanilla

Preact gives us a component model, JSX, and hooks in 3KB — good for organising a multi-view app without framework weight. Vanilla TS would work but leads to imperative DOM spaghetti as the app grows. React is 40KB+ of unnecessary weight for a personal app.

### 3. localStorage over SQLite/IndexedDB

localStorage is the simplest persistence that works when opening `index.html` from the filesystem. IndexedDB is more capable but overkill for a recipe collection (likely <1MB of data even with hundreds of recipes). A JSON export/import feature mitigates the localStorage size limit and data loss risk.

### 4. Single-file build

`vite-plugin-singlefile` inlines all JS, CSS, and small assets into one `index.html`. This means the app is a single file that can be copied, emailed, or bookmarked. No `dist/assets/` folder to manage.

### 5. Vanilla CSS over Tailwind

For a single-file app with a distinctive visual personality, vanilla CSS with custom properties gives full control over the design system and print styles without adding a build dependency or bloating the output. The app is small enough that CSS organisation isn't a scaling concern.

### 6. Hash-based routing

Using `#/`, `#/recipe/123`, `#/recipe/new` etc. — works when opened as a `file://` URL. No server-side routing needed.

### 7. macOS LaunchAgent for "app-like" experience

A `.plist` file in `~/Library/LaunchAgents/` can start a lightweight local HTTP server (Python's `http.server`) pointing at the build output directory, and open the browser to `localhost:PORT`. This makes it feel like launching a native app.

## Print architecture

Print is a first-class concern, not a bolt-on:

- `print.css` loaded via `@media print` — hides navigation, adjusts layout
- Recipe detail view has a "Print" button that calls `window.print()`
- Print customisation (font size, include/exclude sections) applied as CSS classes before printing
- Layout: ingredients in a compact two-column grid, steps numbered below
- Target: one recipe per A4 page where possible

## Backup strategy

- **Export**: serialise `AppData` to JSON, trigger a file download
- **Import**: file picker, parse JSON, validate schema version, merge or replace
- Prompt for export periodically (or on first use) to protect against localStorage clearing
