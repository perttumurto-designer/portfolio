"use client"

import { Button } from "@/components/ui/button"
import { MainMenu } from "@/components/portfolio/main-menu"
import { MobileMainMenu } from "@/components/portfolio/mobile-main-menu"
import { ResponsiveMenu } from "@/components/portfolio/responsive-menu"
import { House, Layers, Info, FileUser } from "lucide-react"

const menuItems = [
  { label: "Main", icon: House, active: true },
  { label: "Selected works", icon: Layers },
  { label: "About", icon: Info },
  { label: "History", icon: FileUser },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div>
          <h2 className="font-medium">MainMenu</h2>
          <div className="mt-2">
            <MainMenu items={menuItems} />
          </div>
        </div>
        <div>
          <h2 className="font-medium">MobileMainMenu</h2>
          <div className="mt-2 max-w-sm">
            <MobileMainMenu items={menuItems} />
          </div>
        </div>
        <div>
          <h2 className="font-medium">ResponsiveMenu (resize browser)</h2>
          <div className="mt-2">
            <ResponsiveMenu items={menuItems} />
          </div>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
