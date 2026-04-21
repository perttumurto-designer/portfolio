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
      className="relative flex min-h-svh w-full items-stretch p-4 md:h-svh md:p-8"
    >
      <div
        ref={containerRef}
        className="relative w-full flex-1 overflow-hidden rounded-2xl border border-mainmenu-border md:rounded-4xl"
      >
        <SimpleBackground
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Clock — stacked on mobile (<md); absolute md+ (120px at md, 169px at xl) */}
        <div
          className="relative z-10 mx-[22px] mt-[90px] w-max md:absolute md:left-[4%] md:top-[40%] md:mx-0 md:mt-0"
          style={clockDrag.style}
          onPointerDown={clockDrag.onPointerDown}
        >
          <AnalogClock2
            size={85}
            className="md:size-[120px] xl:size-[169px]"
          />
        </div>

        {/* IntroText — stacked on mobile; absolute md+ with tighter max-w at md, full size at xl */}
        <p className="pointer-events-none relative z-10 mx-[22px] mt-8 text-heading-h1-mobile text-mainmenu-content md:absolute md:bottom-[6%] md:left-[4%] md:mx-0 md:mt-0 md:max-w-[44%] md:text-heading-h1-tablet xl:max-w-[50%] xl:text-heading-h1">
          With 15+ years in digital product design, I craft user-centric
          solutions from insights to UI, balancing aesthetics and function
          while collaborating closely with teams to align design with business
          goals. Using and utilizing AI when it is necessary and useful.
        </p>

        {/* TextCard — stacked on mobile; absolute md+ with 320px at md, 393px at xl */}
        <div
          className="relative z-10 mx-[22px] mb-[22px] mt-8 md:absolute md:bottom-[6%] md:right-[3%] md:mx-0 md:my-0 md:w-[320px] xl:w-[393px]"
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
    </section>
  )
}
