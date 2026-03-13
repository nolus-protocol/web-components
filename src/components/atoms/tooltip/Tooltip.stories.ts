import type { Meta, StoryObj } from "@storybook/vue3";

import Tooltip from "./Tooltip.vue";
import SvgIcon from "../svg-icon/SvgIcon.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"]
    }
  },
  args: {}, // default value
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: () => ({
    components: { Tooltip, SvgIcon },
    template: `
      <div class="grid grid-cols-2 gap-16 place-items-center p-24">
        <Tooltip content="150%" position="top">
          <SvgIcon name="info" />
        </Tooltip>
        <Tooltip content="150%" position="bottom">
          <SvgIcon name="info" />
        </Tooltip>
        <Tooltip content="150%" position="left">
          <SvgIcon name="info" />
        </Tooltip>
        <Tooltip content="150%" position="right">
          <SvgIcon name="info" />
        </Tooltip>
      </div>
    `
  }),
  args: {
    content: "150%",
    position: "top"
  }
};
