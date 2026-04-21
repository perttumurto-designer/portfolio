"use client"

import { useRef } from "react"
import { AnalogClock2 } from "@/components/portfolio/analog-clock-2"
import SimpleBackground from "@/components/portfolio/simple-background"
import { TextCard } from "@/components/portfolio/text-card"
import { useDraggable } from "@/hooks/use-draggable"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const clockDrag = useDraggable({ containerRef })
  const cardDrag = useDraggable({ containerRef })

  return (
    <section
      id="main"
      className="relative flex min-h-dvh w-full items-stretch p-0 md:p-6"
    >
      <div
        ref={containerRef}
        className="relative flex w-full flex-col justify-end gap-6 overflow-hidden border border-mainmenu-border p-6 md:rounded-4xl md:p-8"
      >
        <SimpleBackground
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Clock row */}
        <div
          className="relative z-10 w-max"
          style={clockDrag.style}
          onPointerDown={clockDrag.onPointerDown}
        >
          <AnalogClock2 size={140} className="lg:size-[160px]" />
        </div>

        {/* Intro + TextCard row — stacked on mobile, side-by-side md+ */}
        <div className="relative z-10 flex w-full flex-col items-stretch gap-6 md:flex-row md:items-center">
          <p className="flex-1 text-heading-h1-mobile text-mainmenu-content md:text-heading-h1-tablet lg:text-heading-h1">
            With 15+ years in digital product design, I craft user-centric
            solutions from insights to UI, balancing aesthetics and function
            while collaborating closely with teams to align design with business
            goals. Using and utilizing AI when it is necessary and useful.
          </p>
          <div
            className="w-full md:max-w-[320px] md:flex-shrink-0"
            style={cardDrag.style}
            onPointerDown={cardDrag.onPointerDown}
          >
            <TextCard
              label="AI WAY OF DESIGNING"
              heading="2,000% Faster"
              lead="When we're moving faster than ever, direction matters more than ever."
              body="Design has never been more valuable. When everyone can build everything, the best and most meaningful experience wins. If your product doesn't feel right, someone else can ship a better one by tomorrow. Ideas aren't valuable. Execution is."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
