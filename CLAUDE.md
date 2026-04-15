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

## Token flow

app/globals.css → Tailwind → Components → Storybook (auto via preview.tsx import)
Figma Variables ↔ globals.css (bidirectional via MCP)
