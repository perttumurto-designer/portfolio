import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { House, Layers, Info, FileUser } from "lucide-react"
import { MainMenuItem } from "@/components/portfolio/main-menu-item"

const meta: Meta<typeof MainMenuItem> = {
  title: "Portfolio/MainMenuItem",
  component: MainMenuItem,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    label: { control: "text" },
  },
}
export default meta
type Story = StoryObj<typeof MainMenuItem>

export const Default: Story = {
  args: { label: "Main", icon: House },
}

export const WithoutIcon: Story = {
  args: { label: "Main" },
}

export const Active: Story = {
  args: { label: "Main", icon: House, active: true },
}

export const HouseIcon: Story = {
  args: { label: "Main", icon: House },
}

export const LayersIcon: Story = {
  args: { label: "Selected works", icon: Layers },
}

export const InfoIcon: Story = {
  args: { label: "About", icon: Info },
}

export const FileUserIcon: Story = {
  args: { label: "History", icon: FileUser },
}

export const ActiveDarkMode: Story = {
  args: { label: "Main", icon: House, active: true },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
}

export const DarkMode: Story = {
  args: { label: "Main", icon: House },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
}
