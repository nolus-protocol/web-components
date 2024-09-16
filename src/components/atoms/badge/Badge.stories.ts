import type { Meta, StoryObj } from "@storybook/vue3";

import Badge from "./Badge.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Badge",
  component: Badge,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Base: Story = {
  args: {
    content: "12"
  }
};

export const Positive: Story = {
  args: {
    base: false,
    content: "12"
  }
};

export const Negative: Story = {
  args: {
    base: false,
    content: "-12"
  }
};
