import type { Meta, StoryObj } from "@storybook/vue3";

import FormControl from "./FormControl.vue";
import Input from "@/components/atoms/input/Input.vue";
import { InputType } from "@/components/atoms/input/types";
import Dropdown from "@/components/atoms/dropdown/Dropdown.vue";

import { FormControlVariant } from "@/components/atoms/form-control/types";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/FormControl",
  component: FormControl,
  argTypes: {
    variant: { control: "select", options: [FormControlVariant.vertical, FormControlVariant.horizontal] }
  },
  args: {
    label: "Some Label",
    error: false,
    variant: FormControlVariant.vertical,
    helperText: "Some helper text"
  } // default value
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Vertical: Story = {
  render: (args) => ({
    data() {
      return { args, InputType };
    },
    components: { Input, FormControl },
    template: `
      <FormControl
        v-bind="args"
      >
        <Input id="test" :type="InputType.text" :error="args.error" />
      </FormControl>
    `
  }),
  args: {
    label: "Vertical Label",
    error: true,
    variant: FormControlVariant.vertical
  }
};

export const Horizontal: Story = {
  render: (args) => ({
    data() {
      return { args };
    },
    components: { Dropdown, FormControl },
    template: `
      <FormControl
        v-bind="args"
      >
        <Dropdown id="test" :error="args.error" :options="[]" :on-select="() => {}" />
      </FormControl>
    `
  }),
  args: {
    variant: FormControlVariant.horizontal
  }
};
