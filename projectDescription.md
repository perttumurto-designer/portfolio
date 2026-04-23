# perttumurto.org — nextGen

Compact reference for onboarding an AI assistant to concept, prompt, and build against this project.

## Concept

Personal portfolio site for Perttu Murto — a senior digital product designer with 15+ years of experience. The site is both a body-of-work showcase and a live demonstration of its own thesis: **AI-augmented design is 2 000% faster when the pipeline is tight**. The portfolio itself is built end-to-end through a Figma ↔ Storybook ↔ code loop driven by Claude Code, so the artifact is also the proof.

**Voice & positioning.** Confident, restrained, editorial. Emphasis on craft, execution, and speed — *"When everyone can build everything, the best and most meaningful experience wins. Ideas aren't valuable. Execution is."* Designed for fellow designers, hiring managers, and prospective clients who care about the how, not just the what.

**Visual language.** Dark-first with a light mode. Large Helvetica Now Display headings set tight (negative tracking). Monochrome core palette (oklch greys) with minimal chrome. Generous whitespace. Ambient motion — aurora/dot backgrounds, analog clock, Lottie logo mark. Tactile sticky nav with animated indicator. Mobile nav slides into a full-screen menu with oversized type.

**Sections (single-page, scroll-driven).** Main (hero) · Selected works · About · History.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.1 (App Router, Turbopack) · React 19 · TypeScript 5.9 |
| Styling | Tailwind CSS v4 · `tw-animate-css` · `tailwind-merge` · `class-variance-authority` |
| UI kit | shadcn/ui (preset `b3DpPqlRB2`) · Radix primitives · lucide-react · @tabler/icons-react |
| Design system | CSS custom properties in `app/globals.css` (oklch) · bidirectional sync with Figma Variables via Figma MCP |
| Fonts | Helvetica Now Display (local, 10 weights: Hairline→ExtBlk) · Inter (sans) · JetBrains Mono (heading accents) · Geist Mono (code) |
| Theming | `next-themes` — light / dark / system |
| Motion | `lottie-react` · custom canvas/SVG backgrounds |
| Tooling | Storybook 10 (nextjs-vite) · Vitest 4 · Playwright · ESLint 9 · Prettier |
| Pkg mgr | npm |

## Structure

```
app/
  layout.tsx            Root layout, font registration, ThemeProvider
  page.tsx              Single-page composition — Hero + section anchors
  globals.css           Design tokens (CSS vars) + @utility text styles
components/
  ui/                   shadcn primitives (button, switch, separator, typography, ...)
  portfolio/            Project-specific composites (hero, main-menu, sticky-nav,
                        analog-clock, aurora/simple-background, theme-toggle, ...)
  theme-provider.tsx    next-themes wrapper
hooks/
  use-is-mobile.ts      Breakpoint hook (reads lib/breakpoints.ts)
  use-draggable.ts
lib/
  utils.ts              cn() helper
  breakpoints.ts        Single source of truth for JS breakpoints (mirrors Tailwind)
stories/
  ui/                   Stories for every component in components/ui
  portfolio/            Stories for every reusable component in components/portfolio
data/                   Static content (lottie JSON, future projects.ts, ...)
public/
  fonts/                Helvetica Now Display .woff2 files
  simpleBackground.js   External background script loaded via <Script>
.claude/skills/         Project-specific Claude Code skills (token-sync,
                        story-creator, figma-to-code, code-to-figma,
                        design-system-sync, portfolio-builder, ...)
```

## Tokens & typography

- **Single source of truth:** `app/globals.css`. `:root` = light, `.dark` = dark. Colors in `oklch()`, radii via `--radius` scale, custom `--mainmenu-*` tokens for nav surfaces.
- **Text styles** are `@utility` classes synced 1:1 from Figma Styles — heading (h1–h4 + tablet + mobile), body (paragraph/lead/large/small/muted/blockquote), code, button, mono-label, menu-item-mobile. Headings use `--font-display` (Helvetica Now Display Medium 500); body uses `--font-sans` (Inter) or `--font-display` depending on Figma spec; code uses `--font-mono` (Geist Mono); labels use `--font-heading` (JetBrains Mono).
- **No hardcoded colors** anywhere in components — use Tailwind token classes (`bg-background`, `text-muted-foreground`, ...). Known exceptions live in `aurora-background.tsx` / `simple-background.tsx` and are tracked.

## Responsive rules

- Mobile-first. Base styles target 375 px.
- Canonical breakpoint: **`md` (768 px)** — mobile/desktop boundary.
- Prefer CSS (`md:hidden`, `flex-col md:flex-row`) over JS. Reach for `useIsMobile()` only when structure truly differs.
- Verify every change at 375 / 768 / 1280 px.
- Reusable components with breakpoint-dependent behaviour ship with Mobile + Desktop Storybook stories.

## Workflow

**Design-first, Figma ↔ Storybook ↔ Pages.** Never skip Storybook for a reusable component. Page sections / one-off compositions do not need stories.

1. Design or update in Figma (file `DLHU8oCTTZiuX8Iu8AXfOy`).
2. Sync tokens (`token-sync` skill) if variables changed.
3. Build/refresh component + story in Storybook (`story-creator` / `figma-to-code` skills).
4. Compose on a page; verify on three widths.
5. `npm run build` before pushing.

Bidirectional sync via Figma MCP — code can push to Figma (`code-to-figma`) and Figma changes can pull back (`token-sync`).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Next.js dev server (Turbopack) at `:3000` |
| `npm run build` | Production build — run before push |
| `npm run storybook` | Storybook at `:6006` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `format` | ESLint / Prettier |

## Current state (2026-04)

**Shipped**
- Root layout, theming, font pipeline (10 Helvetica Now Display weights wired on `--font-display`).
- Design tokens synced with Figma. Typography `@utility` set matches Figma Styles 1:1.
- Components: button, button-group, switch, separator, typography (ui); main-menu + main-menu-item, mobile-main-menu, responsive-menu, sticky-nav, theme-toggle, analog-clock (v1 & v2), text-card, hero-section, simple-background, aurora-background, logo-lottie (portfolio).
- Responsive mobile nav (closed ↔ open full-screen).
- Light + dark mode.

**Missing / next likely moves**
- "Selected works" section — content, case-study template, project data model (`data/projects.ts`).
- "About" and "History" sections beyond placeholder headings.
- Stories for `separator`, `logo-lottie`, `aurora-background`, `responsive-menu`, `sticky-nav`, `simple-background` (hero-section is a page composition, no story).
- A few hardcoded hex values in `simple-background.tsx` / `aurora-background.tsx` to migrate to tokens.
- Figma text styles for body-paragraph / lead / muted / blockquote / code-inline / button-xs — currently code-only.

## Pointers for concepting sessions

When prompting Claude against this project, lean on these as levers:
- **Mood:** minimal, editorial, tactile motion, AI-native but not AI-loud.
- **Hero message:** 15+ years of digital product design · AI as force multiplier · execution over ideas.
- **Structural constraint:** single-page scroll with four anchor sections (Main / Selected works / About / History).
- **Non-negotiables:** no hardcoded colors, mobile-first, Storybook-before-page, Figma as canonical design source.
- **Narrative axis to expand:** selected works — needs a case-study format (hero shot, problem, role, outcome, visuals) and a project data model.
