import type { Meta, StoryObj } from "@storybook/vue3";

import TooltipV2 from "./TooltipV2.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/TooltipV2",
  component: TooltipV2,
  argTypes: {},
  args: {}, // default value
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof TooltipV2>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { TooltipV2 },
    template: `
        <div class="flex gap-10">
          <TooltipV2 v-bind="args">
            <div>Hover me</div>
          </TooltipV2>
        </div>
    `
  }),
  args: {
    content: "150%",
    position: "top"
  }
};
