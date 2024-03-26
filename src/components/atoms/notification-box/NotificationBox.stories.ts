import type { Meta, StoryObj } from "@storybook/vue3";

import NotificationBox from "./NotificationBox.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/NotificationBox",
  component: NotificationBox,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof NotificationBox>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Warning: Story = {
  render: () => ({
    components: { NotificationBox },
    template: `
      <NotificationBox type="warning">
        <template v-slot:content>
          <span class="font-medium">Backup your mnemonic securely!</span> Never share it with others or enter it in unverified sites.
        </template>
      </NotificationBox>
    `
  }),
  args: {}
};

export const Error: Story = {
  render: () => ({
    components: { NotificationBox },
    template: `
      <NotificationBox type="error">
        <template v-slot:content>
          <span class="font-medium">Error</span> has occurred, please follow the lorem ipsum guide to fix it.
        </template>
      </NotificationBox>
    `
  }),
  args: {}
};
