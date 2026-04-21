"use client"

import { useState } from "react"
import { FileUser, House, Info, Layers } from "lucide-react"
import { HeroSection } from "@/components/portfolio/hero-section"
import { StickyNav } from "@/components/portfolio/sticky-nav"

const sections = [
  { id: "main", label: "Main", icon: House },
  { id: "selected-works", label: "Selected works", icon: Layers },
  { id: "about", label: "About", icon: Info },
  { id: "history", label: "History", icon: FileUser },
] as const

export default function Page() {
  const [activeId, setActiveId] = useState<string>("main")

  const items = sections.map((s) => ({
    label: s.label,
    icon: s.icon,
    active: s.id === activeId,
    onClick: () => {
      setActiveId(s.id)
      document
        .getElementById(s.id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
  }))

  return (
    <>
      <StickyNav items={items} />
      <HeroSection />
      <section
        id="selected-works"
        className="flex min-h-svh scroll-mt-24 items-center justify-center px-6"
      >
        <h2 className="text-heading-h1-mobile md:text-heading-h1">
          Selected works
        </h2>
      </section>
      <section
        id="about"
        className="flex min-h-svh scroll-mt-24 items-center justify-center px-6"
      >
        <h2 className="text-heading-h1-mobile md:text-heading-h1">About</h2>
      </section>
      <section
        id="history"
        className="flex min-h-svh scroll-mt-24 items-center justify-center px-6"
      >
        <h2 className="text-heading-h1-mobile md:text-heading-h1">History</h2>
      </section>
    </>
  )
}
