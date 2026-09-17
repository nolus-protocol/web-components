import type { Meta, StoryObj } from "@storybook/vue3";
import { onMounted, ref } from "vue";

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
    },
    tilt: {
      control: { type: "range", min: -25, max: 25, step: 1 }
    }
  },
  args: {} // default value
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

export const Tilted: Story = {
  render: (args) => ({
    components: { Tooltip, SvgIcon },
    setup() {
      const visible = ref(false);
      onMounted(() => {
        visible.value = true;
      });
      return { args, visible };
    },
    template: `
      <div class="p-24">
        <Tooltip :content="args.content" :position="args.position" :tilt="args.tilt" :force-visible="visible">
          <SvgIcon name="info" />
        </Tooltip>
      </div>
    `
  }),
  args: {
    content: "150%",
    position: "top",
    tilt: 12
  }
};
