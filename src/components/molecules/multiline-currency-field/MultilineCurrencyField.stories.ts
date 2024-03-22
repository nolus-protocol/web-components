import type { Meta, StoryObj } from "@storybook/vue3";

import MultilineCurrencyField from "./MultilineCurrencyField.vue";
import { iconsExternalUrl } from "@/utils/types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/MultilineCurrencyField",
  component: MultilineCurrencyField,
  argTypes: {},
  parameters: {
    layout: "centered"
  },
  args: {
    id: "currency-1",
    label: "Amount",
    placeholder: "0",
    balance: {
      label: "Balance",
      value: "312,312,231",
      ticker: "USDT"
    },
    firstCalculatedBalance: "$0",
    secondCalculatedBalance: "$0",
    currencyOptions: [
      { value: "apple", label: "Apple", icon: `${iconsExternalUrl}/osmosis-usdc.svg` },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange", icon: `${iconsExternalUrl}/osmosis-usdc.svg` },
      { value: "grape", label: "Grape" },
      { value: "strawberry", label: "Strawberry", icon: `${iconsExternalUrl}/osmosis-usdc.svg` },
      { value: "watermelon", label: "Watermelon" }
    ],
    tooltip: "Some tooltip text"
  } // default value
} satisfies Meta<typeof MultilineCurrencyField>;

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

export const WithError: Story = {
  args: {
    isError: true,
    errorMsg: "Some error text"
  }
};
