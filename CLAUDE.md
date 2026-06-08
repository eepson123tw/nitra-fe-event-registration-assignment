# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A take-home interview assignment: build a 4-step **Event Registration Wizard** (a single-page Quasar/Vue 3 app). The scaffold is intentionally a blank slate — `src/App.vue` and `src/pages/IndexPage.vue` are stubs marked "Your implementation starts here". The full spec for each step lives in `README.md` (fields, validation rules, pricing logic). Read it before implementing.

## Conventions

- **All in-file comments must be written in English** (code, config, etc.), even though chat may be in another language.
- **Never hardcode hex color values.** Use the semantic design-token shortcuts (see Styling below). The README calls this out explicitly.
- Any added dependency (e.g. date-fns, lodash-es) must be documented in `PLAN.md` — see the README's Submission section.

## Toolchain & commands

Requires **Node 22.17.0** and **Yarn 4.6.0**, both enforced via `package.json` `engines` + `packageManager` (Corepack). Yarn 4 is activated through Corepack, not installed globally.

```bash
yarn          # install dependencies
yarn dev      # start the Quasar dev server (port 9001, auto-opens browser)
yarn build    # production build
```

Note: the README mentions port 9000, but `quasar.config.js` sets `devServer.port: 9001` — the latter is what actually runs.

There is **no lint or test tooling configured** — no test runner, no ESLint config, and no corresponding scripts. (Vitest appears only as mock session/workshop content, not as a real dependency.) Don't assume `yarn test`/`yarn lint` exist.

## Architecture

Quasar 2 + Vue 3 (Composition API, `<script setup>`) on Vite, SPA mode.

- **Entry / routing**: `src/App.vue` is just `<router-view />`. The router (`src/router/`) defines a single route `/` → `src/pages/IndexPage.vue`. The whole wizard is expected to live under this one page rather than route-per-step.
- **Mock data** (`src/mocks/`) is the data source — there is no backend:
  - `event.js` — event metadata + the three ticket types (General/VIP/Student) with prices and perks.
  - `sessions.js` — flat array of sessions with ISO `date`/`endDate`. **Intentional time overlaps are baked in** (documented in the file header) so conflict-detection logic can be exercised. Group by day for display; `registered >= capacity` means full.
  - `addons.js` — flat array mixing `category: workshop | meal | merchandise`. Workshops have time slots (check conflicts vs selected sessions); merchandise may have `sizes` and `maxQuantity`.
- **Key cross-cutting business rules** (full detail in README): validation is **deferred to Step 4** (no inline validation earlier) and runs across all steps at once; VIP tickets give **10% off workshops**; selecting any merchandise makes the Step 1 shipping address required.

## Styling: UnoCSS semantic design tokens

This project does **not** use plain Tailwind/Quasar colors — it uses the Nitra semantic token system wired through UnoCSS. Understanding the flow requires reading several files together:

- `uno.config.js` — the UnoCSS entry. Uses `presetWind3` + `presetAttributify`. Crucially, a **preflight** flattens the `semanticColors` object into `:root` CSS custom properties (`--text-neutral-default`, `--bg-brand-emphasis-rest`, …) at build time.
- `src/unocss/semantic.js` — defines `semanticColors` (the token *values*) and the `text-*` / `bg-*` / `border-*` / `divider-*` **shortcuts** that map class names to `var(--…)` references.
- `src/unocss/index.js` — typography (`text-h1`…`text-h4`, `text-subtitle1/2`), font weights, breakpoints, and the theme; composes the final `uno-shortcuts`.
- `src/unocss/colors.js` — raw color palettes (green/orange/red/blue/yellow/gray) the semantic layer references.
- Loaded into the app via the `unocss` boot file (`src/boot/unocss.js` → `import 'uno.css'`), registered in `quasar.config.js`.

When styling, prefer the semantic shortcut classes (e.g. `text-neutral`, `bg-surface-l1`, `border-neutral-muted`). The full shortcut list is in `src/unocss/semantic.js`.
