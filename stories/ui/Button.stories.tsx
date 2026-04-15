import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { IconHeart } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
  args: {
    onClick: fn(),
  },
}
export default meta
type Story = StoryObj<typeof Button>

// --- Variants ---

export const Default: Story = {
  args: { children: 'Button' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Destructive' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
}

// --- Sizes ---

export const ExtraSmall: Story = {
  args: { size: 'xs', children: 'Extra Small' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
}

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <IconHeart />,
    'aria-label': 'Like',
  },
}

export const IconExtraSmall: Story = {
  args: {
    size: 'icon-xs',
    children: <IconHeart />,
    'aria-label': 'Like',
  },
}

export const IconSmall: Story = {
  args: {
    size: 'icon-sm',
    children: <IconHeart />,
    'aria-label': 'Like',
  },
}

export const IconLarge: Story = {
  args: {
    size: 'icon-lg',
    children: <IconHeart />,
    'aria-label': 'Like',
  },
}

// --- States ---

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="https://example.com">As Link</a>,
  },
}

// --- Dark Mode ---

export const DarkMode: Story = {
  args: { children: 'Dark Mode' },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4">
        <Story />
      </div>
    ),
  ],
}
