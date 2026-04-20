"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoLottie } from "@/components/portfolio/logo-lottie"
import type { MenuItem } from "@/components/portfolio/main-menu"

interface MobileMainMenuProps {
  items: MenuItem[]
  className?: string
  defaultOpen?: boolean
}

export function MobileMainMenu({
  items,
  className,
  defaultOpen = false,
}: MobileMainMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isDark, setIsDark] = useState(false)

  const checkDark = useCallback(() => {
    if (ref.current) {
      setIsDark(ref.current.closest(".dark") !== null)
    }
  }, [])

  useEffect(() => {
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    })
    return () => observer.disconnect()
  }, [checkDark])

  // Body scroll lock — skip when defaultOpen (Storybook preview)
  useEffect(() => {
    if (isOpen && !defaultOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isOpen, defaultOpen])

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {/* Closed bar */}
      <div
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-mainmenu-border bg-mainmenu-background p-5 transition-opacity duration-300",
          isOpen && "invisible opacity-0",
        )}
      >
        <LogoLottie isDark={isDark} />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-6 text-mainmenu-content" />
        </button>
      </div>

      {/* Fullscreen overlay */}
      <div
        className={cn(
          "dark fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-all duration-300",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      >
        {isOpen && (
          <div
            className="flex h-full flex-col p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <LogoLottie isDark />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-6 text-mainmenu-content" />
              </button>
            </div>

            {/* Menu items */}
            <nav className="mt-12 flex flex-col gap-0.5">
              {items.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href ?? "#"}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg p-2.5 font-heading text-[30px] font-medium leading-none tracking-[-0.6px] text-mainmenu-content transition-all duration-300",
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0",
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 50 + 100}ms` : "0ms",
                  }}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault()
                      item.onClick()
                    }
                    setIsOpen(false)
                  }}
                >
                  <ArrowRight className="size-6 shrink-0 -translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
