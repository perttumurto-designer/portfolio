# Portfolio Design System

## Project

Next.js App Router + shadcn/ui (preset b3DpPqlRB2) + Tailwind CSS v4 + TypeScript + Storybook 10.

## Structure

```
app/globals.css      ← Design tokens (CSS variables) — CODE SOURCE OF TRUTH
components/ui/       ← shadcn/ui components
components/portfolio/← Custom components
hooks/               ← React hooks
lib/utils.ts         ← cn() helper
stories/ui/          ← Stories for ui components
stories/portfolio/   ← Stories for portfolio components
data/                ← Static data (projects.ts etc.)
```

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (verify before push)
- `npm run storybook` — Storybook dev server

## Workflow

Design-first: Figma → Storybook → Pages. Never skip Storybook.

## Rules (apply to ALL skills)

- No hardcoded colors/spacing/radius — use CSS variables via Tailwind classes
- Every reusable component in `components/` MUST have a story in `stories/`
- Page sections, layouts, and one-off compositions do NOT get stories
- New reusable components: Storybook first, pages second
- Use `cn()` from `lib/utils` for class merging
- Functional TypeScript components only
- `npm run build` after changes
- Import alias: `@/components/`, `@/lib/`
- Package manager: npm

## Responsive Design Rules (apply to ALL skills)

Every component, screen, and view MUST work on mobile and desktop. Non-responsive output is not acceptable.

- **Mobile first** — write base styles for 375px, then layer up with `md:` / `lg:` / `xl:` prefixes
- **Canonical breakpoint:** `md` (768px) is the mobile/desktop boundary. Use `sm` only when 640px is genuinely the right switch for that specific element
- **Breakpoint values** live in [lib/breakpoints.ts](lib/breakpoints.ts) — JS (hooks, storybook viewports) imports from there so it never drifts from Tailwind's CSS values
- **Prefer CSS over JS** — use Tailwind responsive prefixes (`md:hidden`, `flex-col md:flex-row`) before reaching for [useIsMobile()](hooks/use-is-mobile.ts)
- **Dual-render only when structure differs** — if the same DOM can be reflowed with classes, do that. Only split into `<Mobile* />` + `<Desktop* />` components (see [responsive-menu.tsx](components/portfolio/responsive-menu.tsx)) when the trees must genuinely differ
- **No fixed pixel widths** — avoid `w-[320px]`, prefer `w-full max-w-sm`, container queries, or responsive max-widths
- **Verify on three widths** — every change must be checked at 375px (mobile), 768px (tablet), and 1280px (desktop) before shipping. Storybook viewport addon is configured for this
- **Reusable components need responsive stories** — if behavior changes across breakpoints, add Mobile + Desktop stories (see story-creator skill)
- **No horizontal scroll on mobile** — content must fit 375px width without overflow
- **Tap targets ≥ 44px on mobile** — use adequate padding on interactive elements

### Canonical breakpoints

| Alias | Tailwind prefix | min-width | Used for |
|---|---|---|---|
| mobile | *(unprefixed)* | 0 | Default/base styles — write mobile first |
| tablet | `md:` | 768px | The mobile/desktop boundary — swap navigation, enable multi-column |
| desktop | `lg:` | 1024px | Wider layouts, sidebars, 3+ column grids |
| wide | `xl:` | 1280px | Large viewports, max-content-width kicks in |
| ultra | `2xl:` | 1536px | Rare — only when a design specifically calls for it |

## Token flow

app/globals.css → Tailwind → Components → Storybook (auto via preview.tsx import)
Figma Variables ↔ globals.css (bidirectional via MCP)
