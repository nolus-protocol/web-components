import type { ComponentPropsAndSlots, Meta, StoryObj } from "@storybook/vue3";
import type { ButtonHTMLAttributes } from "vue";

import Button from "./Button.vue";
import { Size, Type } from "@/shared/utils/types";

// Button declares no emits: a click listener falls through to the native <button>, so it is an arg beside the props.
type ButtonArgs = ComponentPropsAndSlots<typeof Button> & Pick<ButtonHTMLAttributes, "onClick">;

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
} satisfies Meta<ButtonArgs>;

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

export const Badge: Story = {
  args: {
    severity: "badge"
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
    icon: "arrow-up",
    iconPosition: "left"
  }
};

export const Icon: Story = {
  args: {
    ...Primary.args,
    label: "",
    icon: "arrow-up"
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
