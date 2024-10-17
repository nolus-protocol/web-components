import type { Meta, StoryObj } from "@storybook/vue3";

import AdvancedFormControl from "./AdvancedFormControl.vue";

const meta = {
  title: "Components/Molecules/AdvancedFormControl",
  component: AdvancedFormControl,
  argTypes: {},
  parameters: {
    layout: "centered"
  },
  args: {} // default value
} satisfies Meta<typeof AdvancedFormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {}
};
