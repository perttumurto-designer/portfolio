import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'

import { Switch } from '@/components/ui/switch'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
  args: {
    onCheckedChange: fn(),
  },
}
export default meta
type Story = StoryObj<typeof Switch>

// --- States ---

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

// --- Sizes ---

export const Small: Story = {
  args: { size: 'sm' },
}

export const SmallChecked: Story = {
  args: { size: 'sm', defaultChecked: true },
}

// --- With Label ---

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="with-label" {...args} />
      <label
        htmlFor="with-label"
        className="font-sans text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        Airplane Mode
      </label>
    </div>
  ),
}

export const WithLabelDisabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="with-label-disabled" {...args} />
      <label
        htmlFor="with-label-disabled"
        className="font-sans text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        Airplane Mode
      </label>
    </div>
  ),
}

// --- Dark Mode ---

export const DarkMode: Story = {
  args: { defaultChecked: true },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4">
        <Story />
      </div>
    ),
  ],
}
