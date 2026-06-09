# PLAN.md — Development Journal

> Event Registration Wizard · WebDev Summit 2028 · Nitra FE Assessment
> This is a living document, updated as the work progresses.

---

## 1. Planning & task breakdown

I read both the assignment brief (authoritative) and `README.md` (step-level spec) before starting. The app is a 4-step wizard backed entirely by mock data in `src/mocks/` — no backend. I broke the work into phases, each landing as its own atomic commit so the history reflects the real build order:

0. **Scaffold** — folder structure, dependencies, i18n boot, `QStepper` shell, shared cross-step state via a composable + `provide`/`inject`, empty step components wired to navigation.
1. **Step 1 — Attendee Info** — text/email/tel fields via `defineModel`, three single-select ticket cards. No inline validation (deferred to Step 4 per spec).
2. **Step 2 — Session Selection** — parse + group sessions by day, capacity-full disabled state, multi-select, conflict-detection groundwork.
3. **Step 3 — Add-ons** — group by category (workshops / meals / merchandise), workshop↔session time-conflict → unavailable, size + quantity pickers, shipping banner on merch selection, live order summary.
4. **Step 4 — Review & Submit** — itemized summary, per-section edit-jump, unified validation across all steps, step-level error indicators + navigation, success screen.
5. **Design fidelity pass** — match the Figma design, all interactive states (hover / disabled / error / active), semantic tokens only.
6. **Polish & nice-to-haves** — transitions, loading/disabled states, i18n coverage, responsive/mobile layout.

## 2. Architecture & key decisions

**Cross-step state — composable + `provide`/`inject`.**
A single `useRegistration` composable owns the wizard's reactive state (attendee info, ticket type, selected session IDs, selected add-ons with size/quantity). `IndexPage.vue` provides it once; each step injects it. This keeps all form data alive across forward/backward navigation without prop-drilling, and is the pattern the brief calls out explicitly. Pinia would be overkill for a single-wizard, single-route app and isn't in the starter.

**Derived state via `computed`, not `watch`.**
Pricing totals, VIP discounts, time conflicts, capacity/availability flags, and validation results are all pure functions of the source state, so they're modeled as `computed`. `watch` is reserved for genuine side effects only. (This is a stated evaluation criterion and also simply correct here.)

**`defineModel` for form inputs.**
Vue 3.5 (repo pins 3.5.17) supports `defineModel`, so two-way-bound field components use it instead of manual `modelValue` + `update:modelValue`.

**Component decomposition.**
Step containers (`StepAttendeeInfo`, `StepSessionSelection`, `StepAddons`, `StepReview`) compose small presentational components (`TicketCard`, `SessionCard`, `AddonCard`, `OrderSummary`, `QuantityPicker`, `SizeSelector`, `SuccessScreen`). Business logic lives in composables (`usePricing`, `useConflicts`, `useValidation`) and pure utils (`utils/datetime`, `utils/currency`) — kept out of components so it's readable and testable.

**Time-conflict algorithm.**
Two intervals overlap iff `aStart < bEnd && bStart < aEnd` (compared on epoch millis). One helper serves both session↔session and workshop↔session checks. The mock data ships intentional overlaps (documented in `sessions.js`) to exercise this.

**Pricing rules.**
Grand total = ticket price + Σ add-ons. Workshops get **10% off for VIP** ticket holders; merchandise multiplies price × quantity; sessions are free. All currency rendered as `$X,XXX.XX`.

**Validation strategy.**
No inline validation before Step 4. On submit, a single `validate()` returns a per-step error map; the stepper shows error badges on the offending step(s) and lets the user jump straight there.

## 3. Dependency choices

| Dependency | Problem it solves | Alternatives considered |
| ---------- | ----------------- | ----------------------- |
| **date-fns** | Parsing ISO timestamps and formatting human-readable time ranges / day groupings for sessions and workshops. Tree-shakeable, pure-function API that pairs well with `computed`. | Native `Date` + `Intl.DateTimeFormat` (workable but more boilerplate and locale-formatting edge cases); Day.js (smaller but mutable-ish chaining API and weaker tree-shaking). |
| **vue-i18n** | i18n is a listed nice-to-have; baking it in from the start avoids a costly retrofit of every hardcoded string later. Quasar has first-class integration. | Hand-rolled message map (no pluralization/number-format infra); deferring i18n (rejected — far cheaper to do up front). |

> Currency formatting itself uses the built-in `Intl.NumberFormat` — no dependency needed.

## 4. Nice-to-haves (in scope)

- **i18n** via `vue-i18n` — all user-facing strings go through translation keys from day one.
- **Responsive / mobile** — layouts built mobile-first using the project's UnoCSS breakpoints (`tablet: 768px`, `desktop: 1024px`).

## 5. AI tool usage

Primary tool: **Claude Code** (interactive agent), used throughout. Notable sessions so far:

