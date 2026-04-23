"use client"

import { useEffect, useState } from "react"
import { FileUser, House, Info, Layers } from "lucide-react"
import { HeroSection } from "@/components/portfolio/hero-section"
import { SelectedWorks } from "@/components/portfolio/selected-works"
import { StickyNav } from "@/components/portfolio/sticky-nav"

const sections = [
  { id: "main", label: "Main", icon: House },
  { id: "selected-works", label: "Selected works", icon: Layers },
  { id: "about", label: "About", icon: Info },
  { id: "history", label: "History", icon: FileUser },
] as const

export default function Page() {
  const [activeId, setActiveId] = useState<string>("main")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    )

    const observed: HTMLElement[] = []
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) {
        observer.observe(el)
        observed.push(el)
      }
    }

    return () => {
      for (const el of observed) observer.unobserve(el)
      observer.disconnect()
    }
  }, [])

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
      <SelectedWorks />
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
