import type { Meta, StoryObj } from "@storybook/vue3";

import Tooltip from "./Tooltip.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"]
    }
  },
  args: {}, // default value
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Tooltip },
    template: `
        <div class="flex gap-10">
          <Tooltip v-bind="args">
            <div>Hover me</div>
          </Tooltip>
        </div>
    `
  }),
  args: {
    content: "150%",
    position: "top"
  }
};
