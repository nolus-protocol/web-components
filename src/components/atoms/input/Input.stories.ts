import type { Meta, StoryObj } from "@storybook/vue3";

import Input from "./Input.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Input",
  component: Input,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Text: Story = {
  args: {
    type: "text",
    label: "Enter text"
  }
};

export const Password: Story = {
  args: {
    type: "password",
    label: "Password"
  }
};

export const Email: Story = {
  args: {
    type: "email",
    label: "Enter email address"
  }
};
