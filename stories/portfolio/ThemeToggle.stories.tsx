import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ThemeToggle } from "@/components/portfolio/theme-toggle"

const meta: Meta<typeof ThemeToggle> = {
  title: "Portfolio/ThemeToggle",
  component: ThemeToggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ThemeToggle>

export const Light: Story = {
  decorators: [
    (Story) => (
      <div className="bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
}

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
}
