import type { Meta, StoryObj } from "@storybook/vue3";

import Dropdown from "./Dropdown.vue";
import { iconsExternalUrl, Size } from "../../../shared/utils/types";
import { h } from "vue";
import AssetItem from "../asset-list-item/AssetItem.vue";
import type { AssetItemProps } from "../asset-list-item/types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Dropdown",
  component: Dropdown,
  argTypes: {
    size: { control: "select", options: [Size.small, Size.medium] }
  },
  args: {
    id: "1",
    placeholder: "Select an option",
    size: Size.medium,
    error: false,
    searchable: false,
    dropdownLabel: "",
    options: [
      { value: "apple", label: "Apple", icon: `${iconsExternalUrl}/osmosis-usdc.svg` },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange", icon: `${iconsExternalUrl}/osmosis-usdc.svg` },
      { value: "grape", label: "Grape" },
      { value: "strawberry", label: "Strawberry", icon: `${iconsExternalUrl}/osmosis-usdc.svg` },
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
export const Default: Story = {
  args: {
    onSelect: () => {}
  }
};

export const WithAssetItem: Story = {
  args: {
    options: [
      {
        value: "nolus",
        label: "Nolus",
        abbreviation: "NLS",
        icon: `${iconsExternalUrl}/osmosis-nls.svg`,
        balance: "1.234",
        price: "$123"
      },
      {
        value: "osmosis",
        abbreviation: "OSMO",
        label: "Osmosis",
        icon: `${iconsExternalUrl}/osmosis-osmo.svg`,
        balance: "1.234",
        price: "$123"
      },
      {
        value: "cosmos",
        abbreviation: "ATOM",
        label: "Cosmos",
        icon: `${iconsExternalUrl}/osmosis-atom.svg`,
        balance: "1.234",
        price: "$123"
      },
      {
        value: "stOSMO",
        abbreviation: "stOSMO",
        label: "Stride Staked Osmo",
        icon: `${iconsExternalUrl}/osmosis-stosmo.svg`,
        balance: "1.234",
        price: "$123"
      },
      {
        value: "stATOM",
        abbreviation: "stATOM",
        label: "Stride Staked Atom",
        icon: `${iconsExternalUrl}/osmosis-statom.svg`,
        balance: "1.234",
        price: "$123"
      }
    ],
    onSelect: () => {},
    itemsHeadline: ["Assets", "Your balance"],
    itemTemplate: (item: any) => h<AssetItemProps>(AssetItem, { name: item.label, ...item }),
    searchable: true,
    dropdownLabel: "Select token"
  }
};
