import type { Meta, StoryObj } from "@storybook/vue3";

import Widget from "./Widget.vue";
import Button from "../../atoms/button/Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Molecules/Widget",
  component: Widget,
  argTypes: {},
  args: {} // default value
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Widget, Button },
    template: `
     <Widget v-bind="args">
        <div class="flex justify-between items-center">
          Widget Header
          <Button
            label="Send"
            severity="secondary"
            size="large"
          ></Button>
        </div>
        <div>Widget number area</div>
        <div>Widget Content</div>
      </Widget>
    `
  }),
  args: {}
};
