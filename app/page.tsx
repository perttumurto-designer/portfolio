"use client"

import { ResponsiveMenu } from "@/components/portfolio/responsive-menu"
import { AnalogClock2 } from "@/components/portfolio/analog-clock-2"
import { House, Layers, Info, FileUser } from "lucide-react"

const menuItems = [
  { label: "Main", icon: House, active: true },
  { label: "Selected works", icon: Layers },
  { label: "About", icon: Info },
  { label: "History", icon: FileUser },
]

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4 md:p-6">
      <div className="flex flex-col items-center gap-8">
        <ResponsiveMenu items={menuItems} />
        <AnalogClock2 size={240} />
      </div>
    </div>
  )
}
