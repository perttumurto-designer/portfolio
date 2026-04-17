import { forwardRef } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MainMenuItemProps {
  label: string
  icon?: LucideIcon
  active?: boolean
  onClick?: () => void
  className?: string
}

export const MainMenuItem = forwardRef<HTMLButtonElement, MainMenuItemProps>(
  function MainMenuItem({ label, icon: Icon, active, onClick, className }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-current={active ? "true" : undefined}
        onClick={onClick}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-4xl border border-transparent px-3.5 py-2.5 font-sans text-sm font-medium text-mainmenu-content transition-colors",
          "bg-mainmenu-background hover:bg-mainmenu-background-hover",
          className,
        )}
      >
        {Icon && <Icon className="size-3.5 shrink-0" />}
        <span className="whitespace-nowrap">{label}</span>
      </button>
    )
  },
)
