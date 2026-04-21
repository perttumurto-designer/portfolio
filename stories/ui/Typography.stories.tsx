import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
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
  MainMenuMobile,
} from "@/components/ui/typography"

const meta: Meta = {
  title: "UI/Typography",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj

// --- Headings (H1: Helvetica Now Display; H2–H4: JetBrains Mono) ---

export const Heading1: Story = {
  render: () => <H1>The art of building interfaces</H1>,
}

export const Heading2: Story = {
  render: () => <H2>Design principles</H2>,
}

export const Heading3: Story = {
  render: () => <H3>Typography matters</H3>,
}

export const Heading4: Story = {
  render: () => <H4>Font pairing</H4>,
}

// --- Body text (Large + Small: Helvetica Now Display; Paragraph/Lead/Muted/Blockquote: Inter) ---

export const ParagraphStory: Story = {
  name: "Paragraph",
  render: () => (
    <Paragraph>
      Good typography is invisible. It creates a visual hierarchy that guides the
      reader through content effortlessly. The right typeface, size, and spacing
      can transform a wall of text into an engaging reading experience.
    </Paragraph>
  ),
}

export const LeadStory: Story = {
  name: "Lead",
  render: () => (
    <Lead>
      A design system is a collection of reusable components and clear standards
      that can be assembled to build any number of applications.
    </Lead>
  ),
}

export const LargeStory: Story = {
  name: "Large",
  render: () => <Large>Are you sure you want to continue?</Large>,
}

export const SmallStory: Story = {
  name: "Small",
  render: () => <Small>Last updated 2 hours ago</Small>,
}

export const MutedStory: Story = {
  name: "Muted",
  render: () => <Muted>This action cannot be undone.</Muted>,
}

// --- Code (font-mono: Geist Mono) ---

export const InlineCodeStory: Story = {
  name: "Inline Code",
  render: () => (
    <Paragraph>
      Run <InlineCode>npm install</InlineCode> to get started.
    </Paragraph>
  ),
}

// --- Blockquote ---

export const BlockquoteStory: Story = {
  name: "Blockquote",
  render: () => (
    <Blockquote>
      Design is not just what it looks like and feels like. Design is how it
      works.
    </Blockquote>
  ),
}

// --- Label (JetBrains Mono) ---

export const LabelStory: Story = {
  name: "Label",
  render: () => <Label>SECTION LABEL</Label>,
}

// --- MainMenuMobile (Helvetica Now Display — used in MobileMainMenu items) ---

export const MainMenuMobileStory: Story = {
  name: "MainMenuMobile",
  render: () => (
    <div className="flex flex-col gap-0.5">
      <MainMenuMobile>Main</MainMenuMobile>
      <MainMenuMobile>Selected works</MainMenuMobile>
      <MainMenuMobile>About</MainMenuMobile>
      <MainMenuMobile>History</MainMenuMobile>
    </div>
  ),
}

// --- Composed ---

const allVariantsRender = () => (
  <div className="space-y-6">
    <Muted>
      Resize the viewport or switch between the Mobile/Desktop stories —
      typography scales at 768 px.
    </Muted>
    <H1>Heading 1 — Helvetica Now Display</H1>
    <H2>Heading 2 — JetBrains Mono</H2>
    <H3>Heading 3 — JetBrains Mono</H3>
    <H4>Heading 4 — JetBrains Mono</H4>
    <Lead>
      Lead paragraph — Inter. A design system brings order to chaos.
    </Lead>
    <Paragraph>
      Paragraph — Inter. Good typography is invisible. It creates a visual
      hierarchy that guides the reader through content effortlessly. The right
      typeface, size, and spacing can transform a wall of text into an engaging
      reading experience.
    </Paragraph>
    <Paragraph>
      Another paragraph with <InlineCode>inline code</InlineCode> in Geist Mono.
    </Paragraph>
    <Large>Large text — Helvetica Now Display</Large>
    <Small>Small text — Helvetica Now Display</Small>
    <Muted>Muted text — Inter</Muted>
    <Blockquote>
      Blockquote — Inter italic. Design is not just what it looks like.
    </Blockquote>
    <Label>MONO LABEL — JETBRAINS MONO</Label>
    <MainMenuMobile>MainMenuMobile — Helvetica Now Display</MainMenuMobile>
  </div>
)

export const AllVariants: Story = {
  render: allVariantsRender,
}

export const AllVariantsMobile: Story = {
  name: "All Variants (Mobile 375)",
  render: allVariantsRender,
  globals: { viewport: { value: "mobile" } },
}

export const AllVariantsDesktop: Story = {
  name: "All Variants (Desktop 1280)",
  render: allVariantsRender,
  globals: { viewport: { value: "desktop" } },
}

// --- Dark Mode ---

export const DarkMode: Story = {
  render: () => (
    <div className="space-y-6">
      <H1>Heading 1 — Helvetica Now Display</H1>
      <H2>Heading 2 — JetBrains Mono</H2>
      <H3>Heading 3 — JetBrains Mono</H3>
      <H4>Heading 4 — JetBrains Mono</H4>
      <Lead>
        Lead paragraph — Inter. A design system brings order to chaos.
      </Lead>
      <Paragraph>
        Paragraph — Inter. Good typography is invisible. It creates a visual
        hierarchy that guides the reader through content effortlessly.
      </Paragraph>
      <Paragraph>
        Another paragraph with <InlineCode>inline code</InlineCode> in Geist
        Mono.
      </Paragraph>
      <Large>Large text — Helvetica Now Display</Large>
      <Small>Small text — Helvetica Now Display</Small>
      <Muted>Muted text — Inter</Muted>
      <Blockquote>
        Blockquote — Inter italic. Design is not just what it looks like.
      </Blockquote>
      <Label>MONO LABEL — JETBRAINS MONO</Label>
      <MainMenuMobile>MainMenuMobile — Helvetica Now Display</MainMenuMobile>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-background text-foreground p-4">
        <Story />
      </div>
    ),
  ],
}
