---
name: token-sync
description: Sync design tokens between Figma Variables and code (globals.css). Use when pushing tokens to Figma, pulling changes from Figma to code, or checking drift. Triggers on "sync", "tokens", "variables", "update colors", "push to Figma", "pull from Figma", "check drift".
---

# Token sync

Bidirectional token sync between Figma Variables and `app/globals.css`.

## Code → Figma

1. Read `app/globals.css`, extract CSS custom properties from `:root` (light) and `.dark` (dark)
2. Group into Colors (--background, --foreground, --primary, etc.) and Radius (--radius)
3. Convert HSL values (`H S% L%` without wrapper) to hex/RGBA for Figma
4. Via Figma MCP `use_figma` with `skillNames: "figma-use"`:
   - Inspect file first — match existing structure
   - Create/update Variable Collection "Theme" with modes "Light" and "Dark"
   - One Variable per token, prefixed: `Colors/Background`, `Radius/Base`
   - See `references/token-map.md` for full naming table
5. Validate with `get_metadata`

## Figma → Code

1. Read Figma Variables from "Theme" collection via MCP
2. Convert hex/RGBA back to HSL format `H S% L%`
3. Update `app/globals.css` `:root` and `.dark` blocks
4. Run `npm run build` to verify
5. Report changes: old → new values

## Drift check

1. Read both sources
2. Compare (allow small HSL↔hex rounding differences)
3. Report mismatches as table
4. Suggest sync direction

## Notes

- `--radius` is rem, not a color — handle separately
- Storybook updates automatically (imports globals.css)
