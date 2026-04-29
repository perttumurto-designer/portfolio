"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

import { projects, type Project } from "@/data/projects"
import { useIsMobile } from "@/hooks/use-is-mobile"

function resolveHeroSrc(p: Project, theme: string | undefined): string {
  return theme === "light" && p.heroImageLight ? p.heroImageLight : p.heroImage
}

const TEXT_SWAP_THRESHOLD = 0.8
const SNAP_IDLE_MS = 120
const SNAP_DURATION_MS = 400
const SNAP_COOLDOWN_MS = 900
// Scroll buffer at the top of the pinned track where case 1 stays put before
// any transition begins — expressed as a fraction of total track progress.
const INTRO_DWELL = 0.12
// Desktop sticky pins this far below the viewport top so the nav has clearance
// and the title→cards gap stays at 32px. Matches pt-36 = 9rem.
const STICKY_TOP_OFFSET_PX = 144
const CASE_COUNT = projects.length
const TRACK_VH = CASE_COUNT + 1
const MOBILE_TRACK_VH = CASE_COUNT + 0.5
const STICKY_TOP_OFFSET_MOBILE_PX = 80
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
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
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

interface CaseRowProps {
  project: Project
  basis: number
  grow: number
  expansion: number
  hidden?: boolean
}

// Continuous-fold card. `expansion` ∈ [0, 1] drives image min-height and content
// opacity; `basis`/`grow` drive the flex height. Card always renders the full
// content tree; overflow:hidden on the outer + min-h-0 on the InfoBox let the
// label collapse to 59px while the content fades and clips smoothly.
function CaseRow({ project, basis, grow, expansion, hidden }: CaseRowProps) {
  const { resolvedTheme } = useTheme()
  return (
    <div
      style={{
        flexBasis: `${basis}px`,
        flexGrow: grow,
        flexShrink: 0,
        display: hidden ? "none" : "flex",
      }}
      className="-mb-[6px] w-full flex-col overflow-hidden"
    >
      <div
        className="relative flex-1 overflow-hidden rounded-t-[14px] border border-mainmenu-border"
        style={{ minHeight: `${expansion * 80}px` }}
      >
        <HeroMedia
          src={resolveHeroSrc(project, resolvedTheme)}
          alt={project.title}
          sizes="100vw"
        />
      </div>
      <div className="flex shrink-0 flex-col gap-4 rounded-b-[14px] border border-selectedworks-border bg-selectedworks-background p-5">
        <p className="text-mono-label uppercase text-muted-foreground">
          {project.roles.join(" · ")}
        </p>
        <div
          className="flex flex-col gap-4"
          style={{ opacity: expansion }}
        >
          {project.clientLogo && (
            <div
              className="h-16"
              style={{ width: `${project.clientLogoWidth ?? 64}px` }}
            >
              <ClientLogoMask
                src={project.clientLogo}
                alt={project.client}
              />
            </div>
          )}
          <p className="text-body-paragraph text-selectedworks-content">
            {project.lead}
          </p>
          <p className="text-body-small text-selectedworks-content">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function SelectedWorks() {
  const isMobile = useIsMobile()
  const { resolvedTheme } = useTheme()
  const desktopTrackRef = useRef<HTMLDivElement>(null)
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const track = isMobile ? mobileTrackRef.current : desktopTrackRef.current
    if (!track) return

    let rafId = 0
    let animationRafId: number | null = null
    let animationStartTime = 0
    let snapTimer: number | null = null
    let snapCooldownUntil = 0
    let prevY = window.scrollY
    let lastForward = true

    const WHEEL_CANCEL_GRACE_MS = 300

    // On mobile the sticky offset is smaller (no second-level nav clearance).
    const stickyOffset = isMobile
      ? STICKY_TOP_OFFSET_MOBILE_PX
      : STICKY_TOP_OFFSET_PX

    const readProgress = () => {
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      // Pin-window spans rect.top from +stickyOffset (pin start) down to
      // stickyOffset - (trackHeight - vh) (pin end).
      const range = track.offsetHeight + stickyOffset - vh
      if (range <= 0) return null
      const p = Math.max(
        0,
        Math.min(1, (stickyOffset - rect.top) / range),
      )
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

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

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
          top: startY + distance * easeInOutCubic(t),
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
      const now = performance.now()
      if (now < snapCooldownUntil) {
        // Re-arm at cooldown end so the current idle position still resolves.
        if (snapTimer !== null) window.clearTimeout(snapTimer)
        snapTimer = window.setTimeout(() => {
          snapTimer = null
          maybeSnap()
        }, snapCooldownUntil - now + 10)
        return
      }

      const info = readProgress()
      if (!info) return
      const { p, rect, range } = info
      const effP = Math.max(0, (p - INTRO_DWELL) / (1 - INTRO_DWELL))
      const segment = Math.min(
        CASE_COUNT - 1,
        Math.max(0, Math.floor(effP * CASE_COUNT)),
      )
      const local = effP * CASE_COUNT - segment

      const EPSILON = 0.005
      if (local <= EPSILON) return

      let targetEffP: number
      if (lastForward) {
        if (segment >= CASE_COUNT - 1) return
        targetEffP = (segment + 1) / CASE_COUNT
      } else {
        targetEffP = segment / CASE_COUNT
      }

      const sectionAbsTop = rect.top + window.scrollY
      const targetP = INTRO_DWELL + targetEffP * (1 - INTRO_DWELL)
      const targetScrollY =
        sectionAbsTop - stickyOffset + targetP * range
      snapCooldownUntil = now + SNAP_COOLDOWN_MS
      animateScrollTo(targetScrollY, SNAP_DURATION_MS)
    }

    const onScroll = () => {
      const currentY = window.scrollY
      lastForward = currentY >= prevY
      prevY = currentY

      if (rafId === 0) rafId = requestAnimationFrame(update)

      if (isMobile) return

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

    if (!isMobile) {
      window.addEventListener("wheel", onWheelIntent, { passive: true })
      window.addEventListener("touchstart", onUserIntent, { passive: true })
      window.addEventListener("keydown", onUserIntent)
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (snapTimer !== null) window.clearTimeout(snapTimer)
      cancelAnimation()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (!isMobile) {
        window.removeEventListener("wheel", onWheelIntent)
        window.removeEventListener("touchstart", onUserIntent)
        window.removeEventListener("keydown", onUserIntent)
      }
    }
  }, [isMobile])

  const effectiveProgress = Math.max(
    0,
    (progress - INTRO_DWELL) / (1 - INTRO_DWELL),
  )
  const scaledImage = Math.max(
    0,
    Math.min(CASE_COUNT - 1, effectiveProgress * CASE_COUNT),
  )
  const textIndex = Math.max(
    0,
    Math.min(
      CASE_COUNT - 1,
      Math.floor(effectiveProgress * CASE_COUNT + (1 - TEXT_SWAP_THRESHOLD)),
    ),
  )
  const activeProject = projects[textIndex]

  // Continuous-fold state for the mobile track. cardP ∈ [0, N-1] places the
  // active fold between case `transitionIndex` (shrinking) and case
  // `transitionIndex + 1` (growing); `frac` is the position within that fold.
  const cardP = progress * Math.max(1, CASE_COUNT - 1)
  const transitionIndex = Math.min(
    Math.max(0, CASE_COUNT - 2),
    Math.max(0, Math.floor(cardP)),
  )
  const frac = Math.max(0, Math.min(1, cardP - transitionIndex))

  const getCardState = (i: number): Omit<CaseRowProps, "project"> => {
    if (CASE_COUNT === 1) {
      return { basis: 59, grow: 1, expansion: 1 }
    }
    if (i < transitionIndex) {
      return { basis: 59, grow: 0, expansion: 0 }
    }
    if (i === transitionIndex) {
      return { basis: 59, grow: 1 - frac, expansion: 1 - frac }
    }
    if (i === transitionIndex + 1) {
      return { basis: 0, grow: frac, expansion: frac }
    }
    return { basis: 0, grow: 0, expansion: 0, hidden: true }
  }

  return (
    <section id="selected-works" className="scroll-mt-24">
      {/* Mobile: pinned stacked-pile track */}
      <div
        ref={mobileTrackRef}
        className="relative md:hidden"
        style={{ height: `${MOBILE_TRACK_VH * 100}vh` }}
      >
        <div
          className="flex flex-col gap-4 px-6 pt-4"
          style={{
            position: "sticky",
            top: `${STICKY_TOP_OFFSET_MOBILE_PX}px`,
            height: `calc(100svh - ${STICKY_TOP_OFFSET_MOBILE_PX}px)`,
          }}
        >
          <h2 className="text-heading-h2-mobile mb-2 text-center text-mainmenu-content">
            Few selected works
          </h2>
          <div className="flex min-h-0 flex-1 flex-col gap-[5px] pb-[6px]">
            {projects.map((p, i) => (
              <CaseRow key={p.slug} project={p} {...getCardState(i)} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: scroll-pinned track */}
      <div
        ref={desktopTrackRef}
        className="relative hidden md:block"
        style={{ height: `${TRACK_VH * 100}vh` }}
      >
        <div className="sticky top-[144px] flex h-[calc(100svh-144px)] flex-col gap-8">
          <h2 className="text-heading-h2 px-6 text-center text-mainmenu-content">
            Few selected works
          </h2>
          <div className="flex w-full min-h-0 flex-1 items-start gap-1 pl-6">
            {/* Left: InfoBox — text swaps at 60% threshold, then scroll snaps to 100% */}
            <div className="flex h-full max-h-[640px] min-w-[200px] max-w-[500px] flex-[2_1_0%] flex-col justify-between overflow-hidden rounded-lg rounded-tr-none border border-selectedworks-border bg-selectedworks-background p-8">
              <WordStagger
                key={`role-${textIndex}`}
                text={activeProject.roles.join(" · ")}
                as="p"
                className="text-mono-label text-muted-foreground uppercase"
              />
              <div className="flex flex-col gap-6">
                <div
                  key={`logo-${textIndex}`}
                  className="h-16 animate-[selected-works-fade-in_400ms_ease-out_both]"
                  style={{
                    width: `${activeProject.clientLogoWidth ?? 64}px`,
                  }}
                >
                  {activeProject.clientLogo && (
                    <ClientLogoMask
                      src={activeProject.clientLogo}
                      alt={activeProject.client}
                    />
                  )}
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
            <div className="relative h-full min-w-[200px] flex-[3_1_0%] overflow-hidden border border-mainmenu-border">
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
                      src={resolveHeroSrc(p, resolvedTheme)}
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
