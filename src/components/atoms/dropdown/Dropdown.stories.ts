import type { Meta, StoryObj } from "@storybook/vue3";

import Dropdown from "./Dropdown.vue";
import { iconsExternalUrl, Size } from "@/shared/utils/types";
import { h } from "vue";
import AssetItem from "@/components/atoms/asset-list-item/AssetItem.stories";
import type { AssetItemProps } from "@/components/atoms/asset-list-item/types";

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

export const WithCustomItem: Story = {
  args: {
    onSelect: () => {},
    itemsHeadline: ["Assets", "Your balance"],
    itemTemplate: (item: any) =>
      h<AssetItemProps>(
        AssetItem,
        { name: item.label, icon: item.icon, abbreviation: item.label.splice(0, 2), balance: "", price: "" },
        [item.label]
      )
  }
};
