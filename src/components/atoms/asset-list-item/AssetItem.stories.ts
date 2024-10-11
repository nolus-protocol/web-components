import type { Meta, StoryObj } from "@storybook/vue3";

import AssetItem from "./AssetItem.vue";
import { iconsExternalUrl } from "@/shared/utils/types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/AssetItem",
  component: AssetItem,
  argTypes: {},
  args: {
    icon: `${iconsExternalUrl}/osmosis-usdc.svg`,
    name: "Apple",
    abbreviation: "AP",
    balance: "0.000000",
    price: "$0.000000"
  } // default value
} satisfies Meta<typeof AssetItem>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  args: {}
};
