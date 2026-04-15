---
name: design-system-sync
description: Audit design system consistency across Figma, Storybook, and code. Use when checking sync status, finding missing stories, auditing tokens, or running health checks. Triggers on "is everything in sync", "audit", "what's missing", "check consistency", "design system health", "check drift".
---

# Design system sync

Audit consistency across Figma, Storybook, and code.

## Quick check (default)

Run this when user asks "is everything in sync?" or similar:

1. Count `.tsx` files in `components/ui/` and `components/portfolio/`
2. Count `.stories.tsx` files in `stories/ui/` and `stories/portfolio/`
3. List components missing stories
4. Grep `components/**/*.tsx` for hardcoded values: `/#[0-9a-fA-F]{3,8}/`, `rgb(`, `hsl(`, `style={{`
5. If Figma MCP connected: read Variables, compare count with `app/globals.css` custom properties

Output format:

```
Design system status:
  Components: {n} total, {m} with stories {✓/✗}
  Tokens: {n} in code, {m} in Figma {✓/✗}
  Hardcoded values: {n} violations {✓/✗}
```

## Full audit

When user asks for detailed audit, expand quick check with:

- List each component and its story status
- List each token and whether it exists in both code and Figma
- List each hardcoded violation with file path, line number, and suggested replacement
- List components that exist in Figma but not in code (and vice versa)
- Check that all Figma component fills/strokes are bound to Variables (not raw hex)
- Check that all Figma text layers use Text Styles (not unlinked text)
- Check that all code colors use token-based Tailwind classes
- Check that all code text uses project font tokens (`font-sans`, `font-heading`, `font-mono`)
- Check that no Figma fill uses paint-level opacity combined with a variable-bound color (instances break) — flag these and recommend creating a dedicated variable with alpha baked in

## Fix mode

When user asks to "fix" or "fix everything":

1. Generate missing stories (follow story-creator file locations and conventions)
2. Replace hardcoded values with token-based Tailwind classes
3. Report tokens that need syncing (user should run token sync separately)
4. Run `npm run build` to verify
5. List all changes made
