import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MainMenuItemProps {
  label: string
  icon?: LucideIcon
  active?: boolean
  onClick?: () => void
  className?: string
}

export function MainMenuItem({
  label,
  icon: Icon,
  active,
  onClick,
  className,
}: MainMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-4xl px-3.5 py-2.5 font-sans text-sm font-medium text-mainmenu-content transition-colors",
        "bg-mainmenu-background hover:bg-mainmenu-background-hover",
        active && "bg-mainmenu-background-hover",
        className,
      )}
    >
      {Icon && <Icon className="size-3.5 shrink-0" />}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}
