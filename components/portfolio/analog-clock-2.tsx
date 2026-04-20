"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnalogClock2Props {
  size?: number
  className?: string
}

export function AnalogClock2({ size = 240, className }: AnalogClock2Props) {
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

  const hours = time?.getHours() ?? 10
  const minutes = time?.getMinutes() ?? 10
  const seconds = time?.getSeconds() ?? 30

  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6 + seconds * 0.1
  const secondAngle = seconds * 6

  const weekday = time
    ? time.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
    : "MON"
  const day = time?.getDate() ?? 20

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn(className)}
      role="img"
      aria-label="Analog chronograph clock"
    >
      {/* Dial */}
      <circle
        cx={100}
        cy={100}
        r={96}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={1}
      />

      {/* Four baton hour markers at 12, 3, 6, 9 */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={`baton-${i}`}
          x1={100}
          y1={10}
          x2={100}
          y2={20}
          stroke="var(--foreground)"
          strokeWidth={2}
          strokeLinecap="round"
          transform={`rotate(${i * 90}, 100, 100)`}
        />
      ))}

      {/* Top sub-dial */}
      <circle
        cx={100}
        cy={62}
        r={22}
        fill="none"
        stroke="var(--border)"
        strokeWidth={0.75}
      />
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={`top-tick-${i}`}
          x1={100}
          y1={41}
          x2={100}
          y2={47}
          stroke="var(--muted-foreground)"
          strokeWidth={0.5}
          transform={`rotate(${i * 6}, 100, 62)`}
        />
      ))}

      {/* Bottom sub-dial */}
      <circle
        cx={100}
        cy={140}
        r={20}
        fill="none"
        stroke="var(--border)"
        strokeWidth={0.75}
      />
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={`bot-tick-${i}`}
          x1={100}
          y1={121}
          x2={100}
          y2={127}
          stroke="var(--muted-foreground)"
          strokeWidth={0.5}
          transform={`rotate(${i * 6}, 100, 140)`}
        />
      ))}
      <circle cx={100} cy={124} r={0.8} fill="var(--destructive)" />

      {/* Date window (3 o'clock) */}
      <line
        x1={138}
        y1={100}
        x2={144}
        y2={100}
        stroke="var(--muted-foreground)"
        strokeWidth={0.5}
      />
      <rect
        x={148}
        y={94}
        width={18}
        height={12}
        rx={1}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth={0.5}
      />
      <text
        x={157}
        y={100}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={4.5}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {`${weekday} ${day}`}
      </text>
      <line
        x1={170}
        y1={100}
        x2={176}
        y2={100}
        stroke="var(--muted-foreground)"
        strokeWidth={0.5}
      />

      {/* Left side marker (9 o'clock) */}
      <line
        x1={24}
        y1={100}
        x2={30}
        y2={100}
        stroke="var(--muted-foreground)"
        strokeWidth={0.5}
      />
      <text
        x={38}
        y={100}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--muted-foreground)"
        fontSize={5}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        21
      </text>

      {/* Hour hand */}
      <line
        x1={100}
        y1={110}
        x2={100}
        y2={48}
        stroke="var(--foreground)"
        strokeWidth={1.5}
        strokeLinecap="round"
        transform={`rotate(${hourAngle}, 100, 100)`}
      />

      {/* Minute hand */}
      <line
        x1={100}
        y1={112}
        x2={100}
        y2={22}
        stroke="var(--foreground)"
        strokeWidth={1}
        strokeLinecap="round"
        transform={`rotate(${minuteAngle}, 100, 100)`}
      />

      {/* Second hand */}
      <line
        x1={100}
        y1={120}
        x2={100}
        y2={30}
        stroke="var(--foreground)"
        strokeWidth={0.75}
        strokeLinecap="round"
        transform={`rotate(${secondAngle}, 100, 100)`}
      />

      {/* Center cap */}
      <circle cx={100} cy={100} r={1.5} fill="var(--foreground)" />
    </svg>
  )
}
