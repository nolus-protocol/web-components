import type { Meta, StoryObj } from "@storybook/vue3";

import HelpText from "./HelpText.vue";
import { Variant } from "@/shared/utils/types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/HelpText",
  component: HelpText,
  argTypes: {
    variant: {
      options: [Variant.info, Variant.success, Variant.error],
      control: { type: "select" }
    }
  },
  args: {} // default value
} satisfies Meta<typeof HelpText>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Info: Story = {
  args: {
    variant: Variant.info,
    content: "This is an information message"
  }
};

export const Success: Story = {
  args: {
    variant: Variant.success,
    content: "This is a success message"
  }
};

export const Error: Story = {
  args: {
    variant: Variant.error,
    content: "This is an error message"
  }
};
