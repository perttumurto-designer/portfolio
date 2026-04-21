import { MainMenu } from "@/components/portfolio/main-menu"
import type { MenuItem } from "@/components/portfolio/main-menu"
import { MobileMainMenu } from "@/components/portfolio/mobile-main-menu"

interface StickyNavProps {
  items: MenuItem[]
}

export function StickyNav({ items }: StickyNavProps) {
  return (
    <>
      <div className="fixed inset-x-6 top-6 z-50 md:hidden">
        <MobileMainMenu items={items} />
      </div>
      <div className="fixed left-1/2 top-[54px] z-50 hidden -translate-x-1/2 md:block">
        <MainMenu items={items} />
      </div>
    </>
  )
}
