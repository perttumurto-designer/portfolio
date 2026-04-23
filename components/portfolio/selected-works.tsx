"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import Image from "next/image"

import { projects } from "@/data/projects"
import { useIsMobile } from "@/hooks/use-is-mobile"

const TEXT_SWAP_THRESHOLD = 0.8
const SNAP_IDLE_MS = 20
const SNAP_DURATION_MS = 400
const SNAP_COOLDOWN_MS = 900
const CASE_COUNT = projects.length
const TRACK_VH = CASE_COUNT + 1
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)(\?.*)?$/i

function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.test(src)
}

interface HeroMediaProps {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
}

interface ClientLogoMaskProps {
  src: string
  alt: string
}

// Renders a monochrome SVG as a theme-aware silhouette. The SVG is used as a
// mask and the colour is driven by `bg-selectedworks-content`, so the logo
// inverts automatically when the theme flips — same way the text does.
function ClientLogoMask({ src, alt }: ClientLogoMaskProps) {
  const url = `url('${encodeURI(src)}')`
  return (
    <div
      className="size-full bg-selectedworks-content"
      role="img"
      aria-label={alt}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  )
}

function HeroMedia({ src, alt, sizes, priority }: HeroMediaProps) {
  if (isVideoSrc(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={alt}
        className="size-full object-cover"
      />
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      priority={priority}
    />
  )
}

export function SelectedWorks() {
  const isMobile = useIsMobile()
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isMobile) {
      setProgress(0)
      return
    }
    const track = trackRef.current
    if (!track) return

    let rafId = 0
    let animationRafId: number | null = null
    let animationStartTime = 0
    let snapTimer: number | null = null
    let snapCooldownUntil = 0
    let prevY = window.scrollY
    let lastForward = true

    const WHEEL_CANCEL_GRACE_MS = 300

    const readProgress = () => {
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const range = track.offsetHeight - vh
      if (range <= 0) return null
      const p = Math.max(0, Math.min(1, -rect.top / range))
      return { p, rect, range }
    }

    const update = () => {
      rafId = 0
      const info = readProgress()
      if (!info) return
      setProgress(info.p)
    }

    const cancelAnimation = () => {
      if (animationRafId !== null) {
        cancelAnimationFrame(animationRafId)
        animationRafId = null
      }
    }

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animateScrollTo = (targetY: number, duration: number) => {
      cancelAnimation()
      const startY = window.scrollY
      const distance = targetY - startY
      const startTime = performance.now()
      animationStartTime = startTime
      const step = () => {
        const elapsed = performance.now() - startTime
        const t = Math.min(1, elapsed / duration)
        window.scrollTo({
          top: startY + distance * easeOutCubic(t),
          behavior: "instant",
        })
        if (t < 1) {
          animationRafId = requestAnimationFrame(step)
        } else {
          animationRafId = null
        }
      }
      animationRafId = requestAnimationFrame(step)
    }

    const maybeSnap = () => {
      if (performance.now() < snapCooldownUntil) return
      if (!lastForward) return
      const info = readProgress()
      if (!info) return
      const { p, rect, range } = info
      const segment = Math.floor(p * CASE_COUNT)
      if (segment < 0 || segment >= CASE_COUNT - 1) return
      const local = p * CASE_COUNT - segment
      if (local < TEXT_SWAP_THRESHOLD || local >= 1) return
      const sectionAbsTop = rect.top + window.scrollY
      const targetScrollY =
        sectionAbsTop + ((segment + 1) / CASE_COUNT) * range
      snapCooldownUntil = performance.now() + SNAP_COOLDOWN_MS
      animateScrollTo(targetScrollY, SNAP_DURATION_MS)
    }

    const onScroll = () => {
      const currentY = window.scrollY
      lastForward = currentY >= prevY
      prevY = currentY

      if (rafId === 0) rafId = requestAnimationFrame(update)

      if (snapTimer !== null) window.clearTimeout(snapTimer)
      snapTimer = window.setTimeout(() => {
        snapTimer = null
        maybeSnap()
      }, SNAP_IDLE_MS)
    }

    const onWheelIntent = () => {
      // Ignore trackpad inertia that bleeds in for a moment after snap start
      if (performance.now() - animationStartTime < WHEEL_CANCEL_GRACE_MS) return
      cancelAnimation()
    }
    const onUserIntent = () => cancelAnimation()

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("wheel", onWheelIntent, { passive: true })
    window.addEventListener("touchstart", onUserIntent, { passive: true })
    window.addEventListener("keydown", onUserIntent)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (snapTimer !== null) window.clearTimeout(snapTimer)
      cancelAnimation()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("wheel", onWheelIntent)
      window.removeEventListener("touchstart", onUserIntent)
      window.removeEventListener("keydown", onUserIntent)
    }
  }, [isMobile])

  const scaledImage = Math.max(
    0,
    Math.min(CASE_COUNT - 1, progress * CASE_COUNT),
  )
  const textIndex = Math.max(
    0,
    Math.min(
      CASE_COUNT - 1,
      Math.floor(progress * CASE_COUNT + (1 - TEXT_SWAP_THRESHOLD)),
    ),
  )
  const activeProject = projects[textIndex]
  const mobileProject = projects[0]

  return (
    <section id="selected-works" className="scroll-mt-24">
      {/* Mobile: minimal stacked holding pattern */}
      <div className="flex min-h-svh w-full flex-col gap-4 px-6 pb-6 pt-28 md:hidden">
        <div className="flex flex-col gap-6 rounded-lg border border-selectedworks-border bg-selectedworks-background p-6">
          <p className="text-mono-label text-muted-foreground uppercase">
            {mobileProject.roles.join(" · ")}
          </p>
          <div className="size-16">
            <ClientLogoMask
              src={mobileProject.clientLogo}
              alt={mobileProject.client}
            />
          </div>
          <p className="text-body-paragraph text-selectedworks-content">
            {mobileProject.lead}
          </p>
          <p className="text-body-small text-selectedworks-content">
            {mobileProject.description}
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-mainmenu-border">
          <HeroMedia
            src={mobileProject.heroImage}
            alt={mobileProject.title}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Desktop: scroll-pinned track */}
      <div
        ref={trackRef}
        className="relative hidden md:block"
        style={{ height: `${TRACK_VH * 100}vh` }}
      >
        <div className="sticky top-0 flex h-svh items-stretch px-6 pb-6 pt-28 md:p-24 md:pt-36">
          <div className="flex w-full items-start justify-center gap-1">
            {/* Left: InfoBox — text swaps at 60% threshold, then scroll snaps to 100% */}
            <div className="flex h-full max-h-[640px] min-w-[200px] max-w-[620px] flex-[3_1_0%] flex-col justify-between overflow-hidden rounded-lg rounded-tr-none border border-selectedworks-border bg-selectedworks-background p-8">
              <WordStagger
                key={`role-${textIndex}`}
                text={activeProject.roles.join(" · ")}
                as="p"
                className="text-mono-label text-muted-foreground uppercase"
              />
              <div className="flex flex-col gap-6">
                <div
                  key={`logo-${textIndex}`}
                  className="size-16 animate-[selected-works-fade-in_400ms_ease-out_both]"
                >
                  <ClientLogoMask
                    src={activeProject.clientLogo}
                    alt={activeProject.client}
                  />
                </div>
                <WordStagger
                  key={`lead-${textIndex}`}
                  text={activeProject.lead}
                  as="p"
                  className="text-body-paragraph text-selectedworks-content"
                  delayPerWord={25}
                  startDelay={120}
                />
                <WordStagger
                  key={`desc-${textIndex}`}
                  text={activeProject.description}
                  as="p"
                  className="text-body-small text-selectedworks-content"
                  delayPerWord={20}
                  startDelay={220}
                />
              </div>
            </div>

            {/* Right: MediaContainer — cases slide up as progress advances */}
            <div className="relative h-full min-w-[200px] max-w-[1100px] flex-[2_1_0%] overflow-hidden rounded-xl rounded-tl-none border border-mainmenu-border">
              {projects.map((p, i) => {
                const offsetPct = (i - scaledImage) * 100
                return (
                  <div
                    key={p.slug}
                    className="absolute inset-0 will-change-transform"
                    style={{
                      transform: `translate3d(0, ${offsetPct}%, 0)`,
                    }}
                    aria-hidden={i !== textIndex}
                  >
                    <HeroMedia
                      src={p.heroImage}
                      alt={p.title}
                      sizes="(min-width: 1280px) 70vw, (min-width: 768px) 65vw, 0px"
                      priority={i === 0}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface WordStaggerProps {
  text: string
  as: "p" | "span" | "div"
  className?: string
  delayPerWord?: number
  startDelay?: number
}

function WordStagger({
  text,
  as: Tag,
  className,
  delayPerWord = 30,
  startDelay = 0,
}: WordStaggerProps) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="inline-block animate-[selected-works-word-in_500ms_ease-out_both]"
            style={{ animationDelay: `${startDelay + i * delayPerWord}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  )
}