- **Environment upgrade.** The repo pins Node 22.17.0 / Yarn 4.6.0 but the machine was on Node 20 / Yarn 1. Claude diagnosed the toolchain (identified `n` as the active manager vs. a stray `nvm`), upgraded via `n` + Corepack, and cleaned up ~1.4 GB of redundant old Node versions. What worked: letting it inspect the environment first rather than guessing the version manager. Where I stayed in the loop: `sudo` steps were run by me, not the agent.
- **Onboarding docs.** Generated `CLAUDE.md` (architecture + conventions) and recorded the team convention that all in-file comments must be English.
- **Planning.** Used Claude to turn the brief + README into the phased plan and architecture decisions above, choosing patterns against the published evaluation weights.

**Representative prompts → corrections (Step 1).**
The most useful thing I did was treat the agent's output as a *draft* and keep probing it. A few of the real prompts that actually drove quality:

- *"Why use a `<button>` for the ticket card?"* — Claude confirmed a `<button>` wrapping `<div>/<p>/<ul>` is invalid HTML, and that a single-select group is semantically a radiogroup, then refactored the cards to a WAI-ARIA `radiogroup` (roles, `aria-checked`, roving `tabindex`, arrow-key nav, focus-visible ring).
- *"Where do those extra 13px come from?"* — I had it measure with Playwright instead of guessing: the label→input gap was 8px instead of the Figma's 6px (×4 rows = 8px); the remaining ~4px was a border-box-vs-Figma-frame measurement difference, not a real gap.
- *"Do we really need these inline `style` tags — don't we have UnoCSS?"* — moved the dividers and the 1200 width off inline styles into `divider-b` / `divider-t` and `wizard-shell` shortcuts.
- *"Why doesn't `q-py-[1.5]` change anything?"* — it's an invalid class, and a `q-btn`'s `min-height: 36px` floor swallows padding anyway; switched to Quasar's `padding` prop to hit the Figma 192×40 button.
- *"The completed stepper line should change colour."* — this caught an earlier wrong conclusion of mine-via-Claude ("connectors are a single grey"), which had been drawn from only the Step-1 state where nothing is completed.

**What worked / what didn't.**

