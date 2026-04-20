---
name: portfolio-conventions
description: Portfolio project conventions — page structure, data models, and Next.js patterns. Use alongside figma-to-code to know WHERE code goes and HOW data works. Triggers on "where does this go", "page structure", "data model", "add a new page", "routing".
---

# Portfolio conventions

Project-specific rules that Figma designs don't tell you: file placement, data, routing, and Next.js patterns.

## Page structure

```
app/
  layout.tsx           ← Root layout: Navigation + Footer wrap all pages
  page.tsx             ← Home: Hero + Projects + About + Contact sections
  projects/
    page.tsx           ← All projects grid
    [slug]/page.tsx    ← Single project detail
```

Sections (hero, about, contact) are components in `components/portfolio/` imported into `app/page.tsx`.

## Data

Project data is static in `data/projects.ts`:

```tsx
export interface Project {
  slug: string; title: string; description: string;
  image: string; tags: string[];
  url?: string; github?: string;
}
export const projects: Project[] = [...]
```

Import and use directly — no API calls needed for static portfolio.

## Next.js patterns

- Images: `<Image>` from `next/image` with `width`, `height`, `alt` (never `<img>`)
- Links: `<Link>` from `next/link` (never `<a>` for internal routes)
- Metadata: export `metadata` object from page files for SEO
- Semantic HTML: `<section>`, `<nav>`, `<main>`, `<article>`, `<footer>`

## Responsive

Mobile first. Write base styles for 375px, then add `md:` (768px, the mobile/desktop boundary), `lg:` (1024px), `xl:` (1280px) as needed.

- Prefer Tailwind responsive classes: `flex-col md:flex-row`, `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- For structural swap (different DOM per breakpoint), mirror the [responsive-menu.tsx](../../../components/portfolio/responsive-menu.tsx) dual-render pattern
- For JS-side breakpoint detection, import `useIsMobile` from [@/hooks/use-is-mobile](../../../hooks/use-is-mobile.ts) — never call `matchMedia` inline
- Page sections in `app/page.tsx` must read well at 375px without horizontal scroll
- Navigation/menus: always provide both desktop and mobile variants (see [ResponsiveMenu](../../../components/portfolio/responsive-menu.tsx))
- Verify on 375 / 768 / 1280 before shipping
