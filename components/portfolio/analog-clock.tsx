"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnalogClockProps {
  size?: number
  className?: string
}

export function AnalogClock({ size = 200, className }: AnalogClockProps) {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    const update = () => setTime(new Date())
    const t = setTimeout(update, 0)
    const id = setInterval(update, 1000)
    return () => {
      clearTimeout(t)
      clearInterval(id)
    }
  }, [])

  // Default to 10:10:30 for SSR (classic clock display position)
  const hours = time?.getHours() ?? 10
  const minutes = time?.getMinutes() ?? 10
  const seconds = time?.getSeconds() ?? 30

  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6 + seconds * 0.1
  const secondAngle = seconds * 6

  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i === 0 ? 12 : i
    const angle = (i * 30 * Math.PI) / 180
    const r = 65
    return {
      num,
      x: 100 + r * Math.sin(angle),
      y: 100 - r * Math.cos(angle),
    }
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn(className)}
      role="img"
      aria-label="Analog clock"
    >
      {/* Clock face */}
      <circle
        cx={100}
        cy={100}
        r={96}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={2}
      />

      {/* Minute tick marks */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        return (
          <line
            key={`mt-${i}`}
            x1={100}
            y1={12}
            x2={100}
            y2={18}
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            transform={`rotate(${i * 6}, 100, 100)`}
          />
        )
      })}

      {/* Hour tick marks */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`ht-${i}`}
          x1={100}
          y1={10}
          x2={100}
          y2={24}
          stroke="var(--foreground)"
          strokeWidth={2}
          strokeLinecap="round"
          transform={`rotate(${i * 30}, 100, 100)`}
        />
      ))}

      {/* Hour numbers */}
      {numbers.map(({ num, x, y }) => (
        <text
          key={num}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--foreground)"
          fontSize={14}
          fontWeight={600}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {num}
        </text>
      ))}

      {/* Hour hand */}
      <line
        x1={100}
        y1={108}
        x2={100}
        y2={52}
        stroke="var(--foreground)"
        strokeWidth={4}
        strokeLinecap="round"
        transform={`rotate(${hourAngle}, 100, 100)`}
      />

      {/* Minute hand */}
      <line
        x1={100}
        y1={108}
        x2={100}
        y2={35}
        stroke="var(--foreground)"
        strokeWidth={2.5}
        strokeLinecap="round"
        transform={`rotate(${minuteAngle}, 100, 100)`}
      />

      {/* Second hand */}
      <line
        x1={100}
        y1={115}
        x2={100}
        y2={28}
        stroke="var(--destructive)"
        strokeWidth={1.5}
        strokeLinecap="round"
        transform={`rotate(${secondAngle}, 100, 100)`}
      />

      {/* Center dot */}
      <circle cx={100} cy={100} r={5} fill="var(--foreground)" />
      <circle cx={100} cy={100} r={2.5} fill="var(--destructive)" />
    </svg>
  )
}
