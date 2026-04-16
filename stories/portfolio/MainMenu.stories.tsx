import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { House, Layers, Info, FileUser, Bot, Paintbrush } from "lucide-react"
import { MainMenu } from "@/components/portfolio/main-menu"

const defaultItems = [
  { label: "Main", icon: House },
  { label: "Selected works", icon: Layers },
  { label: "About", icon: Info },
  { label: "History", icon: FileUser },
]

const meta: Meta<typeof MainMenu> = {
  title: "Portfolio/MainMenu",
  component: MainMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof MainMenu>

export const Default: Story = {
  args: { items: defaultItems },
}

export const WithActiveItem: Story = {
  args: {
    items: [
      { label: "Main", icon: House },
      { label: "Selected works", icon: Layers, active: true },
      { label: "About", icon: Info },
      { label: "History", icon: FileUser },
    ],
  },
}

export const FewItems: Story = {
  args: {
    items: [
      { label: "Main", icon: House },
      { label: "About", icon: Info },
    ],
  },
}

export const ManyItems: Story = {
  args: {
    items: [
      { label: "Main", icon: House },
      { label: "Selected works", icon: Layers },
      { label: "About", icon: Info },
      { label: "History", icon: FileUser },
      { label: "AI", icon: Bot },
      { label: "Design", icon: Paintbrush },
    ],
  },
}

export const DarkMode: Story = {
  args: { items: defaultItems },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
}
