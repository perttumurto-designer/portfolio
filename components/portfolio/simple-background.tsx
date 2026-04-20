"use client"

/**
 * SimpleBackground — Next.js / React wrapper for the SimpleBackground canvas module.
 *
 * 1. Copy `simpleBackground.js` to `public/simpleBackground.js`
 * 2. Copy this file to `components/portfolio/simple-background.tsx`
 * 3. In app/layout.tsx:
 *
 *    import Script from "next/script"
 *    import SimpleBackground from "@/components/portfolio/simple-background"
 *
 *    <Script src="/simpleBackground.js" strategy="afterInteractive" />
 *    <SimpleBackground />
 *
 *    // and wrap your content so it sits above the canvas:
 *    <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
 *
 * All options are optional — defaults match the polished design.
 */

import { useEffect, useRef, type CSSProperties } from "react"

type SimpleBackgroundProps = {
  variant?: "dots" | "lines" | "crosshairs" | "waves"
  color?: string
  background?: string

  // waves
  waveLineSpacing?: number
  waveDotSpacing?: number
  waveDotSize?: number
  waveAmplitude?: number
  waveLength?: number
  waveSpeed?: number
  waveHarmonics?: number
  waveNoiseAmount?: number
  waveNoiseScale?: number
  waveVignette?: number
  waveCursorPush?: number
  waveCursorRadius?: number
  waveCursorGlow?: number

  // swirl (organic cursor orbit)
  swirlStrength?: number
  swirlTurns?: number
  swirlSpeed?: number
  swirlInward?: number
  swirlScatter?: number
  swirlDecay?: number

  // misc
  maxDpr?: number
  autoMobile?: boolean
  className?: string
  style?: CSSProperties
}

declare global {
  interface Window {
    SimpleBackground?: {
      mount: (
        el: HTMLElement,
        opts?: Record<string, unknown>
      ) => { update: (p: Record<string, unknown>) => void; destroy: () => void }
    }
  }
}

/**
 * Polished defaults — tuned for a designer portfolio.
 * These match the values baked into simpleBackground.js, so <SimpleBackground />
 * with no props produces the exact look from the demo.
 */
const DEFAULTS: Required<Omit<SimpleBackgroundProps, "className" | "style">> = {
  variant: "waves",
  color: "rgba(200,210,230,0.42)",
  background: "transparent",

  waveLineSpacing: 12,
  waveDotSpacing: 5,
  waveDotSize: 0.7,
  waveAmplitude: 18,
  waveLength: 640,
  waveSpeed: 0.07,
  waveHarmonics: 2,
  waveNoiseAmount: 0.45,
  waveNoiseScale: 260,
  waveVignette: 0.6,
  waveCursorPush: 34,
  waveCursorRadius: 240,
  waveCursorGlow: 2.9,

  swirlStrength: 32,
  swirlTurns: 0.2,
  swirlSpeed: 0.85,
  swirlInward: 0.65,
  swirlScatter: 0.75,
  swirlDecay: 3.1,

  maxDpr: 2,
  autoMobile: true,
}

export default function SimpleBackground({
  className,
  style,
  ...props
}: SimpleBackgroundProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  // keep latest opts in a ref so hot-updates don't re-mount
  const optsRef = useRef({ ...DEFAULTS, ...props })
  optsRef.current = { ...DEFAULTS, ...props }

  useEffect(() => {
    if (!ref.current) return
    let destroyed = false
    let inst: { update: (p: Record<string, unknown>) => void; destroy: () => void } | null = null

    function tryMount() {
      if (destroyed) return
      if (window.SimpleBackground) {
        inst = window.SimpleBackground.mount(ref.current!, optsRef.current)
      } else {
        setTimeout(tryMount, 40)
      }
    }
    tryMount()

    return () => {
      destroyed = true
      if (inst) inst.destroy()
    }
    // mount once; change props via a ref if you need live updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        // 100lvh = "large viewport height" — the viewport with the URL bar
        // hidden. Stays constant as mobile browsers show/hide the address bar,
        // so the canvas never stretches or re-lays out during scroll.
        height: "100lvh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        ...style,
      }}
    />
  )
}
