import type { Meta, StoryObj } from "@storybook/vue3";

import Dialog, { DialogProps } from "./Dialog.vue";
import Button from "../../atoms/button/Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Dialog",
  component: Dialog,
  argTypes: {},
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
    components: { Dialog },
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
    showClose: true,
    class: "!visible !opacity-[1]"
  } as DialogProps
};

export const WithTabs: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Dialog },
    template: `
      <Dialog v-bind="args">
          <template #tab-content-0>
            <p class="text-typography-default">Child Component 1</p>
          </template>
          <template #tab-content-1>
            <p class="text-typography-default">Child Component 2</p>
          </template>
      </Dialog>
    `
  }),
  args: {
    title: "Dialog Title",
    showClose: true,
    class: "!visible !opacity-[1]",
    tabs: ["Long", "Short"]
  } as DialogProps
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
    title: "Dialog Title",
    class: "!visible !opacity-[1]"
  }
};
