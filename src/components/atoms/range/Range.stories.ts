import type { Meta, StoryObj } from "@storybook/vue3";

import Range from "./Range.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Range",
  component: Range,
  argTypes: {
    onOnDrag: { action: "dragged" }
  },
  args: {} // default value
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    class: "max-w-[450px]",
    minPosiiton: 25,
    maxPosition: 150,
    positions: 5
  }
};
