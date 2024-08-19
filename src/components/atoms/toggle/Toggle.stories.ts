import type { Meta, StoryObj } from "@storybook/vue3";

import Toggle from "./Toggle.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Toggle",
  component: Toggle,
  argTypes: {},
  args: {
    id: "toggle-1",
    label: "Show small balances",
    value: false
  } // default value
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
