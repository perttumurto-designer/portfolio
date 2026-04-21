"use client"

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoLottie } from "@/components/portfolio/logo-lottie"
import { MainMenuItem } from "@/components/portfolio/main-menu-item"
import { ThemeToggle } from "@/components/portfolio/theme-toggle"

export interface MenuItem {
  label: string
  icon?: LucideIcon
  href?: string
  active?: boolean
  onClick?: () => void
}

interface MainMenuProps {
  items: MenuItem[]
  className?: string
}

export function MainMenu({ items, className }: MainMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const itemsContainerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const hasMounted = useRef(false)
  const [isDark, setIsDark] = useState(false)
  const [indicator, setIndicator] = useState<{
    left: number
    width: number
    animate: boolean
  } | null>(null)

  const activeIndex = items.findIndex((item) => item.active)

  const check = useCallback(() => {
    if (ref.current) {
      setIsDark(ref.current.closest(".dark") !== null)
    }
  }, [])

  useEffect(() => {
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    })
    return () => observer.disconnect()
  }, [check])

  // Measure active item and position the floating indicator
  const measure = useCallback(() => {
    if (activeIndex < 0 || !itemRefs.current[activeIndex]) return
    const item = itemRefs.current[activeIndex]!
    setIndicator({
      left: item.offsetLeft,
      width: item.offsetWidth,
      animate: hasMounted.current,
    })
    hasMounted.current = true
  }, [activeIndex])

  // Measure on active change
  useLayoutEffect(() => {
    measure()
  }, [measure])

  // Recalculate on resize
  useEffect(() => {
    const container = itemsContainerRef.current
    if (!container) return
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [measure])

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-[100px] rounded-lg border border-mainmenu-border bg-mainmenu-background px-3.5 py-2.5",
        className,
      )}
    >
      <LogoLottie isDark={isDark} />
      <div className="flex items-center gap-4">
        <div ref={itemsContainerRef} className="relative flex items-center gap-[14px]">
          {/* Floating active indicator */}
          {indicator && activeIndex >= 0 && (
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 rounded-4xl border border-mainmenu-content",
                indicator.animate && "transition-all duration-300 ease-out",
              )}
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {items.map((item, index) => (
            <MainMenuItem
              key={item.label}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}
