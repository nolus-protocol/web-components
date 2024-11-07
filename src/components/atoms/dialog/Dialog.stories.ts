import type { Meta, StoryObj } from "@storybook/vue3";

import Dialog from "./Dialog.vue";
import Button from "../button/Button.vue";

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
export const WithClose: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Dialog, Button },
    template: `
      <Dialog v-bind="args">
          <template #content>
            <p class="text-typography-default">Child Component</p>
          </template>
      </Dialog>
    `
  }),
  args: {
    title: "Dialog Title",
    showClose: true
  }
};

export const WithButtons: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Dialog, Button },
    template: `
      <Dialog v-bind="args">
          <template #content>
            <p class="text-typography-default">Child Component</p>
          </template>
          <template #footer>
            <div class="flex justify-end gap-2.5">
              <Button
                label="Cancel"
                severity="tertiary"
                size="large"
                @click="
                  () => {
                  console.info('dsadsadasdadsada');
                  }
                "
              />
              <Button
                label="Button"
                severity="secondary"
                size="large"
                @click="
                  () => {
                  console.info('dsadsadasdadsada');
                  }
                "
              />
            </div>
          </template>
      </Dialog>
    `
  }),
  args: {
    title: "Dialog Title"
  }
};
