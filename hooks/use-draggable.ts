"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react"

interface UseDraggableOptions {
  containerRef?: RefObject<HTMLElement | null>
  storageKey?: string
}

interface UseDraggableReturn {
  style: CSSProperties
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
  isDragging: boolean
  reset: () => void
}

export function useDraggable(
  { containerRef, storageKey }: UseDraggableOptions = {},
): UseDraggableReturn {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [hydrated, setHydrated] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({
    pointerX: 0,
    pointerY: 0,
    startX: 0,
    startY: 0,
    minX: -Infinity,
    maxX: Infinity,
    minY: -Infinity,
    maxY: Infinity,
  })
  const posRef = useRef(pos)
  useEffect(() => {
    posRef.current = pos
  }, [pos])

  useEffect(() => {
    if (!storageKey) {
      setHydrated(true)
      return
    }
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { x?: unknown; y?: unknown }
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setPos({ x: parsed.x, y: parsed.y })
        }
      }
    } catch {
      /* localStorage unavailable or corrupt — fall back to initial */
    }
    setHydrated(true)
  }, [storageKey])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const el = e.currentTarget
      const elRect = el.getBoundingClientRect()
      const container = containerRef?.current ?? null

      let minX = -Infinity
      let maxX = Infinity
      let minY = -Infinity
      let maxY = Infinity

      if (container) {
        const containerRect = container.getBoundingClientRect()
        const baseLeft = elRect.left - pos.x
        const baseTop = elRect.top - pos.y
        const baseRight = elRect.right - pos.x
        const baseBottom = elRect.bottom - pos.y
        minX = containerRect.left - baseLeft
        maxX = containerRect.right - baseRight
        minY = containerRect.top - baseTop
        maxY = containerRect.bottom - baseBottom
      }

      dragRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        startX: pos.x,
        startY: pos.y,
        minX,
        maxX,
        minY,
        maxY,
      }
      setIsDragging(true)
      e.preventDefault()
    },
    [containerRef, pos.x, pos.y],
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e: PointerEvent) => {
      const { pointerX, pointerY, startX, startY, minX, maxX, minY, maxY } =
        dragRef.current
      const dx = e.clientX - pointerX
      const dy = e.clientY - pointerY
      const newX = Math.max(minX, Math.min(startX + dx, maxX))
      const newY = Math.max(minY, Math.min(startY + dy, maxY))
      setPos({ x: newX, y: newY })
    }

    const handleUp = () => {
      setIsDragging(false)
      if (storageKey) {
        try {
          window.localStorage.setItem(
            storageKey,
            JSON.stringify(posRef.current),
          )
        } catch {
          /* ignore */
        }
      }
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
    window.addEventListener("pointercancel", handleUp)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
      window.removeEventListener("pointercancel", handleUp)
    }
  }, [isDragging, storageKey])

  const reset = useCallback(() => {
    setPos({ x: 0, y: 0 })
    if (storageKey) {
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        /* ignore */
      }
    }
  }, [storageKey])

  const style: CSSProperties = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    touchAction: "none",
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    visibility: storageKey && !hydrated ? "hidden" : undefined,
  }

  return { style, onPointerDown, isDragging, reset }
}
