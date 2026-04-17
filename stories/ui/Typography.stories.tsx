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
} from "@/components/ui/typography"

const meta: Meta = {
  title: "UI/Typography",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj

// --- Headings (font-heading: JetBrains Mono) ---

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

// --- Body text (font-sans: Inter) ---

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

// --- Composed ---

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <H1>Heading 1 — JetBrains Mono</H1>
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
        Another paragraph with <InlineCode>inline code</InlineCode> in Geist
        Mono.
      </Paragraph>
      <Large>Large text — Inter</Large>
      <Small>Small text — Inter</Small>
      <Muted>Muted text — Inter</Muted>
      <Blockquote>
        Blockquote — Inter italic. Design is not just what it looks like.
      </Blockquote>
    </div>
  ),
}

// --- Dark Mode ---

export const DarkMode: Story = {
  render: () => (
    <div className="space-y-6">
      <H1>Heading 1 — JetBrains Mono</H1>
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
      <Large>Large text — Inter</Large>
      <Small>Small text — Inter</Small>
      <Muted>Muted text — Inter</Muted>
      <Blockquote>
        Blockquote — Inter italic. Design is not just what it looks like.
      </Blockquote>
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
