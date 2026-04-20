"use client"

import { useEffect, useState } from "react"
import { MOBILE_MAX } from "@/lib/breakpoints"

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return isMobile
}
