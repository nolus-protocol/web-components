import type { Meta, StoryObj } from "@storybook/vue3";

import NotificationButton from "./NotificationButton.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/NotificationButton",
  component: NotificationButton,
  argTypes: {
    onClick: { action: "clicked" }
  },
  args: {} // default value
} satisfies Meta<typeof NotificationButton>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {}
};
