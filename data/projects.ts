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
  clientLogo?: string
  clientLogoWidth?: number
  roles: readonly string[]
  lead: string
  description: string
  heroImage: string
  heroImageLight?: string
  year?: number
}

export const projects: readonly Project[] = [
  {
    slug: "etuovi",
    title: "Etuovi",
    client: "Etuovi",
    clientLogo: "/SelectedWorks/Case1/Alma_Logo_Black 1.svg",
    roles: ["Lead Product Designer", "Design System Owner"],
    lead:
      "Etuovi.com mobile app — a user-experience-driven housing marketplace serving 900,000 weekly users. I led the UX and UI design, built the mobile component library, and owned the visual direction end to end.",
    description:
      "Alma Marketplaces wanted to turn Etuovi.com from a web marketplace into a genuine mobile service for home changers, designed on the terms of a native app rather than a shrunk-down website. I owned the UX and UI design from concept to launch, created all production-ready screens, and built the mobile component library that became the foundation of the product's design system. Users were involved twice along the way: a concept prototype validated the direction early on, and a production-fidelity prototype drove usability testing that refined the final experience before release.",
    heroImage: "/SelectedWorks/Case1/Etuovi1.jpg",
    year: 2024,
  },
  {
    slug: "kone",
    title: "Kone",
    client: "Kone",
    clientLogo: "/SelectedWorks/Case2/Kone.svg",
    clientLogoWidth: 100,
    roles: ["Service Designer"],
    lead:
      "KONE tendering & ordering — a service design engagement across EU, APAC, and China to align how sales and CSE teams quote and fulfill elevator orders. I led the research, mapped the end-to-end process, and delivered a journey map and recommendations that gave stakeholders a shared picture of work that had never been seen whole.",
    description:
      "KONE's tendering and ordering process spanned three regions with different workflows, tools, and team cultures, and no shared view of how the work actually flowed end to end. I worked as a Service Designer to surface that picture and point at where it could be better. The work combined interviews with sales and CSE teams across regions, end-to-end process mapping, and co-creation sessions that pulled stakeholders into the same room with the same evidence. The outcome was a cross-regional journey map, a clear read on the pain points and opportunities that mattered most, and a set of practical recommendations the business could act on — a foundation for smoother operations and continuous improvement rather than a one-off fix.",
    heroImage: "/SelectedWorks/Case2/Kone-work.mp4",
    year: 2023,
  },
  {
    slug: "op",
    title: "OP",
    client: "OP",
    clientLogo: "/SelectedWorks/Case3/op-logo.svg",
    roles: ["Lead Designer", "Interaction Lead"],
    lead: "Product design work with OP.",
    description: "Case study description to follow.",
    heroImage: "/SelectedWorks/Case3/op.jpg",
    year: 2022,
  },
  {
    slug: "polar-club",
    title: "Polar Club",
    client: "Polar",
    clientLogo: "/SelectedWorks/Case4/polar.svg",
    clientLogoWidth: 120,
    roles: ["Senior Product Designer"],
    lead: "Product design work with Polar on Polar Club.",
    description: "Case study description to follow.",
    heroImage: "/SelectedWorks/Case4/PolarClubWorkSampleNew-small.mp4",
    year: 2022,
  },
  {
    slug: "alps-alpine",
    title: "Alps Alpine",
    client: "Alps Alpine",
    clientLogo: "/SelectedWorks/Case5/AlpsAlpine.svg",
    clientLogoWidth: 160,
    roles: ["Creative Lead"],
    lead:
      "Mobile application and car IVI. A rebrand and UX refresh for Alps Alpine's consumer app and in-vehicle infotainment software. As Creative Lead, I set the creative direction, worked hands-on with UX and screens, and led a team of four designers across four countries to deliver a unified look and a multibrand design system spanning both surfaces.",
    description:
      "Alps Alpine needed its consumer-facing software to feel like one product across two very different surfaces, a mobile app and the in-vehicle infotainment system, and across multiple brands under its umbrella. I led the engagement as Creative Lead, owning delivery end to end: planning, creative direction, and hands-on UX and screen design alongside the team. We shipped a new visual language and a multibrand design system built to carry across mobile and IVI without losing each brand's identity. The team and stakeholders spanned Finland, the USA, Poland, and Japan, which shaped how the system was documented and handed off.",
    heroImage: "/SelectedWorks/Case5/Alps.jpg",
    heroImageLight: "/SelectedWorks/Case5/AlpsLight.jpg",
    year: 2024,
  },
]
