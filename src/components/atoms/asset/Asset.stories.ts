import type { Meta, StoryObj } from "@storybook/vue3";
import { iconsExternalUrl} from "../../../shared/utils/types";
import Asset from "./Asset.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Asset",
  component: Asset,
  argTypes: {},
  args: {
    icon: `${iconsExternalUrl}/NTRN.svg`,
    amount: "5213.213 NLS",
    stableAmount: "~$77.78 "
  } // default value
} satisfies Meta<typeof Asset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
