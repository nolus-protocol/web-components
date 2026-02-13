import type { Meta, StoryObj } from '@storybook/vue3'

import Radio from './Radio.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Components/Atoms/Radio",
  component: Radio,
  argTypes: {},
  args: {}, // default value
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    id: 'radio-1',
    label: 'Radio',
    name: 'radio',
  },
};

export const RadioGroup: Story = {
  render: () => ({
    components: { Radio },
    template: `
      <div class="flex flex-col gap-2">
        <Radio id="radio-1" label="Option A" name="group" :checked="true" />
        <Radio id="radio-2" label="Option B" name="group" />
      </div>
    `,
  }),
};
