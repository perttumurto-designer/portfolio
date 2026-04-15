import { H1, H4, Small } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function TestCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-16 overflow-hidden rounded-xl border border-border bg-card p-8",
        className
      )}
    >
      <div className="flex flex-col gap-5">
        <H1>Tervehdys!</H1>
        <H4 className="text-muted-foreground">
          Tämä on teksti vain jossa on tavaraa
        </H4>
        <Small>
          Tekstiä tässä on vähän pidemmästi jotta näkee miten nämä menee sitte.
        </Small>
      </div>
      <div className="flex items-center gap-2.5">
        <Button>Normal</Button>
        <Button variant="destructive">Button</Button>
        <Button size="lg">Large button</Button>
      </div>
    </div>
  )
}
