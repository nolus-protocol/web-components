import type { Meta, StoryObj } from "@storybook/vue3";

import Tooltip from "./Tooltip.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Tooltip",
  component: Tooltip,
  argTypes: {},
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
export const Primary: Story = {
  args: {
    content: "This is a tooltip",
    class: "text-32"
  }
};
