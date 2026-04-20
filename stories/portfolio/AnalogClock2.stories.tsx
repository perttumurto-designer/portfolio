import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AnalogClock2 } from "@/components/portfolio/analog-clock-2"

const meta: Meta<typeof AnalogClock2> = {
  title: "Portfolio/AnalogClock2",
  component: AnalogClock2,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 80, max: 400, step: 20 } },
  },
}
export default meta
type Story = StoryObj<typeof AnalogClock2>

export const Default: Story = {
  args: { size: 240 },
}

export const Small: Story = {
  args: { size: 140 },
}

export const Large: Story = {
  args: { size: 360 },
}

export const DarkMode: Story = {
  args: { size: 240 },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-8 text-foreground">
        <Story />
      </div>
    ),
  ],
}
