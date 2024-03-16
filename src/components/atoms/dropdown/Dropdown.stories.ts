import type { Meta, StoryObj } from "@storybook/vue3";

import Dropdown from "./Dropdown.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Dropdown",
  component: Dropdown,
  argTypes: {},
  args: {
    id: "1",
    label: "Some Label",
    placeholder: "Select an option",
    error: false,
    options: [
      { value: "apple", label: "Apple", icon: "https://nolus.io/currencies/osmosis-osmo.svg" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange", icon: "https://nolus.io/currencies/osmosis-osmo.svg" },
      { value: "grape", label: "Grape" },
      { value: "strawberry", label: "Strawberry", icon: "https://nolus.io/currencies/osmosis-osmo.svg" },
      { value: "watermelon", label: "Watermelon" }
    ]
  } // default value
} satisfies Meta<typeof Dropdown>;

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
