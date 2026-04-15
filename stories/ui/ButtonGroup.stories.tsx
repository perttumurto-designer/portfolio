import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { IconBold, IconItalic, IconUnderline, IconAlignLeft, IconAlignCenter, IconAlignRight, IconChevronDown } from '@tabler/icons-react'

import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof ButtonGroup> = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
}
export default meta
type Story = StoryObj<typeof ButtonGroup>

// --- Orientations ---

export const Default: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" onClick={fn()}>First</Button>
        <Button variant="outline" onClick={fn()}>Second</Button>
        <Button variant="outline" onClick={fn()}>Third</Button>
      </>
    ),
  },
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    children: (
      <>
        <Button variant="outline" onClick={fn()}>First</Button>
        <Button variant="outline" onClick={fn()}>Second</Button>
        <Button variant="outline" onClick={fn()}>Third</Button>
      </>
    ),
  },
}

// --- Button Variants ---

export const OutlineButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" onClick={fn()}>Cancel</Button>
        <Button variant="outline" onClick={fn()}>Save</Button>
        <Button variant="outline" onClick={fn()}>Publish</Button>
      </>
    ),
  },
}

export const SecondaryButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="secondary" onClick={fn()}>Day</Button>
        <Button variant="secondary" onClick={fn()}>Week</Button>
        <Button variant="secondary" onClick={fn()}>Month</Button>
      </>
    ),
  },
}

export const GhostButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="ghost" onClick={fn()}>Day</Button>
        <Button variant="ghost" onClick={fn()}>Week</Button>
        <Button variant="ghost" onClick={fn()}>Month</Button>
      </>
    ),
  },
}

// --- With Icons ---

export const IconButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" size="icon" aria-label="Bold" onClick={fn()}><IconBold /></Button>
        <Button variant="outline" size="icon" aria-label="Italic" onClick={fn()}><IconItalic /></Button>
        <Button variant="outline" size="icon" aria-label="Underline" onClick={fn()}><IconUnderline /></Button>
      </>
    ),
  },
}

export const AlignmentToolbar: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" size="icon" aria-label="Align left" onClick={fn()}><IconAlignLeft /></Button>
        <Button variant="outline" size="icon" aria-label="Align center" onClick={fn()}><IconAlignCenter /></Button>
        <Button variant="outline" size="icon" aria-label="Align right" onClick={fn()}><IconAlignRight /></Button>
      </>
    ),
  },
}

// --- With Separator ---

export const WithSeparator: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" onClick={fn()}>Save</Button>
        <ButtonGroupSeparator />
        <Button variant="outline" size="icon" aria-label="More options" onClick={fn()}><IconChevronDown /></Button>
      </>
    ),
  },
}

// --- With Text ---

export const WithText: Story = {
  args: {
    children: (
      <>
        <ButtonGroupText>
          <span className="font-sans text-sm font-medium text-muted-foreground">Label</span>
        </ButtonGroupText>
        <Button variant="outline" onClick={fn()}>Action</Button>
      </>
    ),
  },
}

// --- Sizes ---

export const SmallButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" size="sm" onClick={fn()}>First</Button>
        <Button variant="outline" size="sm" onClick={fn()}>Second</Button>
        <Button variant="outline" size="sm" onClick={fn()}>Third</Button>
      </>
    ),
  },
}

export const LargeButtons: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" size="lg" onClick={fn()}>First</Button>
        <Button variant="outline" size="lg" onClick={fn()}>Second</Button>
        <Button variant="outline" size="lg" onClick={fn()}>Third</Button>
      </>
    ),
  },
}

// --- States ---

export const WithDisabledButton: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" onClick={fn()}>Enabled</Button>
        <Button variant="outline" disabled>Disabled</Button>
        <Button variant="outline" onClick={fn()}>Enabled</Button>
      </>
    ),
  },
}

// --- Dark Mode ---

export const DarkMode: Story = {
  args: {
    children: (
      <>
        <Button variant="outline" onClick={fn()}>First</Button>
        <Button variant="outline" onClick={fn()}>Second</Button>
        <Button variant="outline" onClick={fn()}>Third</Button>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-background text-foreground p-4">
        <Story />
      </div>
    ),
  ],
}
