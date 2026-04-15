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

Mobile first → `md:` (768px) → `lg:` (1024px).
