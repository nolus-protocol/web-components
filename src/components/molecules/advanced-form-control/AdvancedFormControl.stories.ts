import type { Meta, StoryObj } from "@storybook/vue3";

import AdvancedFormControl from "./AdvancedFormControl.vue";
import { iconsExternalUrl } from "../../../shared/utils/types";
import { AssetItemProps } from "../../atoms/asset-list-item/types";
import AssetItem from "../../atoms/asset-list-item/AssetItem.vue";
import { h } from "vue";

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
        value: "osmosis",
        abbreviation: "OSMO",
        label: "Osmosis",
        icon: `${iconsExternalUrl}/osmosis-osmo.svg`,
        balance: { value: "1111.234", ticker: "stOSMO" },
        price: "$123"
      },
      {
        value: "osmosis2",
        abbreviation: "OSMO2",
        label: "Osmosis2",
        icon: `${iconsExternalUrl}/osmosis-osmo.svg`,
        balance: { value: "1111.234", ticker: "stOSMO" },
        price: "$123",
        disabled: true
      }
    ],
    tooltip: "Some tooltip text",
    itemsHeadline: ["Assets", "Your balance"],
    itemTemplate: (item: any) =>
      h<AssetItemProps>(AssetItem, { name: item.label, ...item, balance: item.balance.value })
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
