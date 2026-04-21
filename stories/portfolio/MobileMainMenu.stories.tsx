import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { House, Layers, Info, FileUser } from "lucide-react"
import { MobileMainMenu } from "@/components/portfolio/mobile-main-menu"

const defaultItems = [
  { label: "Main", icon: House },
  { label: "Selected works", icon: Layers },
  { label: "About", icon: Info },
  { label: "History", icon: FileUser },
]

const meta: Meta<typeof MobileMainMenu> = {
  title: "Portfolio/MobileMainMenu",
  component: MobileMainMenu,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile" },
  },
  globals: { viewport: { value: "mobile" } },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
  },
}
export default meta
type Story = StoryObj<typeof MobileMainMenu>

export const Closed: Story = {
  args: { items: defaultItems },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
}

export const Opened: Story = {
  args: { items: defaultItems, defaultOpen: true },
  parameters: {
    docs: { story: { inline: false, iframeHeight: 600 } },
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

export const OpenedDarkMode: Story = {
  args: { items: defaultItems, defaultOpen: true },
  parameters: {
    docs: { story: { inline: false, iframeHeight: 600 } },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
}
