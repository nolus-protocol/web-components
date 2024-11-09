import type { Meta, StoryObj } from "@storybook/vue3";

import Popover from "./Popover.vue";
import Button from "../../atoms/button/Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Popover",
  component: Popover,
  argTypes: {},
  args: {} // default value
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
        <template #parent>
          <Button
              icon="icon-bell text-[20px]"
              severity="secondary"
              size="small"
              class="rounded-full !p-0 w-10 h-10"
          ></Button>
        </template>
        <template #content>
          <p class="text-typography-default">Child Component</p>
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

export const WithButtons: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Popover, Button },
    template: `
      <Popover v-bind="args">
          <template #parent>
            <Button
                icon="icon-bell text-[20px]"
                severity="secondary"
                size="small"
                class="rounded-full !p-0 w-10 h-10"
            ></Button>
          </template>
          <template #content>
            <p class="text-typography-default">Child Component</p>
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
