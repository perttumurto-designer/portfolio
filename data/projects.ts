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
  // Optional shorter copy for the mobile card. Falls back to lead / description.
  leadMobile?: string
  descriptionMobile?: string
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
    roles: ["Lead Product Designer"],
    lead:
      "Etuovi.com mobile app — a user-experience-driven housing marketplace serving 900,000 weekly users. I led the UX and UI design, built the mobile component library, and owned the visual direction end to end.",
    description:
      "Alma Marketplaces wanted to turn Etuovi.com from a web marketplace into a genuine mobile service for home changers, designed on the terms of a native app rather than a shrunk-down website. I owned the UX and UI design from concept to launch, created all production-ready screens, and built the mobile component library that became the foundation of the product's design system. Users were involved twice along the way: a concept prototype validated the direction early on, and a production-fidelity prototype drove usability testing that refined the final experience before release.",
    leadMobile:
      "Etuovi.com mobile app — a housing marketplace for 900,000 weekly users. I led UX/UI and built the mobile component library.",
    descriptionMobile:
      "Alma turned Etuovi from a web marketplace into a real native mobile service. I owned design from concept to launch and built the design system that became the product's foundation.",
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
    leadMobile:
      "KONE tendering & ordering — service design across EU, APAC, and China. I led research and mapped the end-to-end process.",
    descriptionMobile:
      "Three regions, no shared view of how the work flowed. I ran the interviews, mapped the journey, and delivered the recommendations stakeholders needed to act on.",
    heroImage: "/SelectedWorks/Case2/Kone-work.mp4",
    year: 2023,
  },
  {
    slug: "op",
    title: "OP",
    client: "OP",
    clientLogo: "/SelectedWorks/Case3/op-logo.svg",
    roles: ["Lead Product Designer", "UX Chapter Lead"],
    lead:
      "OP Mobiili. Five years at Finland's largest bank, designing on a channel that handles over 40 million interactions a month. I shipped new services from concept, owned the flows people actually live in day to day, and led the UX chapter of around 50 designers.",
    description:
      "OP Mobiili is where the bank meets most of its customers, most of the time, so the work there carried real weight. I concepted and shipped new services such as Säästölipas and Talouden tasapaino, and held the design ownership of high-traffic flows like tilitapahtumat that sit at the core of daily use. The work was omnichannel in scope, with mobile as the strategic priority.",
    leadMobile:
      "OP Mobiili. Five years at Finland's largest bank — 40M+ monthly interactions. I shipped new services and led the UX chapter of ~50 designers.",
    descriptionMobile:
      "OP Mobiili is where the bank meets most customers, most of the time. I concepted Säästölipas and Talouden tasapaino, and owned high-traffic core flows like tilitapahtumat.",
    heroImage: "/SelectedWorks/Case3/op.jpg",
    year: 2022,
  },
  {
    slug: "polar-club",
    title: "Polar Club",
    client: "Polar",
    clientLogo: "/SelectedWorks/Case4/polar.svg",
    clientLogoWidth: 120,
    roles: ["Lead UX Designer"],
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
    roles: ["Creative Lead", "Product Design", "Art Director"],
    lead:
      "Mobile application and car IVI. A rebrand and UX refresh for Alps Alpine's consumer app and in-vehicle infotainment software. As Creative Lead, I set the creative direction, worked hands-on with UX and screens, and led a team of four designers across four countries to deliver a unified look and a multibrand design system spanning both surfaces.",
    description:
      "Alps Alpine needed its consumer-facing software to feel like one product across two very different surfaces, a mobile app and the in-vehicle infotainment system, and across multiple brands under its umbrella. I led the engagement as Creative Lead, owning delivery end to end: planning, creative direction, and hands-on UX and screen design alongside the team. We shipped a new visual language and a multibrand design system built to carry across mobile and IVI without losing each brand's identity. The team and stakeholders spanned Finland, the USA, Poland, and Japan, which shaped how the system was documented and handed off.",
    leadMobile:
      "Mobile + car IVI. Rebrand and UX refresh for Alps Alpine. As Creative Lead I directed a team of four across four countries.",
    descriptionMobile:
      "One product across two surfaces and multiple brands. Creative direction and a multibrand design system carrying mobile and IVI without losing each brand's identity.",
    heroImage: "/SelectedWorks/Case5/Alps.jpg",
    heroImageLight: "/SelectedWorks/Case5/AlpsLight.jpg",
    year: 2024,
  },
]
