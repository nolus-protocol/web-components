import type { Meta, StoryObj } from "@storybook/vue3";

import Input from "./Input.vue";
import { InputType } from "@/components/atoms/input/types";
import { Size } from "@/shared/utils/types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Input",
  component: Input,
  argTypes: {
    type: { control: "select", options: Object.keys(InputType).map((type) => type) },
    size: { control: "select", options: [Size.small, Size.medium] }
  },
  args: {
    id: "1",
    label: "Some Label",
    type: InputType.text,
    value: "",
    error: false
  } // default value
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
    type: InputType.text,
    label: "Enter text"
  }
};

export const Password: Story = {
  args: {
    type: InputType.password,
    label: "Password"
  }
};

export const Email: Story = {
  args: {
    type: InputType.email,
    label: "Enter email address"
  }
};

export const Search: Story = {
  args: {
    type: InputType.search,
    label: "Search"
  }
};
