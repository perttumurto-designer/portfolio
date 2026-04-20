import * as React from "react"

import { cn } from "@/lib/utils"

const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h1">
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("text-heading-h1-mobile md:text-heading-h1", className)}
    {...props}
  />
))
H1.displayName = "H1"

const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h2">
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-heading-h2-mobile md:text-heading-h2", className)}
    {...props}
  />
))
H2.displayName = "H2"

const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h3">
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-heading-h3-mobile md:text-heading-h3", className)}
    {...props}
  />
))
H3.displayName = "H3"

const H4 = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h4">
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-heading-h4-mobile md:text-heading-h4", className)}
    {...props}
  />
))
H4.displayName = "H4"

const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-body-paragraph-mobile md:text-body-paragraph [&:not(:first-child)]:mt-6",
      className
    )}
    {...props}
  />
))
Paragraph.displayName = "Paragraph"

const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-body-lead-mobile md:text-body-lead text-muted-foreground",
      className
    )}
    {...props}
  />
))
Lead.displayName = "Lead"

const Large = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-body-large-mobile md:text-body-large", className)}
    {...props}
  />
))
Large.displayName = "Large"

const Small = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"small">
>(({ className, ...props }, ref) => (
  <small
    ref={ref}
    className={cn("text-body-small-mobile md:text-body-small", className)}
    {...props}
  />
))
Small.displayName = "Small"

const Muted = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-muted-mobile md:text-body-muted", className)}
    {...props}
  />
))
Muted.displayName = "Muted"

const InlineCode = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"code">
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "text-code-inline-mobile md:text-code-inline relative rounded bg-muted px-[0.3rem] py-[0.2rem]",
      className
    )}
    {...props}
  />
))
InlineCode.displayName = "InlineCode"

const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.ComponentPropsWithoutRef<"blockquote">
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn(
      "text-body-blockquote-mobile md:text-body-blockquote mt-6 border-l-2 pl-6",
      className
    )}
    {...props}
  />
))
Blockquote.displayName = "Blockquote"

const Label = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-mono-label-mobile md:text-mono-label", className)}
    {...props}
  />
))
Label.displayName = "Label"

export {
  H1,
  H2,
  H3,
  H4,
  Paragraph,
  Lead,
  Large,
  Small,
  Muted,
  InlineCode,
  Blockquote,
  Label,
}
