import type { Meta, StoryObj } from '@storybook/vue3'

import Button from './Button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  component: Button,
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    iconPosition: { control: "select", options: ["left", "right"] },
    onClick: { action: "clicked" },
  },
  args: {

  }, // default value
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
    label: "Button",
  },
};

export const Outlined: Story = {
  args: {
    label: "Button",
    outlined: true,
  },
};

export const Medium: Story = {
  args: {
    label: "Button",
    size: "medium",
  },
};

export const Small: Story = {
  args: {
    label: "Button",
    size: "small",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Button",
    icon: "icon-hub",
    iconPosition: "left",
  },
};
