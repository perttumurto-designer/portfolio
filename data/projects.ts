// Assets live under public/SelectedWorks/CaseN/.
// Logo slot expects logo.svg; hero slot supports images (.jpg/.png/.webp/.avif)
// and video (.mp4/.webm/.mov/.m4v — silent, looping, no controls).
// Point heroImage / clientLogo at the exact file path; filenames don't have to
// match a convention.
// Descriptions and roles are placeholder copy — replace when writing real case
// studies.

export type Project = {
  slug: string
  title: string
  client: string
  clientLogo: string
  roles: readonly string[]
  lead: string
  description: string
  heroImage: string
  year?: number
}

export const projects: readonly Project[] = [
  {
    slug: "etuovi",
    title: "Etuovi",
    client: "Etuovi",
    clientLogo: "/SelectedWorks/Case1/logo.svg",
    roles: ["Lead Product Designer", "Design System Owner"],
    lead:
      "Etuovi.com mobile app — a user-experience-driven housing marketplace serving 900,000 weekly users. I led the UX and UI design, built the mobile component library, and owned the visual direction end to end.",
    description:
      "Alma Marketplaces wanted to turn Etuovi.com from a web marketplace into a genuine mobile service for home changers, designed on the terms of a native app rather than a shrunk-down website. I owned the UX and UI design from concept to launch, created all production-ready screens, and built the mobile component library that became the foundation of the product's design system. Users were involved twice along the way: a concept prototype validated the direction early on, and a production-fidelity prototype drove usability testing that refined the final experience before release.",
    heroImage: "/SelectedWorks/Case1/Etuovi-tyonaytaaa2.jpg",
    year: 2024,
  },
  {
    slug: "kone",
    title: "Kone",
    client: "Kone",
    clientLogo: "/SelectedWorks/Case2/logo.svg",
    roles: ["Principal Designer", "UX Chapter Lead"],
    lead: "Product design work with Kone.",
    description: "Case study description to follow.",
    heroImage: "/SelectedWorks/Case2/Kone-work.mp4",
    year: 2023,
  },
  {
    slug: "polar-club",
    title: "Polar Club",
    client: "Polar",
    clientLogo: "/SelectedWorks/Case3/logo.svg",
    roles: ["Senior Product Designer"],
    lead: "Product design work with Polar on Polar Club.",
    description: "Case study description to follow.",
    heroImage: "/SelectedWorks/Case3/PolarClubWorkSampleNew-small.mp4",
    year: 2022,
  },
  {
    slug: "op",
    title: "OP",
    client: "OP",
    clientLogo: "/SelectedWorks/Case4/logo.svg",
    roles: ["Lead Designer", "Interaction Lead"],
    lead: "Product design work with OP.",
    description: "Case study description to follow.",
    heroImage: "/SelectedWorks/Case4/OP-tyonautaaaa2.jpg",
    year: 2022,
  },
]
