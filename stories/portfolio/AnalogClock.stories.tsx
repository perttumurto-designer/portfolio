import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AnalogClock } from "@/components/portfolio/analog-clock"

const meta: Meta<typeof AnalogClock> = {
  title: "Portfolio/AnalogClock",
  component: AnalogClock,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 80, max: 400, step: 20 } },
  },
}
export default meta
type Story = StoryObj<typeof AnalogClock>

export const Default: Story = {
  args: { size: 200 },
}

export const Small: Story = {
  args: { size: 120 },
}

export const Large: Story = {
  args: { size: 320 },
}

export const DarkMode: Story = {
  args: { size: 200 },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-8 text-foreground">
        <Story />
      </div>
    ),
  ],
}
