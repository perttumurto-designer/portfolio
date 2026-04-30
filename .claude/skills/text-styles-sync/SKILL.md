---
name: text-styles-sync
description: Pull text styles from the Figma file and sync them to `@utility text-*` rules in `app/globals.css`. Use when the user says "update text styles", "sync text styles", "pull typography from Figma", "text styles changed in Figma", or names a specific style ("BodyParagraphMobile changed").
---

# Text styles sync

Bidirectional Figma → code sync for text styles. Source of truth is the Figma file's local text styles.

## Figma file

The portfolio file key: `DLHU8oCTTZiuX8Iu8AXfOy`. If the user is working in a different file, ask first.

## Step 1 — Pull every text style from Figma

Call `mcp__claude_ai_Figma__use_figma` with the portfolio file key and run:

```js
const styles = await figma.getLocalTextStylesAsync()
return styles.map(s => ({
  name: s.name,
  fontFamily: s.fontName.family,
  fontStyle: s.fontName.style,
  fontSize: s.fontSize,
  lineHeight: s.lineHeight,        // { unit: "AUTO" } | { unit: "PIXELS", value }
  letterSpacing: s.letterSpacing,  // { unit: "PIXELS"|"PERCENT", value }
  textCase: s.textCase,
  textDecoration: s.textDecoration,
}))
```

**Why use_figma not search_design_system** — `search_design_system` returns external library styles, not the file's own local styles. The Plugin API's `getLocalTextStylesAsync()` is the only reliable source.

## Step 2 — Map Figma names to code utility names

Figma uses `Group/Name` naming; code uses kebab-case `text-group-name`. Mobile variants append `Mobile` in Figma → `-mobile` in code.

| Figma name | Code utility |
|---|---|
| `Heading/H1` | `text-heading-h1` |
| `Heading/H1 tablet` | `text-heading-h1-tablet` |
| `Heading/H1 Mobile` | `text-heading-h1-mobile` |
| `Heading/H2` | `text-heading-h2` |
| `Heading/H2 Mobile` | `text-heading-h2-mobile` |
| `Heading/H3` | `text-heading-h3` |
| `Heading/H3 Mobile` | `text-heading-h3-mobile` |
| `Heading/H4` | `text-heading-h4` |
| `Heading/H4 Mobile` | `text-heading-h4-mobile` |
| `Body/Paragraph` | `text-body-paragraph` |
| `Body/Paragraph Mobile` | `text-body-paragraph-mobile` |
| `Body/Lead` | `text-body-lead` |
| `Body/Lead Mobile` | `text-body-lead-mobile` |
| `Body/Large` | `text-body-large` |
| `Body/Large Mobile` | `text-body-large-mobile` |
| `Body/Small` | `text-body-small` |
| `Body/Small Mobile` | `text-body-small-mobile` |
| `Body/Muted` | `text-body-muted` |
| `Body/Muted Mobile` | `text-body-muted-mobile` |
| `Body/Blockquote` | `text-body-blockquote` |
| `Body/Blockquote Mobile` | `text-body-blockquote-mobile` |
| `Code/Inline Code` | `text-code-inline` |
| `Code/Inline Code Mobile` | `text-code-inline-mobile` |
| `Button/Default` | `text-button-default` |
| `Button/Default Mobile` | `text-button-default-mobile` |
| `Button/XS` | `text-button-xs` |
| `Button/XS Mobile` | `text-button-xs-mobile` |
| `Mono/Label` | `text-mono-label` |
| `Mono/Label Mobile` | `text-mono-label-mobile` |

`Heading/MobileMainMenuItems` has no code utility — it's a Figma-only style for mobile menu mocks. Skip.

## Step 3 — Convert Figma values to CSS

| Figma | CSS |
|---|---|
| `fontFamily: "Helvetica Now Display"` | `font-family: var(--font-display)` |
| `fontFamily: "Inter"` | `font-family: var(--font-sans)` |
| `fontFamily: "JetBrains Mono"` | `font-family: var(--font-heading)` |
| `fontFamily: "Geist Mono"` | `font-family: var(--font-mono)` |
| `fontStyle: "Regular"` | `font-weight: 400` |
| `fontStyle: "Medium"` | `font-weight: 500` |
| `fontStyle: "SemiBold"` | `font-weight: 600` |
| `fontStyle: "Bold"` | `font-weight: 700` |
| `fontStyle: "Italic"` | `font-style: italic; font-weight: 400` |
| `fontSize: 14` | `font-size: 0.875rem` *(px / 16)* |
| `lineHeight: { unit: "AUTO" }` | `line-height: normal` |
| `lineHeight: { unit: "PIXELS", value: 22 }` | `line-height: 1.375rem` *(px / 16)* |
| `letterSpacing: { unit: "PIXELS", value: -0.44 }` | `letter-spacing: -0.44px` *(round to 2dp)* |
| `letterSpacing: 0` | `letter-spacing: 0` |

## Step 4 — Diff against `app/globals.css`

Read the file. For each `@utility text-*` block, compare each property against the mapped Figma style. Build a punch list:

```
text-body-paragraph-mobile: font-size 1rem → 0.875rem, line-height 1.375rem → 1.125rem
text-body-lead: font-family --font-sans → --font-display
…
```

Report the diff to the user before writing. If the user said "update everything", apply all. If they named specific styles, only touch those.

## Step 5 — Apply changes

Use `Edit` per utility block. Preserve existing structure (blank lines, comments, property order). Don't touch utilities that have `color:` or other extra properties unless the diff requires it (e.g. `text-body-muted` has a color line).

## Step 6 — Verify

1. Run `npm run build` and confirm it passes.
2. Report a summary of what changed: utility name, before → after.

## Notes

- Figma's `letterSpacing.unit: "PERCENT"` is em-relative; convert with `value/100 + 'em'` if it ever appears (currently no styles use it).
- Figma `textCase` and `textDecoration` are NOT mirrored to the utilities — `uppercase` etc. is applied at the call site via Tailwind class. Don't add `text-transform` to utilities.
- If a Figma style has no matching code utility, *ask* before creating it. Don't auto-create utilities — they need a corresponding consumer in the codebase.
- If a code utility has no matching Figma style, flag it — it might be deprecated.
