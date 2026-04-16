# Project Description

A design system-driven web project built with Next.js, Tailwind CSS v4, TypeScript, and shadcn/ui. The defining characteristic of this project is the workflow: an AI agent (Claude Code) orchestrates the entire pipeline between Figma, Storybook, and production code using a set of custom skills.

## Tech Stack

Next.js App Router, shadcn/ui, Tailwind CSS v4, TypeScript, Storybook 10, Figma (via MCP).

## How It Works

The project follows a strict design-first pipeline:

```
Figma  ──→  Storybook  ──→  Pages
  ↑                           │
  └───── Token Sync ──────────┘
```

**Figma** is the design tool. Components are designed as Figma component sets with variants, and all colors and radii are bound to Figma Variables — never hardcoded hex values. The variable collections (Colors with Light/Dark modes, Radius) mirror the CSS custom properties in code.

**Storybook** is the component workbench and the bridge between design and code. Every reusable component must have stories before it appears on a page. Stories demonstrate all variants, sizes, states, compositions, and dark mode rendering. Storybook is also the reference when building Figma components — the stories define what the Figma component must support.

**Claude Code** is the builder. It reads designs from Figma, writes components and stories, syncs design tokens bidirectionally, and builds Figma component sets from code. It operates through a set of project-specific skills that encode the workflow rules and hard-won lessons from building this system.

## Design Tokens

`app/globals.css` is the single source of truth. Tokens are defined as CSS custom properties in oklch color format with `:root` (light) and `.dark` (dark) scopes. They flow through Tailwind into components and Storybook automatically.

Tokens sync bidirectionally with Figma Variables via the Figma MCP connection — code tokens can be pushed to Figma, and Figma changes can be pulled back to code.

## Project Structure

```
app/globals.css          Design tokens (CSS variables)
components/ui/           shadcn/ui components
components/portfolio/    Custom components
stories/ui/              Stories for ui components
stories/portfolio/       Stories for custom components
data/                    Static data
.claude/skills/          Claude Code skills
```

## Skills

Skills are markdown instruction files (`.claude/skills/*/SKILL.md`) that give Claude Code domain-specific knowledge about this project's workflow. Each skill covers one concern and they reference each other where workflows overlap.

| Skill | Purpose |
|---|---|
| **token-sync** | Syncs design tokens between `globals.css` and Figma Variables. Handles oklch-to-hex conversion, compound alpha calculations for opacity-baked variables, and drift detection. |
| **story-creator** | Creates Storybook stories for components. Enforces conventions: one export per variant, dark mode decorator with proper token inheritance, argTypes for all enum props. |
| **figma-to-code** | Translates a Figma frame into production code. Maps Figma elements to existing components, builds missing ones, and composes layouts using Tailwind classes matched to Figma auto-layout properties. |
| **code-to-figma** | The reverse — builds Figma component sets from code. Studies Storybook stories first as the design reference, audits existing Figma variables, creates missing ones, and builds component variants with all fills bound to variables. |
| **design-system-sync** | Audits consistency across all three systems. Counts components vs stories, checks for hardcoded values, compares token counts between code and Figma, and flags drift. |
| **portfolio-conventions** | Project-specific rules: file placement, routing, data models, Next.js patterns, and responsive breakpoints. Used alongside other skills to know where code goes. |

## Key Workflow Rules

- No hardcoded colors anywhere — CSS variables via Tailwind in code, Figma Variables in design
- Never combine paint-level opacity with variable-bound fills in Figma — alpha is baked into the variable value
- Dark mode scopes in Storybook must include `text-foreground` to prevent CSS color inheritance issues
- Always audit existing Figma variables before building — use `getLocalVariableCollectionsAsync()`, not search
- Always study Storybook stories before building Figma components — stories are the design spec
