import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TextCard } from "@/components/portfolio/text-card"

const meta: Meta<typeof TextCard> = {
  title: "Portfolio/TextCard",
  component: TextCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof TextCard>

const defaultArgs = {
  label: "AI WAY OF DESIGNING",
  heading: "2 000% Faster",
  lead: "When we are moving faster than ever before the direction is more crucial than ever.",
  body: "Design is more valuable that ever before. When everyone build everything the best and most meaningful experience wins. If your product doesn't feel right someone can build it in day. The ideas are not valueabe. The execution is.",
}

export const Default: Story = {
  args: defaultArgs,
  decorators: [
    (Story) => (
      <div className="w-[393px]">
        <Story />
      </div>
    ),
  ],
}

export const DarkMode: Story = {
  args: defaultArgs,
  decorators: [
    (Story) => (
      <div className="dark bg-background p-8 text-foreground">
        <div className="w-[393px]">
          <Story />
        </div>
      </div>
    ),
  ],
}

export const Mobile: Story = {
  args: defaultArgs,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  decorators: [
    (Story) => (
      <div className="w-[312px]">
        <Story />
      </div>
    ),
  ],
}
