---
name: story-creator
description: Create Storybook stories for components. Use when adding stories, creating a new component for Storybook, or batch-generating stories. Triggers on "create story", "add to Storybook", "new component", "stories for all components".
---

# Story creator

Every **reusable component** gets a story before it goes to a page. Page sections, layouts, and one-off compositions (e.g. test cards, demo views) do NOT get stories — only components meant to be reused across the project.

## File locations

- `components/ui/*` → `stories/ui/ComponentName.stories.tsx`
- `components/portfolio/*` → `stories/portfolio/ComponentName.stories.tsx`

## Title convention

- `UI/Button`, `UI/Card` — shadcn/ui components
- `Portfolio/Hero`, `Portfolio/ProjectCard` — custom components
- `Layout/Header`, `Layout/Footer` — layout components

## Story structure

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@/components/ui/component-name'

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { /* map variant/size props to select controls */ },
}
export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = { args: { children: 'Label' } }
```

## Per-story requirements

1. One named export per variant (Default, Destructive, Outline, etc.)
2. `argTypes` with `control: 'select'` for all enum props
3. Wire `onClick`/`onChange` with `import { fn } from '@storybook/test'`
4. Composed story for multi-part components (Card + CardHeader + CardContent)
5. DarkMode story: `decorators: [(Story) => <div className="dark bg-background p-4"><Story /></div>]`

## Token and text style rules

- **All colors** must use token-based Tailwind classes (`bg-primary`, `text-muted-foreground`, `border-border`, etc.) — never hardcoded hex/rgb/oklch values
- **All text** in stories (labels, placeholders, wrappers) must use the project's font tokens (`font-sans`, `font-heading`, `font-mono`) — never rely on browser defaults
- When adding labels or surrounding text in stories, use `font-sans text-sm font-medium` (or the appropriate typography class) to match the project's text styles
- Before writing stories, audit the generated component source for hardcoded colors and replace with the appropriate token from `globals.css`

## Batch mode

When creating stories for all components: list `components/ui/` and `components/portfolio/`, read each source file for props/variants, generate story files. Skip components that already have stories.
