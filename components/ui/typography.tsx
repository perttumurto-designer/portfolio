import * as React from "react"

import { cn } from "@/lib/utils"

const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h1">
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("text-heading-h1", className)}
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
    className={cn(
      "font-heading text-3xl font-semibold tracking-tight",
      className
    )}
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
    className={cn(
      "font-heading text-2xl font-semibold tracking-tight",
      className
    )}
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
    className={cn(
      "font-heading text-xl font-semibold tracking-tight",
      className
    )}
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
    className={cn("font-sans leading-7 [&:not(:first-child)]:mt-6", className)}
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
    className={cn("font-sans text-xl text-muted-foreground", className)}
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
    className={cn("text-body-large", className)}
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
    className={cn("text-body-small", className)}
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
    className={cn("font-sans text-sm text-muted-foreground", className)}
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
      "font-mono relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-semibold",
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
    className={cn("font-sans mt-6 border-l-2 pl-6 italic", className)}
    {...props}
  />
))
Blockquote.displayName = "Blockquote"

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
}
