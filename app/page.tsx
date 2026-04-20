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
    <div className="flex min-h-svh flex-col px-5 pt-8 pb-5 md:px-6 md:pb-6">
      <ResponsiveMenu items={menuItems} />
      <div className="flex flex-1 items-center justify-center">
        <AnalogClock2 size={240} />
      </div>
    </div>
  )
}
