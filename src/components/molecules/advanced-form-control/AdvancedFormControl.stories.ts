import type { Meta, StoryObj } from "@storybook/vue3";

import AdvancedFormControl from "./AdvancedFormControl.vue";
import { iconsExternalUrl } from "@/shared/utils/types";

const meta = {
  title: "Components/Molecules/AdvancedFormControl",
  component: AdvancedFormControl,
  argTypes: {},
  parameters: {
    layout: "centered"
  },
  args: {
    id: "currency-3",
    label: "Position Size",
    placeholder: "0",
    balanceLabel: "Balance:",
    calculatedBalance: "$0",
    currencyOptions: [
      {
        value: "usdc",
        label: "USDC",
        icon: `${iconsExternalUrl}/osmosis-usdc.svg`,
        balance: { value: "123.234", ticker: "USDC" }
      },
      {
        value: "nls",
        label: "Nolus",
        icon: `${iconsExternalUrl}/osmosis-nls.svg`,
        balance: { value: "555.234", ticker: "NLS" }
      },
      {
        value: "stOSMO",
        label: "stOSMO",
        icon: `${iconsExternalUrl}/osmosis-stosmo.svg`,
        balance: { value: "1111.234", ticker: "stOSMO" }
      }
    ],
    tooltip: "Some tooltip text"
  } // default value
} satisfies Meta<typeof AdvancedFormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    class: "w-[400px]"
  }
};

export const WithError: Story = {
  args: {
    class: "w-[400px]",
    isError: true,
    errorMsg: "Some error text"
  }
};
