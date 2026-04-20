"use client"

import { useState } from "react"
import { ResponsiveMenu } from "@/components/portfolio/responsive-menu"
import { AnalogClock2 } from "@/components/portfolio/analog-clock-2"
import { House, Layers, Info, FileUser } from "lucide-react"

const baseItems = [
  { label: "Main", icon: House },
  { label: "Selected works", icon: Layers },
  { label: "About", icon: Info },
  { label: "History", icon: FileUser },
]

export default function Page() {
  const [activeLabel, setActiveLabel] = useState(baseItems[0].label)

  const menuItems = baseItems.map((item) => ({
    ...item,
    active: item.label === activeLabel,
    onClick: () => setActiveLabel(item.label),
  }))

  return (
    <div className="flex min-h-svh flex-col items-center px-5 pt-8 pb-5 md:px-6 md:pb-6">
      <ResponsiveMenu items={menuItems} />
      <div className="flex w-full flex-1 items-center justify-center">
        <AnalogClock2 size={240} />
      </div>
    </div>
  )
}
