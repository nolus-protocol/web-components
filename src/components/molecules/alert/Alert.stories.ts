import type { Meta, StoryObj } from "@storybook/vue3";

import Alert from "./Alert.vue";
import { AlertType } from "./types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Alert",
  component: Alert,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

export const Warning: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Alert },
    template: `
     <Alert v-bind="args">
        <template v-slot:content>
          You will be prompted for a second signature after the first transaction is finalized.
        </template>
      </Alert>
    `
  }),
  args: {
    type: AlertType.warning,
    title: "Warning title"
  }
};

export const Error: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Alert },
    template: `
      <Alert v-bind="args">
        <template v-slot:content>
          You will be prompted for a second signature after the first transaction is finalized.
        </template>
      </Alert>
    `
  }),
  args: {
    type: AlertType.error,
    title: "Error title"
  }
};

export const Info: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Alert },
    template: `
      <Alert v-bind="args">
        <template v-slot:content>
          You will be prompted for a second signature after the first transaction is finalized.
        </template>
      </Alert>
    `
  }),
  args: {
    type: AlertType.info,
    title: "Info title"
  }
};

export const Success: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Alert },
    template: `
      <Alert v-bind="args">
        <template v-slot:content>
          You will be prompted for a second signature after the first transaction is finalized.
        </template>
      </Alert>
    `
  }),
  args: {
    type: AlertType.success,
    title: "Success title"
  }
};