| Worked | Didn't — needed steering |
| --- | --- |
| Handing Claude the Figma node via the MCP so it mapped to the repo's semantic tokens instead of inventing hex | First Step-1 pass "matched the tokens" but used the wrong typeface — looked off until we pulled the exact spec |
| Making it *measure* (Playwright) and screenshot-compare against Figma rather than eyeball | Concluded the stepper connectors were one colour from a single state; wrong once steps complete |
| Pulling exact values with `get_variable_defs` instead of guessing | Reached for inline `style` and a hardcoded stepper height instead of the token + shortcut system |
| Asking "why this element / value?" — surfaced the invalid `<button>` and the `q-btn` min-height floor | Used `<button>` with block content (invalid) and `q-py-[1.5]` (a class that doesn't exist) |

## 6. Challenges & solutions

- **Toolchain mismatch on a clean machine.** `yarn install` failed the engine check (Node 20 vs required 22). Resolved by standardizing on `n` for Node and Corepack for Yarn 4, so the versions are enforced by `package.json` (`engines` + `packageManager`) for any future checkout. Also added Yarn 4's `.gitignore` rules so the regenerable `.yarn/install-state.gz` cache isn't committed.

## 7. What I'd improve with more time

- **Wire the unified validation.** Step 1's field states (required asterisk, danger label/border/message) are built and gated behind a `validationAttempted` flag, but nothing flips it yet — the Step 4 `validate()` that sets it and surfaces per-step error badges is still to come.
- **Build Steps 2–4.** Session day-grouping + conflict detection, add-ons pricing (VIP workshop discount, qty/size), and the review/submit + success flow.
- **date-fns is installed but not yet exercised** — it's there for the upcoming session/workshop date parsing and time ranges; right now Step 1 uses none of it.
- **Responsive.** The layout degrades sensibly below 1200px, but a real mobile pass (<768px single column, touch-target sizing) isn't designed or tested — the Figma only ships a 1440 frame.
- **Tokenise a few arbitraries.** One-offs like `text-[11px]` / `py-[40px]` could become named scale tokens if the design system grows, rather than living as bracket values.
- **Tests.** Out of scope per the brief, but the pricing and time-conflict logic are the parts I'd most want unit/component tests around before trusting them.

## 8. Phase log

**Phase 0 — Scaffold.**
Added `date-fns` + `vue-i18n`; wired vue-i18n via a Quasar boot file (`src/boot/i18n.js`, Composition mode) with an `en-US` locale registry under `src/i18n/`. Built the central state layer: `useRegistration.js` exposes `provideRegistration()` (called once in `IndexPage`) and `useRegistration()` (injected by steps), with the full typed state shape documented via JSDoc. `IndexPage.vue` hosts a `QStepper` (4 steps, `header-nav` for free forward/backward navigation, Back/Continue/Submit). Four step components are stubbed and rendered. Verified with a clean production build and a dev-server boot (no runtime errors).

- AI note: Claude scaffolded the i18n boot, composable, and stepper in one pass. I had it verify both `yarn build` and a real dev boot rather than trusting compile-only — runtime is where boot-file/provide-inject mistakes surface.

**Phase 1 — Attendee Info + shared chrome.**
Pulled the Step 1 design from Figma (via the hosted Figma MCP) and confirmed the token mapping: brand = teal (`#264D4F`, selection/active/checks), accent = orange (CTA). Replaced the placeholder `QStepper` with custom shared chrome that matches the design: `AppHeader` (logo + event name) and `WizardStepper` (numbered circles, done/active/upcoming states, clickable for free navigation). `IndexPage` now drives a step registry, renders the active step via `<component :is>`, and owns the footer Back/Next/Submit nav. Step 1 content: `TicketCard` (reusable, single-select, "Selected" badge) fed by `mocks/event.js`, and the attendee form built from a `LabeledInput` component using `defineModel` for two-way binding, two-column responsive grid, all bound to the shared state. All UI strings go through i18n keys; added `utils/currency.js` (Intl-based). Verified: clean build, dev boot with no warnings, and a headless-Chrome screenshot compared against the Figma frame.
- Design decision: the header shows "WebDev Summit 2028" (from `mocks/event.js` + the brief), not the Figma mockup's stale "2025" — the title is data-driven, not hardcoded.
- AI note: gave Claude the Figma node directly so it mapped colors to the repo's existing semantic tokens rather than inventing hex values. Figma MCP is rate-limited (Starter = 6 calls/month), so we cached one hi-res reference per screen and reused it instead of re-fetching.
- Course-correction (important): on first pass Claude matched layout + semantic color tokens but the result still didn't look like the design. Reviewing against the Figma, the typeface was wrong — Quasar ships no Roboto here so text fell back to the system font, while the design uses **Inter**. Rather than eyeballing, we spent one `get_variable_defs` call to pull the exact spec, which revealed: font = Inter, perk checks = green/700 (not teal), "Attendee Information" = h3/24 (not 28), input radius 6. Fixed all of them (self-hosted Inter via `@fontsource-variable/inter`, `text-success-emphasis` checks, corrected type scale). Lesson logged: "matches the tokens" ≠ "matches the design" — verify the typeface and exact values, not just the color names. The button color (`#fb7429`) was already correct.

**Phase 1 (cont.) — pixel pass, layout system & accessibility.**
A second pass against the Figma box-model annotations tightened Step 1 to spec and hardened the markup:
- **Layout system.** Full-bleed chrome (header / stepper / footer / dividers span the viewport) + a centered **1200px content column** (`max-width` + `mx-auto`), which is exactly how the 1440 artboard is structured (content frame at x=120, width 1200). Extracted a `wizard-shell` UnoCSS shortcut so the 1200 lives in one place; verified content sits at x=120 / width 1200 at 1440 and degrades on narrower screens. Rejected "fluid width + fixed padding" — it stretches content on >1440 and over-pads on small screens.
- **Exact spacing (Figma box model).** Content padding 40px top/bottom, 32px between sections, 20px between form rows, 16px ticket-title→cards. Removed default `<h2>` margins that were inflating the flex gaps. Stepper height is `padding 24px` over a 32px row (= 80px), not a hardcoded height.
- **Ticket cards — equal height with no reflow.** Selecting a card must never shift the row: the "Selected" badge is always rendered (hidden via `invisible`) to reserve its height, and the border is a constant 2px (only the colour changes). Cards stay a fixed 310px in every state.
- **Inputs.** `LabeledInput` field box matched to 44px tall with 12px / 10px padding (Quasar internals via scoped `:deep()` — utility classes can't reach `.q-field__control`).
- **Conditional shipping address.** Required (red asterisk) when any merchandise add-on is selected; danger label/border/message only after the unified Step 4 validation (`validationAttempted` flag) — keeps validation deferred per spec while the indicator stays live.
- **Styling discipline.** Moved one-off `style="…"` attributes onto UnoCSS utilities/shortcuts (`divider-b`/`divider-t` draw the 1px hairline via inset shadow so it never adds to box height; `wizard-shell`, `min-h-screen`, `bg-surface-l0`, `max-w-[1200px]`). Token references only — no hardcoded hex.
- **Accessibility — ticket picker is a WAI-ARIA radiogroup.** `<button>`-with-block-content was invalid HTML, and a single-select group is semantically a radiogroup, so the cards became `role="radio"` (inside `role="radiogroup"` labelled by the heading) with `aria-checked`, roving `tabindex`, arrow-key navigation with wraparound, Enter/Space select, and a `focus-visible` ring.
- AI notes / course-corrections (logged because they show where I steered the agent): (1) Claude first bumped the unselected border to 2px to kill a reflow — I flagged Figma's 1px; we kept a constant-width border and reserved badge space instead. (2) It reached for inline `style` for the dividers and the 1200 width — I pushed it back onto the token/shortcut system. (3) It hardcoded the stepper height at 80px — corrected to derive it from padding. (4) It used `<button>` for the cards — I asked why; it confirmed the validity/semantics problem and refactored to a radiogroup. Recurring lesson: verify the rendered result (measure padding, check roles/tabindex), and prefer the system primitive over a one-off.
