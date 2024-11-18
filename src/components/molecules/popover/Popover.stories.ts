import type { Meta, StoryObj } from "@storybook/vue3";

import Popover from "./Popover.vue";
import Button from "../../atoms/button/Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Popover",
  component: Popover,
  argTypes: {},
  args: {
    parent: ""
  } // default value
} satisfies Meta<typeof Popover>;

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
    components: { Popover, Button },
    template: `
      <Popover v-bind="args">
        <template #content>
          <p class="text-typography-default p-4">Child Component</p>
        </template>
      </Popover>
    `
  }),
  args: {
    title: "Popover Title",
    showClose: true,
    position: "bottom-left",
    class: "md:w-full"
  }
};

export const WithButtons: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Popover, Button },
    template: `
      <Popover v-bind="args">
          <template #content>
            <p class="text-typography-default p-4">Child Component</p>
          </template>
          <template #footer>
            <div class="flex justify-end">
              <Button
                label="Add Wallet"
                severity="secondary"
                size="small"
              />
            </div>
          </template>
      </Popover>
    `
  }),
  args: {
    title: "Popover Title",
    showClose: true,
    position: "bottom-left"
  }
};
