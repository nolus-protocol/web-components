import type { Meta, StoryObj } from "@storybook/vue3";

import Toast from "./Toast.vue";
import { ToastType } from "./types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Toast",
  component: Toast,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Toast },
    template: `
     <Toast v-bind="args">
          You will be prompted for a second signature after the first transaction is finalized.
      </Toast>
    `
  }),
  args: {
    type: ToastType.info,
    undoBtnProps: {
      label: "Info"
    }
  }
};

export const Success: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Toast },
    template: `
      <Toast v-bind="args">
          You will be prompted for a second signature after the first transaction is finalized.
      </Toast>
    `
  }),
  args: {
    type: ToastType.success
  }
};

export const Error: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Toast },
    template: `
      <Toast v-bind="args">
          You will be prompted for a second signature after the first transaction is finalized.
      </Toast>
    `
  }),
  args: {
    type: ToastType.error
  }
};
