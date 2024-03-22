import type { Meta, StoryObj } from "@storybook/vue3";

import Boxes from "./Boxes.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Boxes",
  component: Boxes,
  argTypes: {
    onClick: { action: "clicked" }
  },
  args: {
    label: "Connect Wallet",
    icon: "icon-google"
  } // default value
} satisfies Meta<typeof Boxes>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {}
};
