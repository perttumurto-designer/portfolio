# Portfolio Design System

Next.js + shadcn/ui portfolio site with Storybook and Figma token sync.

## Getting started

```bash
npm run dev        # dev server
npm run storybook  # Storybook
npm run build      # production build
```

## Adding shadcn components

```bash
npx shadcn@latest add button
```

Components are placed in `components/ui/`.

## File structure

```
app/                 ← Pages and layouts
  globals.css        ← Design tokens (CSS variables)
components/
  ui/                ← shadcn/ui components
  portfolio/         ← Custom portfolio components
hooks/               ← Custom React hooks
lib/utils.ts         ← cn() helper
stories/             ← Storybook stories
.claude/skills/      ← Claude Code skills
.storybook/          ← Storybook config
```

## Figma MCP

Cursor connects to Figma via `https://mcp.figma.com/mcp`. Token sync reads `app/globals.css` and writes Figma Variables (and vice versa).
