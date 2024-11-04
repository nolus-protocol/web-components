import type { Meta, StoryObj } from "@storybook/vue3";

import Slider from "./Slider.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Slider",
  component: Slider,
  argTypes: {
    onOnDrag: { action: "dragged" }
  },
  args: {} // default value
} satisfies Meta<typeof Slider>;

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
    minPosition: 25,
    maxPosition: 150,
    positions: 5
  }
};
