import { cn } from "@/lib/utils"

export interface TextCardProps {
  label: string
  heading: string
  lead: string
  body: string
  className?: string
}

export function TextCard({
  label,
  heading,
  lead,
  body,
  className,
}: TextCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-mainmenu-border bg-mainmenu-background p-6 text-mainmenu-content",
        className,
      )}
    >
      <p className="text-mono-label-mobile md:text-mono-label uppercase text-muted-foreground">
        {label}
      </p>
      <p className="text-heading-h3-mobile md:text-heading-h3">{heading}</p>
      <p className="text-body-large-mobile md:text-body-large">{lead}</p>
      <p className="text-body-small-mobile md:text-body-small">{body}</p>
    </div>
  )
}
