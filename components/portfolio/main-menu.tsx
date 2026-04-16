"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoLottie } from "@/components/portfolio/logo-lottie"
import { MainMenuItem } from "@/components/portfolio/main-menu-item"

export interface MenuItem {
  label: string
  icon?: LucideIcon
  href?: string
  active?: boolean
}

interface MainMenuProps {
  items: MenuItem[]
  className?: string
}

export function MainMenu({ items, className }: MainMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)

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

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg border border-mainmenu-border bg-mainmenu-background px-3.5 py-2.5",
        className,
      )}
    >
      <LogoLottie isDark={isDark} />
      <div className="flex items-center">
        {items.map((item) => (
          <MainMenuItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={item.active}
          />
        ))}
      </div>
    </div>
  )
}
