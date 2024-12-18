import type { Meta, StoryObj } from "@storybook/vue3";

import Stepper from "./Stepper.vue";
import { StepperVariant } from "./types";
import { iconsExternalUrl } from "../../../shared/utils/types";
import { h } from "vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Stepper",
  component: Stepper,
  argTypes: {},
  args: {
    activeStep: 0
  } // default value
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Small: Story = {
  args: {
    variant: StepperVariant.SMALL,
    activeStep: 2,
    steps: [
      { label: "Step 1", icon: `${iconsExternalUrl}/osmosis-nls.svg` },
      { label: "Step 1", icon: `${iconsExternalUrl}/osmosis-nls.svg` },
      { label: "Step 1", icon: `${iconsExternalUrl}/osmosis-nls.svg`, approval: true },
      { label: "Step 1", icon: `${iconsExternalUrl}/osmosis-nls.svg` }
    ]
  }
};

export const Medium: Story = {
  args: {
    variant: StepperVariant.MEDIUM,
    activeStep: 2,
    steps: [
      {
        label: "Transfer",
        icon: `${iconsExternalUrl}/osmosis-nls.svg`,
        token: { balance: 100, symbol: "NLS" },
        meta: () => h("div", `Osmosis > Nolus (#ac34aadf) Nolus`)
      },
      {
        label: "Transfer",
        icon: `${iconsExternalUrl}/osmosis-atom.svg`,
        token: { balance: 100, symbol: "NLS" }
      },
      { label: "Transfer", icon: `${iconsExternalUrl}/osmosis-atom.svg`, token: { balance: 100, symbol: "NLS" } },
      { label: "Transfer", icon: `${iconsExternalUrl}/osmosis-atom.svg`, token: { balance: 100, symbol: "NLS" } }
    ]
  }
};
