import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import Popover from "./Popover.vue";
import Button from "../../atoms/button/Button.vue";
import Dropdown from "../../atoms/dropdown/Dropdown.vue";

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

export const PopoverReveal: Story = {
  render: (args) => ({
    setup() {
      const buttonRef = ref<HTMLElement | null>(null);
      const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
      const options = [
        { value: "1", label: "Option One" },
        { value: "2", label: "Option Two" },
        { value: "3", label: "Option Three" }
      ];
      return { args, buttonRef, popoverRef, options };
    },
    components: { Popover, Button, Dropdown },
    template: `
      <div ref="buttonRef" style="display: inline-block;">
        <Button size="medium" severity="primary" @click="popoverRef?.toggle()">Trigger</Button>
      </div>
      <Popover ref="popoverRef" v-bind="args" :parent="buttonRef">
        <template #content>
          <div class="p-4 flex flex-col gap-4">
            <Dropdown label="Pick an option" placeholder="Select..." :options="options" />
            <Dropdown label="Another dropdown" placeholder="Select..." :options="options" />
          </div>
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
