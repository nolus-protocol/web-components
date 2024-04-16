import type { Meta, StoryObj } from "@storybook/vue3";

import Dialog from "./Dialog.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Dialog",
  component: Dialog,
  argTypes: {
    "onClose-modal": { action: "close" }
  },
  args: {} // default value
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    components: { Dialog },
    template: `
      <Dialog>
        <template v-slot:header>
          <p class="text-neutral-typography-200 py-[20px] px-[40px]">Header</p>
        </template>
        <template v-slot:body>
          <p class="text-neutral-typography-200 py-[20px] px-[40px]">Dialog body</p>
        </template>
        <template v-slot:footer>
          <p class="text-neutral-typography-200 py-[20px] px-[40px]">Footer</p>
        </template>
      </Dialog>
    `
  }),
  args: {}
};
