---
name: figma-to-code
description: Implement a Figma design into code. Use when the user provides a Figma URL or asks to build/implement/code a layout from Figma. Triggers on Figma URLs (figma.com/design/), "implement this design", "code this layout", "build from Figma".
---

# Figma to code

Translate a Figma frame into production code. This is the primary build skill — layouts come from Figma, this skill implements them.

## Steps

### 1. Read design

- `get_design_context` with file key + node ID from URL
- `get_screenshot` for visual reference (this is the accuracy target)
- `get_variable_defs` for token usage

### 2. Map to existing components

List `components/ui/` and `components/portfolio/`. Map every Figma element to an existing component. Flag elements with no match — these need new components.

### 3. Build missing components

For each unmatched element: create component → create story (per story-creator convention) → verify in Storybook. Only then proceed.

### 4. Decide placement

Read `portfolio-conventions` skill for where the code goes:
- Which file? (`app/page.tsx`, `app/projects/page.tsx`, etc.)
- What data source? (static data from `data/projects.ts`, etc.)
- What Next.js components? (`<Image>`, `<Link>`, metadata exports)

If the Figma frame is a section (hero, about, contact), create it as a component in `components/portfolio/` and import it into the correct page.

### 5. Compose layout

Assemble using existing + new components. Match Figma layout with Tailwind:

| Figma | Tailwind |
|---|---|
| Auto layout horizontal | `flex flex-row gap-{n}` |
| Auto layout vertical | `flex flex-col gap-{n}` |
| Fill container | `w-full` or `flex-1` |
| Padding | `p-{n}` or `px-{n} py-{n}` |
| Corner radius | `rounded-*` (uses --radius token) |
| Colors | Token classes: `bg-primary`, `text-muted-foreground` |

Avoid `w-[{n}px]` — prefer responsive utilities. If Figma uses a color not in globals.css, flag it instead of hardcoding.

### 6. Validate

Run `npm run build`. Compare visually with Figma screenshot.