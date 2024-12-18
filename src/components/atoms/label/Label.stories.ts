import Label from "./Label.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { Variant } from "../../../shared/utils/types";

const meta = {
  title: "Components/Atoms/Label",
  component: Label,
  argTypes: {
    variant: { control: "select", options: Object.keys(Variant).map((variant) => variant) },
    icon: { control: "text" },
    iconPosition: { control: "select", options: ["left", "right"] }
  },
  args: {
    value: "Label",
    variant: Variant.info
  } // default value
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Secondary: Story = {
  args: {
    variant: Variant.secondary
  }
};

export const Info: Story = {
  args: {
    variant: Variant.info
  }
};

export const Success: Story = {
  args: {
    variant: Variant.success
  }
};

export const Warning: Story = {
  args: {
    variant: Variant.warning
  }
};

export const Error: Story = {
  args: {
    variant: Variant.error
  }
};
