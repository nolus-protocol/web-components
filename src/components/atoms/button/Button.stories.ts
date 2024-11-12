import type { Meta, StoryObj } from "@storybook/vue3";

import Button from "./Button.vue";
import { Size, Type } from "@/shared/utils/types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Button",
  component: Button,
  argTypes: {
    severity: { control: "select", options: [Type.primary, Type.danger, Type.tertiary, Type.secondary] },
    size: { control: "select", options: [Size.small, Size.medium, Size.large] },
    iconPosition: { control: "select", options: ["left", "right"] },
    onClick: { action: "clicked" }
  },
  args: {
    label: "Button",
    size: Size.large,
    severity: Type.primary
  } // default value
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    severity: "primary"
  }
};

export const Secondary: Story = {
  args: {
    severity: "secondary"
  }
};

export const Tertiary: Story = {
  args: {
    severity: "tertiary"
  }
};

export const Danger: Story = {
  args: {
    severity: "danger"
  }
};

export const Medium: Story = {
  args: {
    size: "medium"
  }
};
export const Small: Story = {
  args: {
    size: "small"
  }
};

export const WithIcon: Story = {
  args: {
    ...Primary.args,
    icon: "icon-arrow-short-up text-[23px]",
    iconPosition: "left"
  }
};

export const Loading: Story = {
  args: {
    ...Primary.args,
    severity: "primary",
    loading: true
  }
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true
  }
};
