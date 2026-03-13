import type { Meta, StoryObj } from "@storybook/vue3";

import Slider from "./Slider.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Slider",
  component: Slider,
  argTypes: {
    onOnDrag: { action: "dragged" },
    labelLeft: { control: "text" },
    labelRight: { control: "text" },
    labelMid: { control: "text" },
    positions: { control: "number" },
    minPosition: { control: "number" },
    midPosition: { control: "number" },
    maxPosition: { control: "number" },
    disabled: { control: "boolean" },
    value: { control: "number" }
  },
  args: {}, // default value
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { Slider },
    setup: () => ({ args }),
    template: `<Slider v-bind="args" />`
  }),
  args: {
    class: "w-[450px]",
    labelLeft: "Min",
    labelRight: "Max",
    labelMid: "",
    positions: 5,
    minPosition: 25,
    midPosition: undefined,
    maxPosition: 150,
    disabled: false,
    value: undefined
  }
};
