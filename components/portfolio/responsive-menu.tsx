import { MainMenu } from "@/components/portfolio/main-menu"
import { MobileMainMenu } from "@/components/portfolio/mobile-main-menu"
import type { MenuItem } from "@/components/portfolio/main-menu"

interface ResponsiveMenuProps {
  items: MenuItem[]
  className?: string
}

export function ResponsiveMenu({ items, className }: ResponsiveMenuProps) {
  return (
    <>
      <div className="w-full md:hidden">
        <MobileMainMenu items={items} className={className} />
      </div>
      <div className="hidden md:inline-flex">
        <MainMenu items={items} className={className} />
      </div>
    </>
  )
}
