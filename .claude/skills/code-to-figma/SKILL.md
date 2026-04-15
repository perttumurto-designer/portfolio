---
name: code-to-figma
description: Build Figma components from code. Use when creating or updating Figma component sets to match existing code components. Triggers on "build in Figma", "add to Figma", "create Figma component", "sync component to Figma", "push to Figma".
---

# Code to Figma

Build Figma components from existing code components. The reverse of figma-to-code — code is the source of truth, Figma is the target.

## Steps

### 1. Study Storybook stories (MANDATORY first step)

Read the component's `.stories.tsx` file and list every story. This is the design reference — it defines what the Figma component must support. For each story, note:
- Button variants, sizes, states used
- Composition patterns (separators, text labels, icons)
- Dark mode rendering

**Never build a Figma component without studying its Storybook stories first.**

### 2. Audit existing Figma variables

Inspect the file's actual local variables using `use_figma` with `getLocalVariableCollectionsAsync()` and `getVariableByIdAsync()`. Never rely on `search_design_system` (misses local variables) or `get_variable_defs` (only shows variables on a specific node).

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
// then iterate collection.variableIds with getVariableByIdAsync
```

Determine which variables already exist and which need to be created.

### 3. Create missing variables

Add any missing variables to the existing collections ("Colors" with Light/Dark modes, "Radius" with single mode). Follow existing naming convention (Title Case, no prefix group).

**Compound alpha rule:** When creating opacity-baked variables for Tailwind `color/opacity` patterns, baked alpha = base token alpha × Tailwind modifier. See token-sync skill for the full rule and examples.

### 4. Read component source

Read the component `.tsx` file to understand:
- Variant properties (CVA variants)
- Sub-components (e.g. ButtonGroupText, ButtonGroupSeparator)
- Which tokens each variant uses (fills, strokes, text colors)

### 5. Build component set

Work incrementally with `use_figma` — one step per call, validate after each:

1. **Create variant components** — one per variant combination
2. **Add child nodes** — instances of existing components, separators, text nodes
3. **Bind variables** — all fills/strokes to color variables, corner radii to radius variables
4. **Combine as variants** — `figma.combineAsVariants()`, then position in grid
5. **Position on page** — place near existing components

**Rules:**
- All fills/strokes must be bound to Figma variables — no hardcoded hex
- Paint opacity must be 1.0 on variable-bound fills (alpha baked in variable)
- Button sizing: FIXED height (matches component), not HUG (collapses in auto-layout)
- Return all created node IDs from every `use_figma` call
- Use `get_screenshot` after major milestones to catch visual issues

### 6. Build sub-components

Create standalone components for sub-elements (e.g. ButtonGroupText):
- Bind all fills/strokes/text to variables
- Add TEXT component properties for editable labels
- Expose as separate components on the page

### 7. Create showcase instances

Create demonstration instances matching each Storybook story:
- One instance per story, labeled with the story name
- Configure nested component instances via `setProperties()`
- **Dark mode showcase**: wrap in a frame with `setExplicitVariableModeForCollection(colorsCollection, darkModeId)` and `bg-background` variable fill
- Group all showcases in a Figma Section

**Cannot modify instance children:** You can't add/remove children from component instances. For compositions that mix different component types (e.g. ButtonGroupText + Button), build manually using a frame with individual instances.

### 8. Verify

1. Take `get_screenshot` of each showcase and compare with Storybook
2. Toggle Light/Dark modes — all variable-bound fills should switch correctly
3. Verify designers can configure nested instances (change variant, size, text)
4. Check no stray nodes left on the page — list all top-level nodes and clean up
