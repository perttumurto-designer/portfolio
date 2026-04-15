---
name: token-sync
description: Sync design tokens between Figma Variables and code (globals.css). Use when pushing tokens to Figma, pulling changes from Figma to code, or checking drift. Triggers on "sync", "tokens", "variables", "update colors", "push to Figma", "pull from Figma", "check drift".
---

# Token sync

Bidirectional token sync between Figma Variables and `app/globals.css`.

## Audit existing Figma variables (MANDATORY before any sync)

Before syncing, always inspect the file's actual local variables using `use_figma` with `getLocalVariableCollectionsAsync()` and `getVariableByIdAsync()`. Never assume the variable state — `search_design_system` may miss local variables and `get_variable_defs` only shows variables on a specific node. Verify the full collection structure first, then determine what needs to be created or updated.

## Code → Figma

1. Read `app/globals.css`, extract CSS custom properties from `:root` (light) and `.dark` (dark)
2. Group into Colors (--background, --foreground, --primary, etc.) and Radius (--radius)
3. Convert oklch values to hex/RGBA for Figma (note: some dark mode tokens include alpha, e.g. `oklch(1 0 0 / 15%)`)
4. Via Figma MCP `use_figma` with `skillNames: "figma-use"`:
   - Inspect file first — match existing structure
   - Create/update Variable Collection "Colors" (modes: "Light" and "Dark") and "Radius" (single mode)
   - One Variable per token: `Background`, `Primary`, `Border`, etc. (Title Case, no prefix group)
   - See `references/token-map.md` for full naming table
5. Validate with `get_metadata` and `get_screenshot`

## Figma → Code

1. Read Figma Variables from "Colors" and "Radius" collections via MCP
2. Convert hex/RGBA back to oklch format for `globals.css`
3. Update `app/globals.css` `:root` and `.dark` blocks
4. Run `npm run build` to verify
5. Report changes: old → new values

## Drift check

1. Read both sources
2. Compare (allow small HSL↔hex rounding differences)
3. Report mismatches as table
4. Suggest sync direction

## Compound alpha rule for opacity-baked variables (CRITICAL)

When creating Figma variables for Tailwind `color/opacity` patterns (e.g. `bg-input/30`), the baked alpha must be **base token alpha × Tailwind modifier**, not just the modifier alone.

**Example — `Input Background` for `bg-input/30`:**

| Mode | Base token `--input` | Tailwind `/30` | Correct baked alpha |
|---|---|---|---|
| Light | `oklch(0.922 0 0)` → solid (alpha=1.0) | ×0.3 | **0.3** (1.0 × 0.3) |
| Dark | `oklch(1 0 0 / 15%)` → alpha=0.15 | ×0.3 | **0.045** (0.15 × 0.3) |

Dark mode base tokens like `--input` and `--border` already have alpha (15%, 10%). Ignoring this and using just the modifier (0.3) produces a fill 6× too opaque in dark mode.

**Checklist for every opacity-baked variable:**
1. Read the base token value from `globals.css` for BOTH `:root` and `.dark`
2. Check if the base token has alpha (e.g. `oklch(1 0 0 / 15%)`)
3. Multiply: `baked alpha = base alpha × tailwind modifier`
4. Set paint opacity to 1.0 on the component — never combine paint opacity with variable-bound fills

## Notes

- `--radius` is rem, not a color — handle separately
- Storybook updates automatically (imports globals.css)
