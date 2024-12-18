import type { Meta, StoryObj } from "@storybook/vue3";

import SvgIcon from "./SvgIcon.vue";
import { iconNames, type SvgProps } from "./types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/SvgIcon",
  component: SvgIcon,
  argTypes: {
    size: { control: "select", options: ["xs", "s", "m", "l", "xl", "2xl"] },
    name: { control: "select", options: iconNames }
  },
  args: {} // default value
} satisfies Meta<typeof SvgIcon>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    name: "assets"
  } as SvgProps
};
